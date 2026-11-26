import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Diagram } from "@/components/Diagram";
import {
  PageHeader,
  PageShell,
  Pill,
  Tags,
  TextSection,
  wrap,
} from "@/components/Page";
import { pageMeta } from "@/lib/seo";
import { getProject, projects } from "@/lib/work";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return p ? pageMeta(`/work/${p.slug}`, p.title, p.summary) : {};
}

export default async function ProjectPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  return (
    <PageShell>
      <PageHeader
        crumb={{ label: "← Work", href: "/#work" }}
        title={p.title}
        lede={p.summary}
      >
        <p className="label mt-6 text-soft">{p.context}</p>
        {p.live || p.repo ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {p.live ? (
              <Pill href={p.live} tone="solid">
                Live demo
              </Pill>
            ) : null}
            {p.repo ? <Pill href={p.repo}>Code on GitHub</Pill> : null}
          </div>
        ) : null}
      </PageHeader>

      {/* the proof strip on black: the numbers first, then the stack */}
      <section className="mb-10 px-3 md:mb-16 md:px-5">
        <div className="rounded-[2rem] bg-ink text-paper">
          <div className={`${wrap} py-10 md:py-14`}>
            <ul className="grid gap-8 sm:grid-cols-3">
              {p.proof.map((f) => (
                <li key={f.label}>
                  <p className="display text-[clamp(3rem,5vw,4.5rem)] text-orange tabular-nums">
                    {f.value}
                  </p>
                  <p className="label mt-3 text-paper/70">{f.label}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Tags items={p.stack} />
            </div>
          </div>
        </div>
      </section>

      {p.sections.map((s) => (
        <TextSection
          key={s.title}
          title={s.title}
          body={s.body}
          steps={s.steps}
        >
          {s.title === "Architecture" ? <Diagram spec={p.diagram} /> : null}
        </TextSection>
      ))}
    </PageShell>
  );
}
