import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, PageHeader, PageShell, wrap } from "@/components/Page";
import { pageMeta } from "@/lib/seo";
import { posts } from "@/lib/writing";

export const metadata = pageMeta(
  "/writing",
  "Writing",
  "Deep dives on real engineering decisions: migrations, performance and production LLM systems.",
);

export default function WritingPage() {
  // no "coming soon" page: until a post is published, the route does not exist
  if (!posts.length) notFound();

  return (
    <PageShell>
      <PageHeader title="Writing" lede="Real decisions, written up: the problem, what I did, what I would change." />
      <ul className={`${wrap}`}>
        {posts.map((p) => (
          <li key={p.slug} className="border-t border-line last:border-b">
            <Link href={`/writing/${p.slug}`} className="group grid gap-3 py-8 md:grid-cols-12 md:items-center md:gap-10">
              <span className="label text-soft md:col-span-3">{p.draft ? "Draft, dev only" : p.date}</span>
              <span className="md:col-span-8">
                <span className="block text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight font-semibold tracking-[-0.035em] group-hover:text-orange">
                  {p.title}
                </span>
                <span className="mt-2 block max-w-[60ch] text-lg text-[var(--text-secondary)]">{p.summary}</span>
              </span>
              <span className="md:col-span-1 md:justify-self-end">
                <Arrow />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
