"use client";

import { useEffect, useRef, useState } from "react";
import { headlineProofs, links, yearsOfExperience } from "@/lib/data";
import { Prompt } from "@/components/primitives";
import { BootLine, useBoot } from "@/components/BootSequence";
import dynamic from "next/dynamic";

// WebGL must not block first paint — the copy is the priority (§14)
const HobbyStage = dynamic(
  () => import("@/components/three/HobbyStage").then((m) => m.HobbyStage),
  { ssr: false, loading: () => null }
);

/* three beats over the pinned scroll; each panel owns a slice of progress */
const BEATS = [0, 0.42, 0.78];

export function Opening() {
  const sectionRef = useRef<HTMLElement>(null);
  const [beat, setBeat] = useState(0);
  const boot = useBoot();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    const read = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      const p = scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0;
      let next = 0;
      for (let i = BEATS.length - 1; i >= 0; i--) {
        if (p >= BEATS[i]) {
          next = i;
          break;
        }
      }
      setBeat(next);
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

  return (
    <section ref={sectionRef} id="about" className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* the life outside the terminal: gym, badminton, swimming, as a
            still life that turns slowly. On phones it sits in the lower
            third, clear of the headline; on wide screens, the right half. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 h-[42%] opacity-70 md:inset-y-0 md:left-auto md:right-0 md:h-auto md:w-[58%] md:opacity-100">
          <HobbyStage />
        </div>

        {/* scrim keeps overlay text legible over the scene:
            vertical on phones, horizontal on wide screens */}
        <div className="scrim-v pointer-events-none absolute inset-0 md:hidden" />
        <div className="scrim-h pointer-events-none absolute inset-0 hidden md:block" />

        <div className="pointer-events-none absolute inset-0">
          <div className="mx-auto flex h-full w-full max-w-6xl items-center px-6">
            <div className="relative w-full max-w-md">
              {/* Beat 0 carries the whole 30-second answer: role, seniority,
                  two hard numbers. Nothing important waits for a scroll. */}
              <Panel active={beat === 0}>
                {boot === 2 ? <Prompt>whoami</Prompt> : <BootLine stage={boot} />}
                {/* resolves with the boot; text is present at frame one so
                    reading is never delayed (§13 rule 3) */}
                <div
                  style={{
                    opacity: boot === 2 ? 1 : 0,
                    transform: boot === 2 ? "none" : "translateY(6px)",
                    transition:
                      "opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)",
                  }}
                >
                  {/* name leads: it's the h1, so screen readers and search
                      results open with who this is, not what they do */}
                  <h1 className="t-display mt-5 text-[var(--foreground)]">
                    Aman Tyagi.
                  </h1>
                  {/* mono + tracking so the role reads as a label, not as
                      another sentence competing with the tagline below */}
                  <p className="mt-3 font-mono text-[0.9375rem] tracking-[0.06em] text-[var(--ember)]">
                    Backend Engineer
                  </p>
                <p className="t-lead mt-5 max-w-[34ch] text-[var(--text-secondary)]">
                  I build the systems you never think about — until they stop
                  working.
                </p>
                <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
                  {headlineProofs.map((proof) => (
                    <div key={proof.label}>
                      <dt className="t-metric text-[var(--foreground)]">
                        {proof.value}
                      </dt>
                      <dd className="mt-1.5 max-w-[20ch] text-[0.8125rem] leading-snug text-[var(--text-secondary)]">
                        {proof.label}
                      </dd>
                    </div>
                  ))}
                </dl>
                  <p className="t-label mt-8">
                    {yearsOfExperience()} years · India · open to offers
                  </p>
                </div>
              </Panel>

              <Panel active={beat === 1}>
                <Prompt>cat about.txt</Prompt>
                <p className="t-h1 mt-5 max-w-[18ch] text-[var(--foreground)]">
                  The best backend work is invisible.
                </p>
                <p className="t-lead mt-4 text-[var(--text-secondary)]">
                  Distributed systems, performance work, and the platforms other
                  teams build on. This is the visible version.
                </p>
              </Panel>

              <Panel active={beat === 2}>
                <Prompt>ls ~/contact</Prompt>
                <p className="t-lead mt-5 max-w-[30ch] text-[var(--text-secondary)]">
                  Open to backend and platform roles.
                </p>
                <div className="pointer-events-auto mt-6 flex flex-wrap gap-3 text-sm text-[var(--text-secondary)]">
                  {[
                    ["GitHub", links.github],
                    ["LinkedIn", links.linkedin],
                    ["Email", links.email],
                  ].map(([label, href]) => (
                    <a
                      key={label}
                      href={href}
                      className="rounded-full border border-[var(--border)] bg-[var(--bg)]/60 px-3.5 py-1.5 backdrop-blur transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        </div>

        <p
          className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] text-[var(--muted)] transition-opacity duration-200"
          style={{ opacity: beat === 2 ? 0 : 1 }}
        >
          scroll ↓
        </p>
      </div>
    </section>
  );
}

/* panels share one grid cell so they cross-fade in place, no layout shift.
   `inert` keeps hidden panels out of the tab order — aria-hidden alone
   would still let keyboard users land on invisible links. */
function Panel({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-hidden={!active}
      inert={!active}
      className="transition-all duration-300 ease-out"
      style={{
        position: active ? "relative" : "absolute",
        inset: active ? undefined : 0,
        opacity: active ? 1 : 0,
        transform: active ? "none" : "translateY(8px)",
        pointerEvents: active ? undefined : "none",
      }}
    >
      {children}
    </div>
  );
}
