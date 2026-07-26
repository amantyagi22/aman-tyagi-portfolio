import { Container } from "@/components/ui/Container";
import { chapters, focusAreas, links, treeNodes, writing, yearsOfExperience } from "@/lib/data";

const branches = [...new Set(treeNodes.map((n) => n.branch))];

export function RecruiterResume() {
  return (
    <Container>
      <div className="mx-auto max-w-3xl py-12 text-sm leading-relaxed">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">
              Aman Tyagi
            </h1>
            <p className="text-[var(--muted)]">Backend Engineer · India</p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print rounded-full border border-[var(--border)] px-4 py-1.5 text-xs font-mono text-[var(--muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
          >
            Print / Save PDF
          </button>
        </div>

        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
          <a className="underline underline-offset-2" href={links.email}>
            amantyagi2k@gmail.com
          </a>
          <a className="underline underline-offset-2" href={links.github}>
            github.com/amantyagi22
          </a>
          <a className="underline underline-offset-2" href={links.linkedin}>
            linkedin.com/in/aman-tyagi-700a06190
          </a>
        </p>

        <p className="mt-6 text-[var(--muted)]">
          Backend engineer with {yearsOfExperience()} years across distributed
          systems, performance engineering, data modeling, and AI/RAG. Node.js,
          TypeScript, MongoDB, Redis, GraphQL, AWS. Available for backend
          consulting.
        </p>

        <h2 className="mt-8 border-b border-[var(--border)] pb-1 font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
          Experience
        </h2>
        {chapters.map((c) => (
          <div key={c.company} className="mt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold text-[var(--foreground)]">
                {c.company}{" "}
                <span className="font-normal text-[var(--muted)]">— {c.role}</span>
              </p>
              <p className="font-mono text-xs text-[var(--muted)]">{c.period}</p>
            </div>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[var(--muted)]">
              {c.items.map((item) => (
                <li key={item.title}>
                  <span className="text-[var(--foreground)]">{item.title}.</span>{" "}
                  {item.description} ({item.impact})
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="mt-5 text-xs text-[var(--muted)]">
          Earlier: Backend Lead Intern, Duckcart (2022) · DevOps Engineer Intern,
          Recruit CRM (2022–23).
        </p>

        <h2 className="mt-8 border-b border-[var(--border)] pb-1 font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
          Skills
        </h2>
        <dl className="mt-3 space-y-1.5">
          {branches.map((b) => (
            <div key={b} className="flex flex-wrap gap-x-2">
              <dt className="w-20 shrink-0 font-mono text-xs uppercase text-[var(--muted)]">
                {b}
              </dt>
              <dd className="flex-1 text-[var(--muted-strong)]">
                {treeNodes
                  .filter((n) => n.branch === b)
                  .map((n) => n.label)
                  .join(", ")}
              </dd>
            </div>
          ))}
        </dl>

        <h2 className="mt-8 border-b border-[var(--border)] pb-1 font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
          Focus Areas
        </h2>
        <p className="mt-3 text-[var(--muted)]">
          {focusAreas.map((f) => f.label).join(" · ")}
        </p>

        <h2 className="mt-8 border-b border-[var(--border)] pb-1 font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
          Writing (in progress)
        </h2>
        <p className="mt-3 text-[var(--muted)]">{writing.join(" · ")}</p>
      </div>
    </Container>
  );
}
