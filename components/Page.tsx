import Link from "next/link";
import { links } from "@/lib/data";
import { CopyEmail } from "@/components/CopyEmail";
import { posts } from "@/lib/writing";

/* Only the hero runs wide; every other section sits in a calmer column */
export const wide = "mx-auto w-full max-w-[1440px] px-5 md:px-10";
export const wrap = "mx-auto w-full max-w-6xl px-5 md:px-10";

/* Three items, like the reference: everything else lives in the footer */
const NAV = [
  { label: "Work", href: "/#work" },
  { label: "Recruiters", href: "/recruiters" },
];

const FOOTER = [
  { label: "How I build", href: "/how-i-build" },
  { label: "Resume", href: "/resume" },
  ...(posts.length ? [{ label: "Writing", href: "/writing" }] : []),
];

/* Every page: the floating bar, the content, the dark contact block, the footer. */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div id="top" className="min-h-[100dvh] pt-20">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>
      <Nav />
      <main id="content">
        {children}
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-3">
      {/* an approximation of Apple's Liquid Glass: there is no official web version */}
      <nav
        aria-label="Main"
        className="glass flex items-center gap-0.5 rounded-full p-1 text-[0.8125rem] whitespace-nowrap sm:p-1.5 sm:text-sm"
      >
        <Link
          href="/"
          className="press rounded-full px-2 py-2 font-semibold sm:px-3 tracking-[-0.01em] hover:bg-ink/5"
        >
          Aman Tyagi
        </Link>
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="press rounded-full px-2 py-2 hover:bg-ink/5 sm:px-3"
          >
            {n.label}
          </Link>
        ))}
        <CopyEmail
          email={links.email}
          className="ml-0.5 bg-ink px-3 py-2 sm:ml-1 sm:px-3.5 text-paper hover:bg-orange"
        />
      </nav>
    </header>
  );
}

/* The top of a sub-page: a pill back up, a big title, one line of why. */
export function PageHeader({
  crumb,
  title,
  lede,
  aside,
  children,
}: {
  crumb?: { label: string; href: string };
  title: string;
  lede: string;
  /* sits on the title's baseline, at the right edge */
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className={`${wrap} pt-6 pb-14 md:pt-8 md:pb-20`}>
      {crumb ? (
        <Link
          href={crumb.href}
          className="press label inline-block rounded-full border border-line px-3 py-1.5 hover:border-ink"
        >
          {crumb.label}
        </Link>
      ) : null}
      <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
        <h1 className="display rise max-w-[16ch] text-[clamp(3rem,8vw,7.5rem)] text-balance">
          {title}
        </h1>
        {aside}
      </div>
      <p
        className="rise mt-6 max-w-[48ch] text-lg leading-relaxed text-pretty text-[var(--text-secondary)] md:text-xl"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        {lede}
      </p>
      {children}
    </section>
  );
}

