"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { StatusDot } from "@/components/primitives";
import { CAREER_START } from "@/lib/data";

/* Status bar per redesign.md §5.00 — chrome that *is* content.
   Answers the recruiter's first question (available? where? when?) at a glance. */

function istTime(): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
    hour12: false,
  }).format(new Date());
}

/** Three lines of texture on load, then it settles. Never loops (§6). */
const BOOT_LOG = [
  "redis     connected · 94% hit rate",
  "mongodb   connected · replica set healthy",
  "workers   3 online · queue depth 0",
];

function uptime(): string {
  const years =
    (Date.now() - CAREER_START.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  return `${years.toFixed(1)} years shipping backend systems`;
}

export function StatusBar({ onResume }: { onResume: () => void }) {
  // rendered client-side only: server and client clocks would never agree
  const [time, setTime] = useState<string | null>(null);
  const [log, setLog] = useState<string | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setTime(istTime()));
    const id = window.setInterval(() => setTime(istTime()), 30_000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(id);
    };
  }, []);

  // three lines of live-system texture, then it settles into the clock (§6).
  // never loops — a permanent ticker would be ambient noise, which is banned.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers = BOOT_LOG.map((line, i) =>
      window.setTimeout(() => setLog(line), 900 + i * 700)
    );
    timers.push(
      window.setTimeout(() => setLog(null), 900 + BOOT_LOG.length * 700)
    );
    return () => timers.forEach(window.clearTimeout);
  }, []);

  return (
    <header className="no-print fixed inset-x-0 top-0 z-30 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur">
      <div className="mx-auto flex h-11 w-full max-w-[1280px] items-center gap-4 px-6 font-mono text-[11px]">
        <span className="flex items-center gap-2 whitespace-nowrap" title={uptime()}>
          <StatusDot />
          <span className="text-[var(--foreground)]">OPERATIONAL</span>
        </span>

        <span className="hidden truncate text-[var(--text-secondary)] sm:inline">
          senior backend engineer @ delightree
        </span>

        <span
          aria-hidden={log ? "true" : undefined}
          className="hidden min-w-0 flex-1 truncate text-[var(--text-tertiary)] lg:inline"
        >
          {log ?? (time ? `IST ${time}` : "")}
        </span>

        <span className="ml-auto flex items-center gap-3">
          <span className="hidden text-[var(--ember)] sm:inline">open to offers</span>
          <Link
            href="/resume"
            className="text-[var(--text-secondary)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:underline"
          >
            resume
          </Link>
          <ThemeToggle />
          <CommandMenu onResume={onResume} />
        </span>
      </div>
    </header>
  );
}
