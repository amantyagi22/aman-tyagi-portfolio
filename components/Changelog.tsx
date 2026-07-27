"use client";

import { releases, type ChangeKind } from "@/lib/data";
import { Reveal } from "@/components/motion/Reveal";
import { Chip, SectionOpener } from "@/components/primitives";

/* Career as release notes (redesign.md §5.06). Dense by design — this is a
   scan target, not a read target, so it uses the tightest spacing tier. */

const KIND_LABEL: Record<ChangeKind, string> = {
  "+": "added",
  "!": "changed",
  "#": "fixed",
};

export function Changelog() {
  return (
    <section
      id="changelog"
      className="section-dense border-t border-[var(--border)]"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <Reveal>
          <SectionOpener label="05 · Changelog" title="Shipped, by release" />
        </Reveal>

        <div className="mt-14 max-w-4xl">
          {releases.map((release) => (
            <Reveal key={release.version}>
              <article className="grid gap-x-10 gap-y-3 border-t border-[var(--border)] py-6 sm:grid-cols-[9rem_1fr]">
                <header>
                  <p className="font-mono text-[0.9375rem] font-semibold tabular-nums text-[var(--foreground)]">
                    {release.version}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-[var(--text-tertiary)]">
                    {release.date}
                  </p>
                  <p className="mt-2">
                    <Chip>{release.scale}</Chip>
                  </p>
                </header>

                <div>
                  <h3 className="font-mono text-[0.8125rem] text-[var(--text-secondary)]">
                    {release.title}
                  </h3>
                  <ul className="mt-3 space-y-1.5">
                    {release.changes.map((change) => (
                      <li
                        key={change.text}
                        className="flex gap-3 font-mono text-[0.8125rem] leading-relaxed"
                      >
                        <span
                          aria-hidden="true"
                          className={
                            change.kind === "#"
                              ? "text-[var(--ember)]"
                              : "text-[var(--text-tertiary)]"
                          }
                        >
                          {change.kind}
                        </span>
                        <span className="sr-only">{KIND_LABEL[change.kind]}:</span>
                        <span className="text-[var(--text-secondary)]">
                          {change.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
