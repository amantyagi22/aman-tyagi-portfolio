"use client";

import { headlineProofs, yearsOfExperience } from "@/lib/data";
import { Prompt } from "@/components/primitives";
import { BootLine, useBoot } from "@/components/BootSequence";
import dynamic from "next/dynamic";

// WebGL must not block first paint — the copy is the priority (§14)
const HobbyStage = dynamic(
  () => import("@/components/three/HobbyStage").then((m) => m.HobbyStage),
  { ssr: false, loading: () => null }
);

/* One screen. The pitch — name, role, tagline, two hard numbers, availability —
   fits above the fold, so nothing important is behind a scroll. The old version
   pinned 300vh to cross-fade three panels; the two extra panels only restated
   this one and duplicated the Connect links, so the scroll cost bought nothing. */

export function Opening() {
  const boot = useBoot();

  return (
    <section id="about" className="relative h-screen overflow-hidden">
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

      <div className="absolute inset-0">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center px-6">
          <div className="w-full max-w-md">
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
          </div>
        </div>
      </div>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] text-[var(--muted)]">
        scroll ↓
      </p>
    </section>
  );
}
