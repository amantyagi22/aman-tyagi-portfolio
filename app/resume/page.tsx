import Link from "next/link";
import { PrintButton, RecruiterResume } from "@/components/RecruiterResume";
import { links } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/resume",
  "Resume",
  "Senior software engineer: production RAG, LLM agents and multi-tenant backends. Printable resume.",
);

/* Static, no motion, prints to one clean page. */

export default function ResumePage() {
  return (
    <div className="min-h-[100dvh]">
      <div className="no-print mx-auto flex w-full max-w-6xl items-center justify-between px-5 pt-5 md:px-10">
        <Link
          href="/"
          className="press label rounded-full border border-line px-3 py-1.5 hover:border-ink"
        >
          ← Aman Tyagi
        </Link>
        <div className="flex items-center gap-2">
          <PrintButton />
          <a
            href={links.email}
            className="press rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:bg-orange"
          >
            Get in touch
          </a>
        </div>
      </div>
      <RecruiterResume />
    </div>
  );
}
