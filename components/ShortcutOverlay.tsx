"use client";

import { useEffect, useState } from "react";
import { KeyCap } from "@/components/primitives";

/* `?` shortcuts overlay (redesign.md §7) — signals "built for engineers"
   faster than any copy can. */

const SHORTCUTS: [string[], string][] = [
  [["⌘", "K"], "open the console"],
  [["/"], "filter the stack graph"],
  [["?"], "this overlay"],
  [["Esc"], "close any overlay"],
  [["Tab"], "move through everything"],
];

export function ShortcutOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if (event.key === "?" && !typing) {
        event.preventDefault();
        setOpen((o) => !o);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;

  return (
    <div
      className="console-backdrop fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)] px-4"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        onClick={(event) => event.stopPropagation()}
        className="console-panel w-full max-w-sm rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elev)] p-5"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
          shortcuts
        </p>
        <dl className="mt-4 space-y-3">
          {SHORTCUTS.map(([keys, description]) => (
            <div key={description} className="flex items-center justify-between gap-6">
              <dt className="flex items-center gap-1">
                {keys.map((key) => (
                  <KeyCap key={key}>{key}</KeyCap>
                ))}
              </dt>
              <dd className="text-[0.8125rem] text-[var(--text-secondary)]">
                {description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
