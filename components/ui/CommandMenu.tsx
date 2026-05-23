"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface CommandItem {
  label: string;
  href: string;
  description: string;
}

interface CommandMenuProps {
  items: CommandItem[];
}

export function CommandMenu({ items }: CommandMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isK = event.key.toLowerCase() === "k";
      if ((event.metaKey || event.ctrlKey) && isK) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open command menu"
        className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-1 text-xs font-mono text-[var(--muted)] transition-colors hover:border-[var(--border-strong)]"
      >
        Cmd+K
        <span className="text-[var(--muted)]">Menu</span>
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-[var(--overlay)] px-4 pt-24"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl border border-[var(--border-strong)] bg-[var(--panel-strong)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--muted)]">
                Navigate
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
              >
                Esc
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--border-strong)]"
                >
                  <span>{item.label}</span>
                  <span className="text-xs font-mono text-[var(--muted)]">
                    {item.description}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
