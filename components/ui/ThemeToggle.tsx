"use client";

import { MoonIcon, SunIcon } from "lucide-react";

/* No React state: the class on <html> is the single source of truth, set
   before paint by the inline script in layout.tsx and read by CSS to pick the
   icon. Mirroring it into state only created a stale copy to disagree with. */

export function ThemeToggle({ className = "" }: { className?: string }) {
  const toggle = () => {
    const dark = document.documentElement.classList.toggle("dark");
    window.localStorage.setItem("theme", dark ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex size-8 shrink-0 items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)] [&_svg]:size-4 [&_svg]:shrink-0 ${className}`}
      aria-label="Toggle colour theme"
    >
      {/* Both icons are always in the markup and CSS picks one, so the server
          and client render identical HTML — no hydration mismatch, and the
          right icon shows before React has even loaded. */}
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
    </button>
  );
}
