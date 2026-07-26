"use client";

/* No React state: the class on <html> is the single source of truth, set
   before paint by the inline script in layout.tsx and read by CSS for the
   label. Mirroring it into state only created a stale copy to disagree with. */

export function ThemeToggle() {
  const toggle = () => {
    const dark = document.documentElement.classList.toggle("dark");
    window.localStorage.setItem("theme", dark ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-1 text-xs font-mono text-[var(--muted)] transition-colors hover:border-[var(--border-strong)]"
      aria-label="Toggle colour theme"
    >
      {/* Both labels are always in the markup and CSS picks one, so the
          server and client render identical HTML — no hydration mismatch,
          and the right word shows before React has even loaded. */}
      <span className="hidden dark:inline">Light</span>
      <span className="dark:hidden">Dark</span>
      <span className="text-[var(--muted)]">Mode</span>
    </button>
  );
}
