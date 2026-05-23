"use client";

import { useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    if (stored === "light") {
      document.documentElement.classList.remove("dark");
      setMode("light");
      return;
    }
    document.documentElement.classList.add("dark");
    setMode("dark");
  }, []);

  const toggle = () => {
    const next: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    window.localStorage.setItem("theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-1 text-xs font-mono text-[var(--muted)] transition-colors hover:border-[var(--border-strong)]"
      aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
    >
      {mode === "dark" ? "Dark" : "Light"}
      <span className="text-[var(--muted)]">Mode</span>
    </button>
  );
}
