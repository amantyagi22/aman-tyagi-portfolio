"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cacheSkips, journeyHops, type Hop } from "@/lib/data";
import { Label, SectionOpener } from "@/components/primitives";
import { prefersReducedMotion } from "@/components/motion/Reveal";

/* Request journey (redesign.md §5.02) — scroll IS the request's progress.
   Every number is derived from lib/data, so the visual and the text can
   never disagree. Reduced motion renders the same thing as a static,
   fully-annotated diagram (§13). */

type CacheMode = "hit" | "miss";
type LoadMode = 1 | 100;

function hopCost(hop: Hop, cache: CacheMode, load: LoadMode): number {
  const base = cache === "hit" ? hop.hit : hop.miss;
  return load === 100 ? base * hop.loadFactor : base;
}

function isSkipped(hop: Hop, cache: CacheMode): boolean {
  return cache === "hit" && cacheSkips.has(hop.id);
}

function format(ms: number): string {
  if (ms === 0) return "0ms";
  return ms < 10 ? `${ms.toFixed(1)}ms` : `${Math.round(ms)}ms`;
}

export function RequestJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const [cache, setCache] = useState<CacheMode>("hit");
  const [load, setLoad] = useState<LoadMode>(1);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReduced(prefersReducedMotion()));
    return () => cancelAnimationFrame(raf);
  }, []);

  const active = useMemo(
    () => journeyHops.filter((h) => !isSkipped(h, cache)),
    [cache]
  );

  const total = useMemo(
    () => active.reduce((sum, h) => sum + hopCost(h, cache, load), 0),
    [active, cache, load]
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable > 0) {
        // pinned (desktop): progress is how far through the pin we are
        setProgress(Math.min(Math.max(-rect.top / scrollable, 0), 1));
      } else {
        // short section (mobile): advance as it crosses the viewport
        const span = window.innerHeight + rect.height;
        setProgress(
          Math.min(Math.max((window.innerHeight - rect.top) / span, 0), 1)
        );
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // reduced motion shows the finished journey, not a frozen first frame
  const reach = reduced ? active.length : progress * active.length;
  const currentIndex = Math.min(Math.floor(reach), active.length - 1);
  const elapsed = active
    .slice(0, reduced ? active.length : Math.ceil(reach))
    .reduce((sum, h) => sum + hopCost(h, cache, load), 0);

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative border-t border-[var(--border)] md:h-[320vh]"
    >
      <div className="md:sticky md:top-11 md:flex md:h-[calc(100vh-2.75rem)] md:items-center">
        <div className="mx-auto w-full max-w-[1280px] px-6 py-20 md:py-0">
          <SectionOpener
            label="02 · Request journey"
            title="One request, end to end"
            lead="The read path behind the retrieval engine. Scroll to follow a single request; change the conditions to see why it's built this way."
          />

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Toggle
              label="cache"
              options={["hit", "miss"] as const}
              value={cache}
              onChange={setCache}
            />
            <Toggle
              label="load"
              options={[1, 100] as const}
              value={load}
              onChange={setLoad}
              render={(v) => `${v}×`}
            />
            <p className="font-mono text-[0.8125rem] text-[var(--text-secondary)]">
              elapsed{" "}
              <span className="tabular-nums text-[var(--foreground)]">
                {format(elapsed)}
              </span>
              <span className="text-[var(--text-tertiary)]">
                {" "}
                / {format(total)}
              </span>
            </p>
          </div>

          {/* the flow: horizontal on desktop, vertical on phones (§16).
              skipped hops shrink rather than vanish, so the short-circuit
              reads as the request jumping over them */}
          <ol
            className="mt-10 grid gap-x-2 gap-y-3 md:flex md:gap-y-0"
            style={{ alignItems: "start" }}
          >
            {journeyHops.map((hop) => {
              const skipped = isSkipped(hop, cache);
              const idx = active.indexOf(hop);
              const reached = !skipped && idx > -1 && reach >= idx + 0.5;
              const isCurrent = !skipped && idx === currentIndex && !reduced;
              return (
                <li
                  key={hop.id}
                  aria-current={isCurrent ? "step" : undefined}
                  className="flex min-w-0 items-center gap-3 md:block"
                  style={{
                    opacity: skipped ? 0.28 : reached ? 1 : 0.45,
                    flexGrow: skipped ? 0.34 : 1,
                    flexBasis: 0,
                    transition:
                      "opacity var(--dur-base) var(--ease-out), flex-grow var(--dur-base) var(--ease-inout)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="block h-8 w-px shrink-0 md:h-px md:w-full"
                    style={{
                      background: reached
                        ? "var(--ember)"
                        : "var(--border-strong)",
                      transition: "background-color var(--dur-fast) linear",
                    }}
                  />
                  <div className="min-w-0 md:mt-3">
                    <p className="truncate font-mono text-[0.8125rem] text-[var(--foreground)]">
                      {hop.label}
                    </p>
                    <p className="truncate font-mono text-[11px] text-[var(--text-tertiary)]">
                      {skipped ? "skipped" : hop.detail}
                    </p>
                    <p
                      className="mt-1 font-mono text-[11px] tabular-nums"
                      style={{
                        color: reached
                          ? "var(--ember)"
                          : "var(--text-tertiary)",
                      }}
                    >
                      {skipped ? "—" : `+${format(hopCost(hop, cache, load))}`}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* caption region has a reserved height so nothing shifts (§QA) */}
          <div className="mt-10 min-h-24 max-w-[var(--measure)] border-t border-[var(--border)] pt-6">
            <Label>
              {reduced
                ? "Full path"
                : `Hop ${currentIndex + 1} of ${active.length} · ${
                    active[currentIndex]?.label ?? ""
                  }`}
            </Label>
            <p
              aria-live="polite"
              className="t-lead mt-3 text-[var(--text-secondary)]"
            >
              {reduced
                ? cache === "hit"
                  ? "On a cache hit the request returns from Redis in single-digit milliseconds — the database, vector store, and queue are never touched. That is what the 94% hit rate buys."
                  : "On a miss the request pays for MongoDB, hybrid search in Weaviate, and an async fan-out to the queue. Every hop below shows its real cost."
                : active[currentIndex]?.caption}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Toggle<T extends string | number>({
  label,
  options,
  value,
  onChange,
  render = (v) => String(v),
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  render?: (v: T) => string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Label as="span">{label}</Label>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex rounded-full border border-[var(--border)] p-0.5"
      >
        {options.map((option) => {
          const selected = option === value;
          return (
            <button
              key={String(option)}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option)}
              className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${
                selected
                  ? "bg-[var(--surface-raised)] text-[var(--foreground)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--foreground)]"
              }`}
            >
              {render(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
