"use client";

import { focusAreas, scaleFacts, stackList } from "@/lib/data";
import { Reveal } from "@/components/motion/Reveal";
import { Label, Metric, SectionOpener } from "@/components/primitives";

/* System overview per redesign.md §5.01 — the 30-second answer, as a
   borderless three-column ledger. Everything here is real, indexable text. */

export function SystemOverview() {
  return (
    <section id="overview" className="section-standard border-t border-[var(--border)]">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <Reveal>
          <SectionOpener
            label="01 · System overview"
            title="What I do, and at what scale"
          />
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          <Reveal>
            <div>
              <Label>Specialization</Label>
              <ul className="mt-5 space-y-3">
                {focusAreas.map((area) => (
                  <li
                    key={area.label}
                    className="border-b border-[var(--border)] pb-3 last:border-0"
                  >
                    <p className="text-[0.9375rem] text-[var(--foreground)]">
                      {area.label}
                    </p>
                    <p className="mt-1 font-mono text-[11px] leading-relaxed text-[var(--text-tertiary)]">
                      {area.proof}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <Label>Scale</Label>
              {/* two-up on phones so five metrics stay scannable, one column
                  once there's a dedicated column to fill */}
              <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 md:grid-cols-1 md:gap-y-6">
                {scaleFacts.map((fact) => (
                  <li key={fact.label}>
                    <Metric value={fact.value} label={fact.label} />
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <div>
              <Label>Stack</Label>
              <ul className="mt-5 space-y-3 font-mono text-[0.8125rem] text-[var(--text-secondary)]">
                {stackList.map((row) => (
                  <li
                    key={row}
                    className="border-b border-[var(--border)] pb-3 last:border-0"
                  >
                    {row}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
