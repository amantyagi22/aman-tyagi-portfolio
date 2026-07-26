"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildCommands, complete, execute, type Effect } from "@/lib/console";

/* A working shell (redesign.md §7): real history, tab completion, and
   commands that execute. The command layer lives in lib/console.ts — this
   component only renders it and applies effects. */

interface Entry {
  input: string;
  lines: string[];
}

const BANNER = [
  "aman.systems — type `help` for commands",
];

export function CommandMenu({ onResume }: { onResume: () => void }) {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const commands = useMemo(() => buildCommands(), []);

  const close = useCallback(() => {
    setOpen(false);
    returnFocusRef.current?.focus();
  }, []);

  const applyEffect = useCallback(
    (effect: Effect) => {
      switch (effect.type) {
        case "navigate":
          close();
          document.getElementById(effect.target)?.scrollIntoView();
          break;
        case "resume":
          close();
          onResume();
          break;
        case "theme":
          document.documentElement.classList.toggle("dark");
          window.localStorage.setItem(
            "theme",
            document.documentElement.classList.contains("dark") ? "dark" : "light"
          );
          break;
        case "clear":
          setEntries([]);
          break;
        case "close":
          close();
          break;
      }
    },
    [close, onResume]
  );

  const submit = useCallback(() => {
    const value = input;
    setInput("");
    setHistoryIndex(null);
    if (value.trim()) setHistory((h) => [...h, value.trim()]);
    const result = execute(value, commands);
    if (result.lines.length || !result.effect) {
      setEntries((e) => [...e, { input: value, lines: result.lines }]);
    }
    if (result.effect) applyEffect(result.effect);
  }, [input, commands, applyEffect]);

  // global ⌘K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => {
          if (!prev) returnFocusRef.current = document.activeElement as HTMLElement;
          return !prev;
        });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, entries.length]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [entries]);

  const openConsole = () => {
    returnFocusRef.current = document.activeElement as HTMLElement;
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={openConsole}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 font-mono text-[11px] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
      >
        <span aria-hidden="true">⌘K</span>
        <span className="sr-only">Open console</span>
        <span aria-hidden="true">console</span>
      </button>

      {open ? (
        <div
          className="console-backdrop fixed inset-0 z-50 flex items-start justify-center bg-[var(--overlay)] px-4 pt-[12vh]"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Console"
            className="console-panel flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elev)] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.stopPropagation();
                close();
              }
            }}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                console
              </p>
              <button
                type="button"
                onClick={close}
                className="font-mono text-[11px] text-[var(--text-tertiary)] transition-colors hover:text-[var(--foreground)]"
              >
                esc
              </button>
            </div>

            <div
              ref={logRef}
              className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[0.8125rem] leading-relaxed"
            >
              {BANNER.map((line) => (
                <p key={line} className="text-[var(--text-tertiary)]">
                  {line}
                </p>
              ))}

              {entries.map((entry, i) => (
                <div key={`${entry.input}-${i}`} className="mt-3">
                  <p className="text-[var(--text-secondary)]">
                    <span className="text-[var(--ember)]">~$</span> {entry.input}
                  </p>
                  {entry.lines.map((line, j) => (
                    <p
                      key={j}
                      className="whitespace-pre-wrap text-[var(--text-secondary)]"
                    >
                      {line || " "}
                    </p>
                  ))}
                </div>
              ))}

              <div aria-live="polite" className="sr-only">
                {entries.at(-1)?.lines.join(". ")}
              </div>
            </div>

            <form
              className="flex items-center gap-2 border-t border-[var(--border)] px-4 py-3"
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
            >
              <span aria-hidden="true" className="font-mono text-[var(--ember)]">
                ~$
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Tab") {
                    event.preventDefault();
                    const completed = complete(input, commands);
                    if (completed) setInput(completed);
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    if (!history.length) return;
                    const next =
                      historyIndex === null
                        ? history.length - 1
                        : Math.max(0, historyIndex - 1);
                    setHistoryIndex(next);
                    setInput(history[next]);
                  } else if (event.key === "ArrowDown") {
                    event.preventDefault();
                    if (historyIndex === null) return;
                    const next = historyIndex + 1;
                    if (next >= history.length) {
                      setHistoryIndex(null);
                      setInput("");
                    } else {
                      setHistoryIndex(next);
                      setInput(history[next]);
                    }
                  }
                }}
                aria-label="Command input"
                placeholder="help"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="w-full bg-transparent font-mono text-[0.8125rem] text-[var(--foreground)] caret-[var(--ember)] placeholder-[var(--text-tertiary)] focus:outline-none"
              />
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
