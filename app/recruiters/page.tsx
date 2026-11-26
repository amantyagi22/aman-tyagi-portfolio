import Link from "next/link";
import { Arrow, PageHeader, PageShell, SocialIcons, wrap } from "@/components/Page";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/recruiters",
  "For recruiters",
  "Aman Tyagi in one minute: Senior Software Engineer targeting SDE 2, AI engineer and backend roles. India, IST, open to remote.",
);

/* The one-minute page: role and stack, then three proofs.
   The contact block the shell adds is the way to act. */

const FACTS: { label: string; value: string }[] = [
  {
    label: "Now",
    value: "Senior Software Engineer at Delightree",
  },
  {
    label: "Stack",
    value:
      "Node.js, TypeScript, Python, MongoDB, Redis, AWS, RAG and LLM agents",
  },
];

const PROOF = [
  {
    value: "600k+",
    label:
      "users moved between chat providers in under 50 minutes, zero downtime",
    href: "/#incidents",
  },
  {
    value: "90x",
    label: "faster leaderboard, 4.5 seconds to 50 milliseconds",
    href: "/#incidents",
  },
  {
    value: "110+",
    label: "tests behind an AI agent I took from my own prototype to beta",
    href: "/work/launch-risk-agent",
  },
];

export default function RecruitersPage() {
  return (
    <PageShell>
      <PageHeader
        title="For recruiters"
        lede="Backend and AI engineer with production RAG, LLM agents and multi-tenant systems behind me."
        aside={<SocialIcons />}
      />

      <dl className={wrap}>
        {FACTS.map((f) => (
          <div
            key={f.label}
            className="grid gap-2 border-t border-line py-4 last:border-b md:grid-cols-12 md:gap-10"
          >
            <dt className="label pt-1.5 text-soft md:col-span-3">{f.label}</dt>
            <dd className="text-[clamp(1.125rem,1.6vw,1.375rem)] leading-snug font-medium tracking-[-0.025em] md:col-span-9">
              {f.value}
            </dd>
          </div>
        ))}
      </dl>

      <section aria-label="Proof" className="mt-12 px-3 md:mt-16 md:px-5">
        <ul className="grid gap-3 md:grid-cols-3">
          {PROOF.map((p, i) => (
            <li key={p.value}>
              <Link
                href={p.href}
                className={`press flex h-full min-h-56 flex-col justify-between gap-8 rounded-[2rem] p-6 md:p-7 ${
                  i === 1 ? "bg-orange text-ink" : "bg-ink text-paper"
                }`}
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="display text-[clamp(3rem,5vw,4.5rem)] tabular-nums">
                    {p.value}
                  </span>
                  <Arrow
                    className={
                      i === 1 ? "bg-ink text-paper" : "bg-paper text-ink"
                    }
                  />
                </span>
                <span className="max-w-[28ch] leading-snug">{p.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
