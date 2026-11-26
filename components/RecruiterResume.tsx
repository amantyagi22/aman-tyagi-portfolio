"use client";

import {
  branchTitles,
  chapters,
  focusAreas,
  links,
  treeNodes,
  yearsOfExperience,
} from "@/lib/data";

const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
/* "06.2025 - present" reads as "Jun 2025 - Present" */
const prettyDates = (d: string) =>
  d
    .replace(/(\d{2})\.(\d{4})/g, (_, m, y) => `${MONTHS[Number(m) - 1]} ${y}`)
    .replace("present", "Present");

const CONTACT = [
  { label: links.email.replace(/^mailto:/, ""), href: links.email },
  { label: "+91 639 695 2072", href: links.phone },
  { label: "github.com/amantyagi22", href: links.github },
  {
    label: links.linkedin.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""),
    href: links.linkedin,
  },
  { label: "amantyagi.me", href: links.site },
];

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="press label rounded-full border border-line px-3 py-1.5 whitespace-nowrap hover:border-ink"
    >
      Save PDF
    </button>
  );
}

/* A Swiss row, like the rest of the site: label left, content right. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-5 border-t border-line py-10 md:grid-cols-12 md:gap-10 print:block print:py-5">
      <h2 className="label pt-1.5 text-soft md:col-span-3 print:mb-4 print:pt-0">{label}</h2>
      <div className="min-w-0 md:col-span-9">{children}</div>
    </section>
  );
}

export function RecruiterResume() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-14 pb-20 md:px-10 md:pt-20 print:p-0">
      <header className="pb-12 print:pb-6">
        <h1 className="display text-[clamp(3.25rem,8vw,6rem)]">Aman Tyagi</h1>
        <p className="mt-5 text-xl font-medium tracking-[-0.02em] md:text-2xl">
          Senior Software Engineer, AI &amp; Backend
          <span className="text-soft"> · India</span>
        </p>
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] text-[var(--text-secondary)]">
          {CONTACT.map((c) => (
            <li key={c.href}>
              <a
                href={c.href}
                className="underline decoration-line underline-offset-4 hover:text-ink hover:decoration-orange"
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[58ch] text-lg leading-relaxed text-pretty md:text-xl">
          {yearsOfExperience()} years building production RAG, LLM agents and
          multi-tenant backends on Node.js, Python, MongoDB and AWS. I take
          features from prototype to production and lead cross-team releases.
        </p>
      </header>

      <Row label="Experience">
        <div className="space-y-14 print:space-y-8">
          {chapters.map((c) => (
            <article key={c.company}>
              <div className="flex break-after-avoid flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">{c.company}</h3>
                <p className="label text-soft tabular-nums">{prettyDates(c.dates)}</p>
              </div>
              <p className="mt-1 break-after-avoid text-[var(--text-secondary)]">
                {c.role} <span className="text-soft">· {c.location}</span>
              </p>
              <ul className="mt-6 max-w-[68ch] space-y-6">
                {c.items.map((item) => (
                  <li key={item.title} className="break-inside-avoid border-l-2 border-orange pl-4">
                    <p className="font-semibold tracking-[-0.01em]">{item.title}</p>
                    <p className="mt-1 leading-relaxed text-[var(--text-secondary)]">
                      {item.description}
                    </p>
                    <p className="mt-2 text-[0.9375rem] font-medium first-letter:uppercase">{item.impact}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
          <p className="text-[var(--text-secondary)]">
            <span className="font-semibold text-ink">Earlier</span>
            <span className="text-soft"> · </span>
            Founding Engineer, Duckcart (2022)
            <span className="text-soft"> · </span>
            DevOps Engineer Intern, Recruit CRM (2022-23)
          </p>
        </div>
      </Row>

      <Row label="Skills">
        <dl className="divide-y divide-line">
          {branchTitles.map(([b, title]) => (
            <div key={b} className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[10rem_1fr] sm:gap-6">
              <dt className="label pt-1 text-soft">{title}</dt>
              <dd className="leading-relaxed">
                {treeNodes
                  .filter((n) => n.branch === b)
                  .map((n) => n.label)
                  .join(", ")}
              </dd>
            </div>
          ))}
        </dl>
      </Row>

      <Row label="Focus areas">
        <ul className="flex flex-wrap gap-2">
          {focusAreas.map((f) => (
            <li key={f.label} className="rounded-full border border-line px-4 py-2 text-[0.9375rem]">
              {f.label}
            </li>
          ))}
        </ul>
      </Row>
    </div>
  );
}
