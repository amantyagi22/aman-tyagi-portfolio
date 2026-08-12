import { links } from "@/lib/data";
import { Header } from "@/components/Header";
import { TopBar } from "@/components/TopBar";
import { Hero } from "@/components/Hero";
import { Divider, Panel, PanelTitle } from "@/components/ui/Panel";
import {
  Experience,
  Overview,
  Incidents,
  Stack,
} from "@/components/Sections";

/* One centered bordered column, sections separated by hairlines. No client
   components, no WebGL, no scroll-driven state — the page is fully static
   and the content is the demo. */

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--foreground)]">
      <a
        href="#overview"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:border focus:border-[var(--border-strong)] focus:bg-[var(--bg-elev)] focus:px-4 focus:py-2 focus:text-xs"
      >
        Skip to content
      </a>

      <TopBar />

      <main id="top" className="mx-auto w-full md:max-w-3xl">
        <Hero />
        <Header />
        <Overview />
        <Divider />
        <Experience />
        <Divider />
        <Incidents />
        <Divider />
        <Stack />
        <Divider />
        <Contact />
      </main>
    </div>
  );
}

function Contact() {
  return (
    <Panel id="contact">
      <PanelTitle>Contact</PanelTitle>

      <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">
        Open to backend and platform engagements. Based in India, working across
        timezones.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={links.email}
          className="border border-[var(--foreground)] bg-[var(--button-primary-bg)] px-4 py-2 text-[0.8125rem] text-[var(--button-primary-text)] transition-opacity hover:opacity-85"
        >
          Email Aman
        </a>
        <a
          href="/resume"
          className="border border-[var(--border)] px-4 py-2 text-[0.8125rem] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
        >
          Resume
        </a>
      </div>

      <p className="mt-8 border-t border-[var(--border)] pt-4 font-mono text-[11px] text-[var(--text-tertiary)]">
        Built with Next.js.
      </p>
    </Panel>
  );
}
