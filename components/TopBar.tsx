import { ThemeToggle } from "@/components/ui/ThemeToggle";

/* Sticky chrome: stays put while the page scrolls, so the section links and
   the theme toggle are always reachable. Its own bottom hairline separates it
   from the column rather than the column's border doing double duty. */

const NAV = [
  { label: "Overview", href: "#overview" },
  { label: "Experience", href: "#experience" },
  { label: "Incidents", href: "#incidents" },
  { label: "Stack", href: "#stack" },
];

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full items-center gap-4 px-4 md:max-w-3xl md:px-6">
        <a
          href="#top"
          className="font-mono text-[0.8125rem] font-medium tracking-[-0.01em] text-[var(--foreground)]"
        >
          aman<span className="text-[var(--ember)]">.</span>systems
        </a>

        {/* hidden on small screens: four links plus the toggle do not fit, and
            the page is short enough to scroll */}
        <nav className="ml-auto hidden items-center gap-5 sm:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] tracking-[0.08em] text-[var(--text-secondary)] uppercase transition-colors hover:text-[var(--foreground)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <ThemeToggle className="ml-auto sm:ml-0" />
      </div>
    </header>
  );
}
