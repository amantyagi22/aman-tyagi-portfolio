"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { chapters, prologue, type Chapter } from "@/lib/data";
import { Reveal } from "@/components/motion/Reveal";

const ChapterVisual = dynamic(
  () => import("@/components/three/Scenes").then((m) => m.ChapterVisual),
  { ssr: false, loading: () => <div className="h-56 w-full md:h-72" /> }
);

const EXPAND = 320; // --dur-base
const COLLAPSE = Math.round(EXPAND * 0.8);

function Details({ chapter }: { chapter: Chapter }) {
  const [open, setOpen] = useState(false);
  const dur = open ? EXPAND : COLLAPSE;
  const id = `details-${chapter.company.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="mt-5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="font-mono text-xs text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
      >
        <span
          className="mr-2 inline-block"
          style={{
            transform: open ? "rotate(45deg)" : "none",
            transition: `transform ${dur}ms var(--ease-inout)`,
          }}
        >
          +
        </span>
        the details
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
          <ul className="mt-4 space-y-3 border-l border-[var(--border)] pl-4">
            {chapter.items.map((item, i) => (
              <li
                key={item.title}
                style={
                  open
                    ? {
                        opacity: 1,
                        transition: `opacity var(--dur-fast) var(--ease-out) ${i * 40}ms`,
                      }
                    : { opacity: 0, transition: `opacity ${COLLAPSE}ms var(--ease-inout)` }
                }
              >
                <p className="text-sm text-[var(--muted)]">
                  <span className="font-semibold text-[var(--foreground)]">
                    {item.title}.
                  </span>{" "}
                  {item.description}{" "}
                  <span className="font-mono text-xs text-[var(--ember)]">
                    ▸ {item.impact}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function Story() {
  return (
    <div className="mt-10 space-y-20">
      {chapters.map((c, i) => (
        <Reveal key={c.company}>
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <ChapterVisual kind={c.scene} />
            </div>
            <div className={i % 2 === 1 ? "md:order-1" : ""}>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                {i === 0 ? (
                  <span className="text-[var(--ember)]">Current</span>
                ) : (
                  c.arc
                )}{" "}
                · {c.period}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                {c.company}
                <span className="ml-3 text-sm font-normal text-[var(--muted)]">
                  {c.role}
                </span>
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
                {c.narrative}
              </p>
              <div className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
                {c.stats.map((s) => (
                  <div key={s.label}>
                    <p className="font-mono text-2xl font-semibold tabular-nums text-[var(--foreground)]">
                      {s.value}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--muted)]">{s.label}</p>
                  </div>
                ))}
              </div>
              <Details chapter={c} />
            </div>
          </div>
        </Reveal>
      ))}
      <Reveal>
        <p className="font-mono text-xs text-[var(--muted)]">{prologue}</p>
      </Reveal>
    </div>
  );
}
