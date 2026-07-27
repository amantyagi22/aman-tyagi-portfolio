"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { chapters, prologue, type Chapter } from "@/lib/data";
import { Reveal } from "@/components/motion/Reveal";
import { Chip, SectionOpener, StatusDot } from "@/components/primitives";

const ChapterVisual = dynamic(
  () => import("@/components/three/Scenes").then((m) => m.ChapterVisual),
  { ssr: false, loading: () => <div className="h-56 w-full md:h-72" /> }
);

const EXPAND = 320; // --dur-base
const COLLAPSE = Math.round(EXPAND * 0.8);

const SCENE_DESCRIPTIONS: Record<string, string> = {
  realtime:
    "Animated diagram: a row of bars fluctuating continuously, representing live analytics updating in real time.",
  hotpath:
    "Animated diagram: a descending series of bars showing request latency collapsing from 4.5 seconds to 50 milliseconds, with a request marker accelerating along the top.",
  platform:
    "Animated diagram: three stacked platform layers with four tenant blocks on top, one highlighted to show per-tenant isolation.",
};

/* Work reframed as deployed services (redesign.md §5.03).
   Metrics are never collapsed — only the deep detail is behind a click,
   and the trigger says what it reveals. */

function Inspect({ chapter }: { chapter: Chapter }) {
  const [open, setOpen] = useState(false);
  const dur = open ? EXPAND : COLLAPSE;
  const id = `inspect-${chapter.service}`;

  return (
    <div className="mt-6">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3.5 py-1.5 font-mono text-[11px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
      >
        <span
          aria-hidden="true"
          className="inline-block"
          style={{
            transform: open ? "rotate(45deg)" : "none",
            transition: `transform ${dur}ms var(--ease-inout)`,
          }}
        >
          +
        </span>
        {open ? "hide" : "inspect"} {chapter.items.length} shipped systems
      </button>

      <div
        id={id}
        className="grid"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: `grid-template-rows ${dur}ms var(--ease-inout)`,
        }}
      >
        <div className="overflow-hidden">
          <ul className="mt-5 space-y-4 border-l border-[var(--border)] pl-5">
            {chapter.items.map((item, i) => (
              <li
                key={item.title}
                style={
                  open
                    ? {
                        opacity: 1,
                        transition: `opacity var(--dur-fast) var(--ease-out) ${i * 40}ms`,
                      }
                    : {
                        opacity: 0,
                        transition: `opacity ${COLLAPSE}ms var(--ease-inout)`,
                      }
                }
              >
                <p className="text-[0.9375rem] text-[var(--foreground)]">
                  {item.title}
                </p>
                <p className="t-body mt-1 text-[var(--text-secondary)]">
                  {item.description}
                </p>
                <p className="mt-1.5 font-mono text-[11px] text-[var(--text-tertiary)]">
                  → {item.impact}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ chapter, current }: { chapter: Chapter; current: boolean }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="flex items-center gap-2 font-mono text-[0.8125rem] text-[var(--foreground)]">
          <StatusDot live={current} />
          {chapter.service}
        </span>
        <Chip tone={current ? "active" : "neutral"}>
          {chapter.version}
          {current ? " · current" : ""}
        </Chip>
      </div>

      <h3 className="t-h2 mt-4 text-[var(--foreground)]">{chapter.company}</h3>
      <p className="mt-1 text-[0.9375rem] text-[var(--text-secondary)]">
        {chapter.role}
        <span className="mx-2 text-[var(--text-tertiary)]">·</span>
        <span className="font-mono text-[0.8125rem] text-[var(--text-tertiary)]">
          {chapter.period}
        </span>
      </p>

      <p className="t-body mt-4 text-[var(--text-secondary)]">
        {chapter.narrative}
      </p>

      {/* always visible — this is the evidence, it never hides */}
      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t border-[var(--border)] pt-5">
        {chapter.stats.map((stat) => (
          <div key={stat.label}>
            <dt className="font-mono text-xl font-semibold tabular-nums text-[var(--foreground)]">
              {stat.value}
            </dt>
            <dd className="mt-1 text-[0.8125rem] text-[var(--text-secondary)]">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>

      <Inspect chapter={chapter} />
    </div>
  );
}

export function Services() {
  return (
    <section id="services" className="section-standard border-t border-[var(--border)]">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <Reveal>
          <SectionOpener
            label="02 · Services"
            title="What I've shipped, most recent first"
          />
        </Reveal>

        <div className="mt-16 space-y-20">
          {chapters.map((chapter, i) => (
            <Reveal key={chapter.service}>
              <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <ChapterVisual kind={chapter.scene} />
                  {/* text twin: the canvas is aria-hidden, so describe it (§17) */}
                  <p className="sr-only">
                    {SCENE_DESCRIPTIONS[chapter.scene]}
                  </p>
                </div>
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <ServiceCard chapter={chapter} current={i === 0} />
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal>
            <p className="border-t border-[var(--border)] pt-6 font-mono text-[11px] text-[var(--text-tertiary)]">
              {prologue}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
