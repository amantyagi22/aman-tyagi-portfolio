"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PrimaryButton } from "@/components/ui/Button";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Opening } from "@/components/Opening";
import { Story } from "@/components/Story";
import { StackGraph } from "@/components/StackGraph";
import { RecruiterResume } from "@/components/RecruiterResume";
import { links, writing } from "@/lib/data";

export default function Home() {
  const [recruiter, setRecruiter] = useState(false);

  return (
    <div
      className={`relative min-h-screen bg-[var(--bg)] text-[var(--foreground)] ${
        recruiter ? "no-motion" : ""
      }`}
    >
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-xs focus:font-medium focus:text-black"
      >
        Skip to content
      </a>
      <header className="no-print fixed top-0 z-30 w-full border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur">
        <Container>
          <div className="flex h-16 items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold tracking-tight">
                Aman Tyagi
              </span>
              <span className="hidden text-xs font-mono text-[var(--muted)] sm:inline">
                Backend Engineer
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRecruiter((r) => !r)}
                aria-pressed={recruiter}
                className={`rounded-full border px-3 py-1 text-xs font-mono transition-colors ${
                  recruiter
                    ? "border-[var(--ember)] text-[var(--ember)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                }`}
              >
                {recruiter ? "Exit Recruiter Mode" : "Recruiter Mode"}
              </button>
              <div className="hidden items-center gap-2 md:flex">
                <ThemeToggle />
                {!recruiter ? (
                  <CommandMenu onResume={() => setRecruiter(true)} />
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </header>

      <main id="content" className="relative z-10">
        {recruiter ? (
          <div className="pt-16">
            <RecruiterResume />
          </div>
        ) : (
          <>
            <Opening />

            <section id="story" className="border-t border-[var(--border)] py-20">
              <Container>
                <Reveal>
                  <SectionHeader
                    kicker="The work"
                    title="Most recent first"
                  />
                </Reveal>
                <Story />
              </Container>
            </section>

            <section id="stack" className="border-t border-[var(--border)] py-20">
              <Container>
                <Reveal>
                  <SectionHeader
                    kicker="Interlude"
                    title="The stack, as a dependency graph"
                  />
                </Reveal>
                <StackGraph />
              </Container>
            </section>

            <section id="contact" className="border-t border-[var(--border)] py-20">
              <Container>
                <Reveal>
                  <SectionHeader
                    kicker="Epilogue"
                    title="Let's build something scalable."
                    description="Open to collaborations, advisory work, and backend architecture engagements."
                  />
                  <p className="mt-6 font-mono text-xs text-[var(--muted)]">
                    currently drafting: {writing.join(" · ").toLowerCase()}
                  </p>
                  <div className="mt-8">
                    <PrimaryButton href={links.email}>Email Aman</PrimaryButton>
                  </div>
                </Reveal>
              </Container>
            </section>
          </>
        )}
      </main>

      <footer className="no-print border-t border-[var(--border)] py-8 text-center text-xs text-[var(--muted)]">
        <Container>
          <p>Designed for clarity, engineered for scale.</p>
        </Container>
      </footer>
    </div>
  );
}