/* A Swiss row: the label in the left column, the content in the right. */
export function TextSection({
  id,
  title,
  body,
  steps,
  children,
}: {
  id?: string;
  title: string;
  body: string[];
  steps?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className={wrap}>
      <div className="grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-10 md:py-14">
        <h2 className="label pt-1.5 text-soft md:col-span-3">{title}</h2>
        <div className="min-w-0 md:col-span-9 lg:col-span-8">
          {children}
          {steps ? (
            <ol className="space-y-3">
              {body.map((t, i) => (
                <li key={i} className="flex gap-4 text-lg leading-relaxed">
                  <span className="label shrink-0 pt-1.5 text-orange tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="max-w-[62ch] space-y-4">
              {body.map((t, i) => (
                <p key={i} className="text-lg leading-relaxed text-pretty">
                  {t}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <li
          key={t}
          className="label rounded-full border border-current/20 px-3 py-1.5"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

/* An arrow in a filled circle: the reference's one recurring ornament */
export function Arrow({
  className = "bg-ink text-paper",
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-10 shrink-0 place-items-center rounded-full ${className}`}
    >
      <svg
        viewBox="0 0 16 16"
        className="arrow size-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
      </svg>
    </span>
  );
}

const PILL = {
  solid: "bg-ink text-paper hover:bg-orange",
  onOrange: "bg-ink text-paper hover:bg-paper hover:text-ink",
  outline:
    "border border-current/25 hover:border-ink hover:bg-ink hover:text-paper",
};

export function Pill({
  href,
  children,
  tone = "outline",
}: {
  href: string;
  children: React.ReactNode;
  tone?: keyof typeof PILL;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      className={`press inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium ${PILL[tone]}`}
    >
      {children}
      {external ? <span aria-hidden="true">↗</span> : null}
    </a>
  );
}

/* One outline circle and two half discs, the reference's geometry. */
export function Shapes({
  className = "",
  fill = "var(--ink)",
  stroke = "var(--paper)",
}: {
  className?: string;
  fill?: string;
  stroke?: string;
}) {
  return (
    <svg viewBox="0 0 300 150" aria-hidden="true" className={className}>
      <circle
        cx="75"
        cy="75"
        r="73"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path d="M225 0A75 75 0 0 0 225 150Z" fill={fill} />
      <path d="M300 0A75 75 0 0 0 300 150Z" fill={fill} />
    </svg>
  );
}

function Contact() {
  return (
    <section id="contact" className="mt-24 px-3 md:mt-32 md:px-5">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink text-paper">
        <Shapes
          className="absolute -top-6 right-8 hidden w-[24rem] opacity-90 md:block"
          fill="var(--orange)"
          stroke="var(--paper)"
        />
        <div className={`${wrap} relative py-14 md:py-20`}>
          <h2 className="display text-[clamp(3.25rem,9vw,8rem)]">
            <span className="text-paper/45">Let&apos;s build</span>
            <br />
            the next one.
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="max-w-[44ch] text-lg leading-relaxed text-paper/75">
                Hiring for SDE 2, AI or backend roles? I&apos;m in India (IST),
                open to remote and available immediately.
              </p>
              <CopyEmail
                email={links.email}
                label={links.email.replace(/^mailto:/, "")}
                className="mt-8 bg-paper px-6 py-3.5 text-base font-medium text-ink hover:bg-orange"
              />
            </div>
            <ul className="flex flex-col gap-2 text-[clamp(1.75rem,2.6vw,2.25rem)] font-semibold tracking-[-0.04em] md:col-span-5 md:items-end">
              <li>
                <a
                  href={links.linkedin}
                  target="_blank"
                  rel="noopener"
                  className="hover:text-orange"
                >
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener"
                  className="hover:text-orange"
                >
                  GitHub ↗
                </a>
              </li>
              <li>
                <Link href="/resume" className="hover:text-orange">
                  Resume →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The row of links, then the name so big the page edge cuts it off. */
function Footer() {
  return (
    <footer>
      <div
        className={`${wrap} label flex flex-col gap-4 py-8 text-soft md:flex-row md:items-center md:justify-between`}
      >
        <span>© {new Date().getFullYear()} Aman Tyagi · India, IST</span>
        <nav aria-label="More" className="flex flex-wrap gap-x-5 gap-y-2">
          {FOOTER.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
        <a href="#top" className="hover:text-ink">
          ↑ Back to top
        </a>
      </div>
      <div aria-hidden="true" className="h-[11vw] overflow-hidden">
        <p className="display text-center text-[18.5vw] leading-[0.8] whitespace-nowrap">
          Aman Tyagi
        </p>
      </div>
    </footer>
  );
}

/* The reference's row of black circles: brand marks (official glyphs) and a page */
const ICONS = [
  {
    label: "LinkedIn",
    href: links.linkedin,
    fill: true,
    d: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45z",
  },
  {
    label: "GitHub",
    href: links.github,
    fill: true,
    d: "M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57l-.02-2.04c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3",
  },
  {
    label: "Resume",
    href: "/resume",
    fill: false,
    d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zM14 2v4a2 2 0 0 0 2 2h4M16 13H8M16 17H8M10 9H8",
  },
];

export function SocialIcons() {
  return (
    <ul className="flex gap-1">
      {ICONS.map((i) => (
        <li key={i.label}>
          <a
            href={i.href}
            aria-label={i.label}
            title={i.label}
            {...(i.href.startsWith("http")
              ? { target: "_blank", rel: "noopener" }
              : {})}
            className="press grid size-12 place-items-center rounded-full bg-ink text-paper hover:bg-orange"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-5"
              {...(i.fill
                ? { fill: "currentColor" }
                : {
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: 1.75,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                  })}
            >
              <path d={i.d} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
