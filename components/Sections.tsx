import Link from "next/link";
import {
  Arrow,
  Pill,
  Shapes,
  SocialIcons,
  wide,
  wrap,
} from "@/components/Page";
import {
  branchTitles,
  chapters,
  incidents,
  prologue,
  scaleFacts,
  treeNodes,
  yearsOfExperience,
} from "@/lib/data";
import { projects } from "@/lib/work";
import { posts } from "@/lib/writing";

const rise = (i: number) => ({ "--i": i }) as React.CSSProperties;

/* A small label over a big heading: how every home section opens */
function Heading({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-12 md:gap-10">
      <p className="label flex items-center gap-2 self-start pt-3 md:col-span-3">
        <span className="size-2 rounded-full bg-orange" />
        {label}
      </p>
      <h2 className="display text-[clamp(2.5rem,6vw,5.5rem)] md:col-span-9">
        {children}
      </h2>
    </div>
  );
}

/* Sized off the viewport height as well as the width, so the whole hero
   fits the first screen and the numbers peek in under it. */
export function Hero() {
  return (
    <section className={`${wide} pt-6 md:pt-8`}>
      <p className="label rise flex items-center gap-2">
        <span className="breathe size-2 rounded-full bg-orange" />
        Open to offers, available now
      </p>
      <h1
        className="display rise mt-4 text-[clamp(3.75rem,min(12.5vw,18svh),12rem)] leading-[0.82]"
        style={rise(1)}
      >
        Aman Tyagi
      </h1>

      <div className="mt-8 grid gap-3 md:grid-cols-12">
        <div
          className="rise flex flex-col justify-between gap-8 py-1 md:col-span-7 md:pr-10"
          style={rise(2)}
        >
          <p className="max-w-[24ch] text-[clamp(1.75rem,min(3.4vw,6svh),3rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
            I build the systems you never think about, until they stop working.
          </p>
          <SocialIcons />
        </div>

        <div
          className="rise relative flex min-h-[clamp(12rem,32svh,20rem)] flex-col justify-between gap-4 overflow-hidden rounded-[2rem] bg-orange p-6 md:col-span-5 lg:p-8"
          style={rise(3)}
        >
          <Shapes
            className="max-h-[12svh] w-full [@media(max-height:700px)]:hidden max-w-[22rem] self-end"
            stroke="var(--ink)"
          />
          <div className="mt-auto flex items-end justify-between gap-6">
            <p className="label max-w-[24ch]">
              AI & backend engineer, India · IST
            </p>
            <p className="text-right">
              <span className="display block text-[clamp(3rem,min(7vw,11svh),6.5rem)]">
                {yearsOfExperience()}
              </span>
              <span className="label">years in production</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Numbers() {
  return (
    <section className={`${wrap} mt-12 md:mt-14`} aria-label="In numbers">
      <ul className="grid grid-cols-2 border-y border-line md:grid-cols-4">
        {scaleFacts.map((f) => (
          <li
            key={f.label}
            className="border-line py-8 pr-4 even:border-l even:pl-5 [&:nth-child(-n+2)]:border-b md:py-10 md:pl-8 md:[&:not(:first-child)]:border-l md:first:pl-0 md:[&:nth-child(-n+2)]:border-b-0"
          >
            <p className="display text-[clamp(3rem,6vw,5.5rem)] tabular-nums">
              {f.value.replace(/[+×]$/, "")}
              <sup className="ml-[0.04em] align-[0.9em] text-[0.4em] text-orange">
                {f.value.match(/[+×]$/)?.[0]}
              </sup>
            </p>
            <p className="label mt-4 text-soft">{f.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const row =
  "flex items-center justify-between gap-3 rounded-lg bg-ink/[0.04] px-3 py-2";

const BAND = [
  "AI agents",
  "System design",
  "RAG",
  "Databases",
  "Backend",
  "LLM evals",
  "Distributed systems",
];

/* An orange strip of what I do, sliding sideways: solid and hollow words in
   turn, a dot between each. CSS only; it stands still under reduced motion. Doubled so the loop
   has no seam. */
export function Band() {
  const run = (
    <p className="flex shrink-0 items-center text-[clamp(2.25rem,4.5vw,4.25rem)] leading-[1.1] font-semibold tracking-[-0.035em] whitespace-nowrap">
      {/* twice over: seven words is odd, so one pass would put two solid words together at the seam */}
      {[...BAND, ...BAND].map((w, i) => (
        <span key={i} className="flex items-center">
          <span
            className={
              i % 2
                ? "text-orange [-webkit-text-stroke:0.05em_var(--ink)] [paint-order:stroke_fill]"
                : ""
            }
          >
            {w}
          </span>
          <span className="mx-[0.5em] size-[0.2em] rounded-full bg-ink" />
        </span>
      ))}
    </p>
  );
  return (
    <div aria-hidden="true" className="mt-24 px-3 md:mt-32 md:px-5">
      <div className="overflow-hidden rounded-[2rem] bg-orange py-7 md:py-9">
        {/* words fade in and out at the ends instead of being cut by the corners */}
        <div className="[mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]">
          <div className="marquee flex w-max">
            {run}
            {run}
          </div>
        </div>
      </div>
    </div>
  );
}

/* A tiny sketch of what each system does, drawn in markup. Decorative
   (the summary says it in words) and generic: no real names or data. */
function Sketch({ slug }: { slug: string }) {
  if (slug === "debugging-simulator")
    return (
      <>
        <p className="label text-soft">Your investigation</p>
        {["Read the error logs", "Traced the slow query"].map((t) => (
          <p key={t} className={row}>
            {t}
            <span className="grid size-5 place-items-center rounded-full bg-ink text-[0.625rem] text-paper">
              ✓
            </span>
          </p>
        ))}
        <p className={`${row} bg-orange/15`}>
          Coach: check the deploy first
          <span className="size-2 rounded-full bg-orange" />
        </p>
      </>
    );
  if (slug === "launch-risk-agent")
    return (
      <>
        <p className="label text-soft">Openings by risk</p>
        {[
          ["Opening A", "w-full bg-orange", "Late"],
          ["Opening B", "w-1/2 bg-ink/25", "On track"],
          ["Opening C", "w-1/4 bg-ink/25", "On track"],
        ].map(([name, bar, tag]) => (
          <p key={name} className={row}>
            <span className="shrink-0">{name}</span>
            <span className="h-1.5 flex-1 rounded-full bg-ink/[0.06]">
              <span className={`block h-full rounded-full ${bar}`} />
            </span>
            <span
              className={`shrink-0 text-right text-xs font-medium whitespace-nowrap ${tag === "Late" ? "text-orange" : "text-soft"}`}
            >
              {tag}
            </span>
          </p>
        ))}
      </>
    );
  return (
    <>
      <p className="label text-soft">Your workspace only</p>
      <p className="max-w-[85%] self-end rounded-lg rounded-br-sm bg-ink px-3 py-2 text-paper">
        What is our refund policy?
      </p>
      <div className="max-w-[90%] space-y-2 rounded-lg rounded-bl-sm bg-ink/[0.04] px-3 py-2.5">
        <span className="block h-1.5 w-full rounded-full bg-ink/15" />
        <span className="block h-1.5 w-3/4 rounded-full bg-ink/15" />
        <span className="flex gap-1.5 pt-1">
          {["Policy.pdf", "Handbook"].map((d) => (
            <span
              key={d}
              className="rounded-full bg-orange/15 px-2 py-0.5 text-xs font-medium"
            >
              {d}
            </span>
          ))}
        </span>
      </div>
    </>
  );
}

/* The case studies on black. The nav's "Work" scrolls here. */
export function SelectedWork() {
  return (
    <section id="work" className="mt-3 px-3 md:px-5">
      <div className="rounded-[2rem] bg-ink text-paper">
        <div className={`${wrap} py-14 md:py-20`}>
          <Heading label="Selected work">
            Three systems,
            <br />
            <span className="text-orange">written up.</span>
          </Heading>
          <ul className="mt-12 grid gap-3 md:mt-16 lg:grid-cols-3">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/work/${p.slug}`}
                  className="group flex h-full flex-col gap-8 rounded-[1.5rem] bg-paper/[0.06] p-6 ring-1 ring-paper/10 transition-colors duration-200 hover:bg-orange hover:text-ink hover:ring-orange md:p-8"
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className="label text-paper/55 transition-colors group-hover:text-ink/70">
                      {String(i + 1).padStart(2, "0")} · {p.context}
                    </span>
                    <Arrow className="bg-paper text-ink group-hover:bg-ink group-hover:text-paper" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-52 flex-col justify-center gap-2 rounded-2xl bg-paper p-4 text-sm text-ink"
                  >
                    <Sketch slug={p.slug} />
                  </span>
                  <span>
                    <span className="block text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance">
                      {p.title}
                    </span>
                    <span className="mt-4 block leading-relaxed text-pretty text-paper/70 transition-colors group-hover:text-ink/80">
                      {p.summary}
                    </span>
                  </span>
                  <span className="mt-auto block border-t border-paper/15 pt-6 transition-colors group-hover:border-ink/20">
                    <span className="display block text-[clamp(2.75rem,4vw,3.75rem)] text-orange transition-colors group-hover:text-ink">
                      {p.proof[0].value}
                    </span>
                    <span className="label mt-2 block text-paper/60 transition-colors group-hover:text-ink/70">
                      {p.proof[0].label}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* Company, role, years: the reference's table. The resume has the detail. */
export function Experience() {
  return (
    <section id="experience" className={`${wrap} mt-24 md:mt-32`}>
      <Heading label="Experience">Where it shipped.</Heading>
      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
        <div className="md:col-span-3">
          <Pill href="/resume">Full resume</Pill>
        </div>
        <ul className="md:col-span-9">
          {chapters.map((c) => (
            <li
              key={c.company}
              className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b border-line py-7 first:border-t sm:grid-cols-[16rem_1fr_auto] sm:items-baseline"
            >
              <span className="text-[clamp(1.5rem,2.4vw,2.125rem)] leading-tight font-semibold tracking-[-0.035em]">
                {c.company}
              </span>
              <span className="text-lg text-[var(--text-secondary)] max-sm:order-last max-sm:col-span-2">
                {c.role}
              </span>
              <span className="label text-soft tabular-nums">
                {c.dates.replace(/\d{2}\./g, "")}
              </span>
            </li>
          ))}
          <li className="pt-6 text-lg text-soft">{prologue}</li>
        </ul>
      </div>
    </section>
  );
}

/* Postmortems as a numbered list: number, title, severity, a pill that
   opens the rest. The open one lifts into an orange card and the rules
   around it step aside. Native <details>, so it works without JS. */
export function Incidents() {
  return (
    <section id="incidents" className={`${wrap} mt-24 md:mt-32`}>
      <Heading label="Incidents">When it broke.</Heading>
      <ol className="mt-12 border-b border-line has-[li:last-child_details[open]]:border-transparent md:mt-16">
        {incidents.map((inc, i) => {
          const post = posts.find((p) => p.incident === inc.id);
          return (
            <li
              key={inc.id}
              className="border-t border-line has-[details[open]]:border-transparent [li:has(details[open])+&]:border-transparent"
            >
              <details className="group rounded-[2rem] px-4 transition-colors duration-500 open:bg-orange/10 md:px-8">
                <summary className="grid grid-cols-[2.5rem_1fr] items-center gap-x-4 gap-y-4 py-8 md:grid-cols-12 md:gap-10 md:py-10">
                  <span className="label self-start pt-2 tabular-nums md:col-span-1 md:self-center md:pt-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[clamp(1.75rem,3.2vw,3rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance md:col-span-7">
                    {inc.title}
                  </span>
                  <span className="col-start-2 flex items-center justify-between gap-4 md:col-span-4 md:col-start-auto">
                    <span className="label text-soft">
                      <span
                        className={`capitalize ${inc.severity === "high" ? "text-orange" : ""}`}
                      >
                        {inc.severity}
                      </span>{" "}
                      severity
                    </span>
                    <span className="press inline-flex items-center gap-2 rounded-full border border-current/25 px-5 py-2.5 text-sm font-medium group-open:border-ink group-open:bg-ink group-open:text-paper">
                      <span className="group-open:hidden">Read</span>
                      <span className="hidden group-open:inline">Close</span>
                      <span className="plus text-base leading-none">+</span>
                    </span>
                  </span>
                </summary>
                <div className="grid gap-4 pb-12 md:grid-cols-12 md:gap-10">
                  <div className="max-w-[60ch] space-y-5 max-md:pl-14 md:col-span-7 md:col-start-2">
                    <p className="text-xl leading-relaxed text-ink/75">
                      {inc.impact}
                    </p>
                    <p className="display text-[clamp(1.75rem,3vw,2.5rem)]">
                      {inc.resolution}
                    </p>
                    <p className="text-xl leading-relaxed">{inc.learning}</p>
                    {post ? (
                      <Link
                        href={`/writing/${post.slug}`}
                        className="label inline-block underline decoration-orange underline-offset-4 hover:text-orange"
                      >
                        {post.draft ? "Full write-up (draft)" : "Full write-up"}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

const tile =
  "flex min-h-60 flex-col justify-between gap-8 rounded-[2rem] p-6 md:p-8";

/* Six equal tiles: the five groups, each read as one sentence, and an
   orange tile that points to the resume for where each was used. */
export function Stack() {
  return (
    <section id="stack" className={`${wrap} mt-24 md:mt-32`}>
      <Heading label="Stack">What I build with.</Heading>
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
        {branchTitles.map(([branch, title]) => (
          <li key={branch} className={`${tile} @container bg-white`}>
            <h3 className="label text-soft">{title}</h3>
            {/* sized off the tile, not the window, so the longest unbroken item always fits */}
            <p className="text-[clamp(1.25rem,8cqi,1.75rem)] leading-[1.15] font-medium tracking-[-0.035em]">
              {treeNodes
                .filter((n) => n.branch === branch)
                .map((n, j, all) => (
                  <span key={n.id} className="whitespace-nowrap">
                    {n.label}
                    {j < all.length - 1 ? ", " : "."}
                  </span>
                ))
                .flatMap((el, j) => (j ? [" ", el] : [el]))}
            </p>
          </li>
        ))}
        <li>
          <Link
            href="/resume"
            className={`${tile} group relative h-full overflow-hidden bg-orange`}
          >
            <Shapes className="w-48 self-end" stroke="var(--ink)" />
            <span className="flex items-end justify-between gap-4">
              <span className="text-[clamp(1.25rem,1.75vw,1.5rem)] leading-[1.15] font-medium tracking-[-0.035em]">
                Where each one shipped.
              </span>
              <Arrow />
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
