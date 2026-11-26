import Link from "next/link";
import { PageHeader, PageShell, wrap } from "@/components/Page";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/how-i-build",
  "How I build",
  "Six rules Aman Tyagi follows when shipping LLM features, each one in use in a case study.",
);

/* Each practice names where it is in use, so every claim on this page can be
   checked against a case study rather than taken on faith. */
const PRACTICES: {
  rule: string;
  detail: string;
  where: { label: string; href: string }[];
}[] = [
  {
    rule: "The decision stays deterministic. The model explains it.",
    detail:
      "Scores and flags come from code that returns the same answer twice. The LLM ranks, drafts and coaches on top, so a bad generation is an annoyance, not a wrong decision.",
    where: [
      { label: "debugging simulator", href: "/work/debugging-simulator" },
      { label: "launch-risk agent", href: "/work/launch-risk-agent" },
    ],
  },
  {
    rule: "Grade against a fixed set.",
    detail:
      "A golden test set for answers, backtests for predictions. A change is better when the numbers say so, not when a few manual tries look good.",
    where: [
      { label: "RAG assistant", href: "/work/rag-assistant" },
      { label: "launch-risk agent", href: "/work/launch-risk-agent" },
    ],
  },
  {
    rule: "Decline below a confidence floor.",
    detail:
      'An answer without a source it can cite is not an answer. Saying "I could not find this" is a feature.',
    where: [{ label: "RAG assistant", href: "/work/rag-assistant" }],
  },
  {
    rule: "Bound the cost in the design, not the invoice.",
    detail:
      "Rolling summarization keeps the context, and the token bill, flat as a conversation grows.",
    where: [{ label: "RAG assistant", href: "/work/rag-assistant" }],
  },
  {
    rule: "Plan the failure path first.",
    detail:
      "A fallback model, then a fixed message, and the score never depends on either. A dead-letter queue so one bad record cannot sink a nightly run.",
    where: [
      { label: "debugging simulator", href: "/work/debugging-simulator" },
      { label: "launch-risk agent", href: "/work/launch-risk-agent" },
    ],
  },
  {
    rule: "Trace every call.",
    detail:
      "Every prompt, retrieval and response is traced, so a wrong answer can be replayed step by step instead of guessed at.",
    where: [{ label: "RAG assistant", href: "/work/rag-assistant" }],
  },
];

export default function HowIBuildPage() {
  return (
    <PageShell>
      <PageHeader
        title="How I build"
        lede="Six rules for shipping LLM features, each one in use in a case study."
      />

      <ol className={wrap}>
        {PRACTICES.map((p, i) => (
          <li key={p.rule} className="grid gap-3 border-t border-line py-8 last:border-b md:grid-cols-12 md:gap-10">
            <span className="display text-5xl text-orange tabular-nums md:col-span-3">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="md:col-span-9">
              <p className="text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight font-semibold tracking-[-0.035em]">
                {p.rule}
              </p>
              <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-[var(--text-secondary)]">{p.detail}</p>
              <p className="label mt-4 flex flex-wrap gap-x-4 gap-y-2 text-soft">
                <span>In use:</span>
                {p.where.map((w) => (
                  <Link key={w.href} href={w.href} className="text-ink underline underline-offset-4 hover:text-orange">
                    {w.label}
                  </Link>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ol>

    </PageShell>
  );
}
