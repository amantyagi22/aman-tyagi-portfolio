"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { links, yearsOfExperience } from "@/lib/data";

const DeskStage = dynamic(
  () => import("@/components/three/DeskStage").then((m) => m.DeskStage),
  { ssr: false }
);

/* three beats over the pinned scroll; each panel owns a slice of progress */
const BEATS = [0, 0.42, 0.78];

export function Opening() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    const read = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      const p = scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0;
      progress.current = p;
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
        <div className="absolute inset-0">
          <DeskStage progressRef={progress} />
        </div>

        {/* scrim keeps overlay text legible wherever the desk sits behind it:
            vertical on phones (text above desk), horizontal on wide screens */}
        <div className="scrim-v pointer-events-none absolute inset-0 md:hidden" />
        <div className="scrim-h pointer-events-none absolute inset-0 hidden md:block" />

        <div className="pointer-events-none absolute inset-0">
          <div className="mx-auto flex h-full w-full max-w-6xl items-center px-6">
            <div className="relative w-full max-w-md">
              <Panel active={beat === 0}>
                <p className="font-mono text-xs text-[var(--ember)]">
                  ~$ whoami
                </p>
                <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-tight text-[var(--foreground)] md:text-7xl">
                  Aman Tyagi
                </h1>
                <p className="mt-4 text-lg text-[var(--muted)] md:text-xl">
                  Backend Engineer · {yearsOfExperience()} yrs · India
                </p>
              </Panel>

              <Panel active={beat === 1}>
                <p className="font-mono text-xs text-[var(--ember)]">
                  ~$ cat about.txt
                </p>
                <p className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-[var(--foreground)] md:text-4xl">
                  The best backend work is invisible.
                </p>
                <p className="mt-3 text-lg text-[var(--muted)]">
                  This is the visible version.
                </p>
              </Panel>

              <Panel active={beat === 2}>
                <p className="font-mono text-xs text-[var(--ember)]">
                  ~$ ls ~/desk
                </p>
                <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--muted)] md:text-lg">
                  Distributed systems, performance work, and the platforms other
                  teams build on — all of it shipped from here.
                </p>
                <div className="pointer-events-auto mt-6 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                  {[
                    ["GitHub", links.github],
                    ["LinkedIn", links.linkedin],
                    ["Email", links.email],
                  ].map(([label, href]) => (
                    <a
                      key={label}
                      href={href}
                      className="rounded-full border border-[var(--border)] bg-[var(--bg)]/60 px-3 py-1 backdrop-blur transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
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

/* panels share one grid cell so they cross-fade in place, no layout shift */
function Panel({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      aria-hidden={!active}
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
