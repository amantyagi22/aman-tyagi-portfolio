import type { Metadata } from "next";
import Link from "next/link";
import { RecruiterResume } from "@/components/RecruiterResume";

export const metadata: Metadata = {
  title: "Aman Tyagi — Resume",
  description:
    "Backend engineer: distributed systems, performance engineering, data modeling, and retrieval. Printable resume.",
};

/* A real URL, not a mode toggle (redesign.md §14). Static, no motion,
   prints to one clean page. */

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--foreground)]">
      <div className="no-print border-b border-[var(--border)]">
        <div className="mx-auto flex h-11 w-full max-w-[1280px] items-center px-6">
          <Link
            href="/"
            className="font-mono text-[11px] text-[var(--text-secondary)] transition-colors hover:text-[var(--foreground)]"
          >
            ← aman.systems
          </Link>
        </div>
      </div>
      <RecruiterResume />
    </div>
  );
}
