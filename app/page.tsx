"use client";

import { useRouter } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { PrimaryButton } from "@/components/ui/Button";
import { StatusBar } from "@/components/StatusBar";
import { ShortcutOverlay } from "@/components/ShortcutOverlay";
import { Opening } from "@/components/Opening";
import { SystemOverview } from "@/components/SystemOverview";
import { RequestJourney } from "@/components/RequestJourney";
import { Services } from "@/components/Services";
import { Incidents } from "@/components/Incidents";
import { Changelog } from "@/components/Changelog";
import { StackGraph } from "@/components/StackGraph";
import { Workspace } from "@/components/Workspace";
import { SectionOpener } from "@/components/primitives";
import { links } from "@/lib/data";

export default function Home() {
  const router = useRouter();
  const openResume = () => router.push("/resume");

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--foreground)]">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-14 focus:z-50 focus:rounded-full focus:bg-[var(--foreground)] focus:px-4 focus:py-2 focus:text-xs focus:font-medium focus:text-[var(--bg)]"
      >
        Skip to content
      </a>

      <StatusBar onResume={openResume} />
      <ShortcutOverlay />

      <main id="content" className="relative z-10">
        <Opening />
        <SystemOverview />
        <RequestJourney />
        <Services />
        <Incidents />

        <section
          id="stack"
          className="section-standard border-t border-[var(--border)]"
        >
          <div className="mx-auto w-full max-w-[1280px] px-6">
            <Reveal>
              <SectionOpener
                label="05 · Stack"
                title="How the pieces depend on each other"
                lead="Select a node to focus it. Select a second to trace the path between them."
              />
            </Reveal>
            <StackGraph />
          </div>
        </section>

        <Changelog />

        <section
          id="contact"
          className="section-dense border-t border-[var(--border)]"
        >
          <div className="mx-auto w-full max-w-[1280px] px-6">
            <div className="grid items-center gap-12 md:grid-cols-[1fr_1.1fr]">
              <Reveal>
                <SectionOpener
                  label="07 · Connect"
                  title="Let's build something scalable."
                  lead="Open to backend and platform engagements. Based in India, working across timezones."
                />
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <PrimaryButton href={links.email}>
                    <MailIcon />
                    Email Aman
                  </PrimaryButton>
                  <IconLink href={links.github} label="GitHub">
                    <GitHubIcon />
                  </IconLink>
                  <IconLink href={links.linkedin} label="LinkedIn">
                    <LinkedInIcon />
                  </IconLink>
                  <IconLink href="/resume" label="Resume" />
                </div>
              </Reveal>

              <Workspace />
            </div>
          </div>
        </section>
      </main>

      <footer className="no-print border-t border-[var(--border)] py-8">
        <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-3 px-6">
          <p className="font-mono text-[11px] text-[var(--text-tertiary)]">
            Built with Next.js and Three.js.
          </p>
          <p className="font-mono text-[11px] text-[var(--text-tertiary)]">
            press <span className="text-[var(--text-secondary)]">?</span> for
            shortcuts
          </p>
        </div>
      </footer>
    </div>
  );
}

/* Icons inherit currentColor, so light/dark comes free from the link's text
   color — no separate per-theme assets. */

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
    >
      {children}
      {label}
    </a>
  );
}

function MailIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.4 21h5.16V9.5H2.4V21Zm7.72 0h5.16v-6.2c0-1.66.32-3.26 2.37-3.26 2.02 0 2.05 1.89 2.05 3.37V21h5.16v-7.14c0-4.24-.92-7.5-5.87-7.5-2.38 0-3.98 1.31-4.64 2.55h-.07V9.5h-4.16V21Z" />
    </svg>
  );
}
