"use client";

import { useCallback, useEffect, useState } from "react";

interface Command {
  name: string;
  description: string;
  hidden?: boolean;
}

const COMMANDS: Command[] = [
  { name: "about", description: "who is this" },
  { name: "story", description: "told forward" },
  { name: "stack", description: "the dependency graph" },
  { name: "contact", description: "send a message" },
  { name: "resume", description: "recruiter mode, printable" },
  { name: "help", description: "list commands" },
];

/* line-by-line delays at 30ms per line, capped at 200ms total */
function lineDelay(i: number, count: number): number {
  if (count <= 1) return 0;
  return Math.round(Math.min(i * 30, (170 * i) / (count - 1)));
}

export function CommandMenu({ onResume }: { onResume: () => void }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(0);
  const [output, setOutput] = useState<string | null>(null);

  const openConsole = useCallback(() => {
    setInput("");
    setOutput(null);
    setSelected(0);
    setClosing(false);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 120);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) {
          close();
        } else {
          openConsole();
        }
      }
      if (event.key === "Escape" && open) {
        close();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close, openConsole]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const query = input.trim().toLowerCase();
  const matches = COMMANDS.filter(
    (c) => !c.hidden && c.name.startsWith(query)
  );

  const run = (name: string) => {
    setOutput(null);
    switch (name) {
      case "resume":
        onResume();
        close();
        break;
      case "help":
        setOutput(
          COMMANDS.filter((c) => !c.hidden)
            .map((c) => `${c.name.padEnd(14)}${c.description}`)
            .join("\n")
        );
        setInput("");
        break;
      default: {
        document.getElementById(name)?.scrollIntoView();
        close();
      }
    }
  };

  const onSubmit = () => {
    const exact = COMMANDS.find((c) => c.name === query);
    if (exact) {
      run(exact.name);
    } else if (matches.length > 0) {
      run(matches[Math.min(selected, matches.length - 1)].name);
    } else if (query) {
      setOutput(`command not found: ${query}`);
      setInput("");
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openConsole}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open console"
        className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-1 text-xs font-mono text-[var(--muted)] transition-colors hover:border-[var(--border-strong)]"
      >
        Cmd+K
        <span className="text-[var(--muted)]">Console</span>
      </button>
      {open ? (
        <div
          className={`console-backdrop fixed inset-0 z-50 flex items-start justify-center bg-[var(--overlay)] px-4 pt-24 ${
            closing ? "opacity-0" : ""
          }`}
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Console"
            className={`console-panel w-full max-w-lg rounded-2xl border border-[var(--border-strong)] bg-[var(--panel-strong)] p-4 font-mono shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm ${
              closing ? "invisible" : ""
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Console
              </p>
              <button
                type="button"
                onClick={close}
                className="rounded-full border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
              >
                Esc
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-[var(--ember)]">❯</span>
              <input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setSelected(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSubmit();
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelected((s) => Math.min(s + 1, matches.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelected((s) => Math.max(s - 1, 0));
                  }
                }}
                placeholder="type a command"
                aria-label="Command input"
                className="w-full bg-transparent text-[var(--foreground)] caret-[var(--ember)] placeholder-[var(--muted)] outline-none"
                autoComplete="off"
                spellCheck={false}
                autoFocus
              />
            </div>

            {output ? (
              <div className="mt-3 overflow-x-auto whitespace-pre border-t border-[var(--border)] pt-3 text-xs leading-relaxed text-[var(--muted-strong)]">
                {output.split("\n").map((line, i, lines) => (
                  <div
                    key={`${i}-${line}`}
                    className="console-line"
                    style={{ "--d": `${lineDelay(i, lines.length)}ms` } as React.CSSProperties}
                  >
                    {line}
                  </div>
                ))}
              </div>
            ) : (
              <ul className="mt-3 space-y-1 border-t border-[var(--border)] pt-3">
                {matches.map((c, i) => (
                  <li key={c.name}>
                    <button
                      type="button"
                      onClick={() => run(c.name)}
                      onMouseEnter={() => setSelected(i)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        i === selected
                          ? "bg-[var(--panel)] text-[var(--foreground)]"
                          : "text-[var(--muted)]"
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-xs text-[var(--muted)]">
                        {c.description}
                      </span>
                    </button>
                  </li>
                ))}
                {matches.length === 0 ? (
                  <li className="px-3 py-2 text-xs text-[var(--muted)]">
                    no matching command — enter to try anyway
                  </li>
                ) : null}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
