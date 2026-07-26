"use client";

import { useEffect, useRef, useState } from "react";

/* Boot sequence (redesign.md §5, item 16): a system coming online.
   Three rules from the spec, all load-bearing:
   1. never blocks — any scroll or key press resolves it instantly
   2. runs once per session (sessionStorage)
   3. text is legible at frame one; only the theatre is animated */

const STORAGE_KEY = "booted";

/** 0 = pre-boot, 1 = nodes lighting, 2 = resolved. */
export type BootStage = 0 | 1 | 2;

export function useBoot(): BootStage {
  // start resolved: SSR and reduced-motion both want the finished state
  const [stage, setStage] = useState<BootStage>(2);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, "1");

    const resolve = () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
      setStage(2);
    };

    // rAF avoids a synchronous setState in the effect body
    const raf = requestAnimationFrame(() => {
      setStage(0);
      timers.current = [
        window.setTimeout(() => setStage(1), 600),
        window.setTimeout(() => setStage(2), 1500),
      ];
    });

    window.addEventListener("wheel", resolve, { passive: true, once: true });
    window.addEventListener("touchstart", resolve, { passive: true, once: true });
    window.addEventListener("keydown", resolve, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      timers.current.forEach(window.clearTimeout);
      window.removeEventListener("wheel", resolve);
      window.removeEventListener("touchstart", resolve);
      window.removeEventListener("keydown", resolve);
    };
  }, []);

  return stage;
}

/** The status line that types itself while the system starts. */
export function BootLine({ stage }: { stage: BootStage }) {
  if (stage === 2) return null;
  return (
    <p
      aria-hidden="true"
      className="font-mono text-[0.8125rem] text-[var(--text-tertiary)]"
    >
      <span className="text-[var(--ember)]">~$</span> booting aman.systems
      <span className="boot-caret">▌</span>
    </p>
  );
}
