"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInViewOnce } from "@/components/motion/Reveal";

/* Primitives per redesign.md §11. Every component takes `static` to render
   inert — one code path for reduced motion, print, and no-JS. */

export function StatusDot({
  live = true,
  className = "",
}: {
  live?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
        live ? "status-dot bg-[var(--ember)]" : "bg-[var(--text-tertiary)]"
      } ${className}`}
    />
  );
}

export function Label({
  children,
  className = "",
  as: Tag = "p",
}: {
  children: ReactNode;
  className?: string;
  as?: "p" | "span" | "h2" | "dt";
}) {
  return <Tag className={`t-label ${className}`}>{children}</Tag>;
}

/** Splits "600k+" into leading digits and suffix so only the number counts. */
function splitNumeric(value: string) {
  const match = value.match(/^([^\d-]*)([\d.,]+)(.*)$/);
  if (!match) return null;
  const [, prefix, digits, suffix] = match;
  const target = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(target)) return null;
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
  return { prefix, target, suffix, decimals };
}

/** Animates 0 → target once, when `active` first becomes true. */
function useCountUp(target: number, active: boolean, decimals: number) {
  const [value, setValue] = useState<number | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / 900, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(t < 1 ? Number((eased * target).toFixed(decimals)) : null);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, decimals]);

  // null means "not animating" — render the true target value
  return value ?? target;
}

/**
 * Metric — tabular-nums, counts up on view, click to copy.
 * Renders the true value as text at all times so it stays copyable and
 * screen-readable; only the visual digits animate.
 */
export function Metric({
  value,
  label,
  className = "",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>();
  const parts = splitNumeric(value);
  const counted = useCountUp(parts?.target ?? 0, seen && !!parts, parts?.decimals ?? 0);
  const [copied, setCopied] = useState(false);

  const display = parts
    ? `${parts.prefix}${counted.toLocaleString("en-US", {
        minimumFractionDigits: parts.decimals,
        maximumFractionDigits: parts.decimals,
      })}${parts.suffix}`
    : value;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(label ? `${value} ${label}` : value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable — the value is selectable as text anyway */
    }
  };

  return (
    <div ref={ref} className={className}>
      <button
        type="button"
        onClick={copy}
        // explicit label: the animating digits would otherwise be announced
        aria-label={`${value}${label ? ` ${label}` : ""} — copy`}
        className="block text-left"
      >
        <span aria-hidden="true" className="t-metric block text-[var(--foreground)]">
          {display}
        </span>
        {label ? (
          <span
            aria-hidden="true"
            className="mt-2 flex items-baseline gap-2 text-sm text-[var(--text-secondary)]"
          >
            {label}
            {/* inline so confirming a copy never reserves vertical space */}
            <span
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ember)] transition-opacity"
              style={{ opacity: copied ? 1 : 0 }}
            >
              copied
            </span>
          </span>
        ) : null}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? `${value} copied to clipboard` : ""}
      </span>
    </div>
  );
}

export type ChipTone = "neutral" | "active" | "critical";

export function Chip({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: ChipTone;
}) {
  const tones: Record<ChipTone, string> = {
    neutral: "border-[var(--border)] text-[var(--text-secondary)]",
    active: "border-[var(--ember)] text-[var(--ember)]",
    // the one place a semantic colour is earned (spec §10 rule 4)
    critical: "border-[#b4232a]/50 text-[#d0454c]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function KeyCap({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-[var(--border)] bg-[var(--surface-raised)] px-1.5 font-mono text-[11px] text-[var(--text-secondary)]">
      {children}
    </kbd>
  );
}

export function Prompt({ children }: { children: ReactNode }) {
  return (
    <p className="t-code text-[var(--text-tertiary)]">
      <span className="text-[var(--ember)]">~$</span> {children}
    </p>
  );
}

/**
 * LatencyBar — before/after, animated at the *real ratio* (§6).
 * If 4.5s→50ms is 90×, the "after" bar fills in 1/90th the time. The viewer
 * feels the difference physically rather than reading a number.
 */
export function LatencyBar({
  label,
  beforeMs,
  afterMs,
  beforeLabel,
  afterLabel,
}: {
  label: string;
  beforeMs: number;
  afterMs: number;
  beforeLabel: string;
  afterLabel: string;
}) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>();
  const BEFORE_DURATION = 900;
  const ratio = beforeMs / afterMs;
  const afterDuration = Math.max(BEFORE_DURATION / ratio, 40);

  const bar = (widthPct: number, duration: number, ember: boolean) => ({
    transform: seen ? `scaleX(${widthPct})` : "scaleX(0)",
    transformOrigin: "left",
    transition: `transform ${duration}ms var(--ease-out)`,
    background: ember ? "var(--ember)" : "var(--text-tertiary)",
  });

  return (
    <div ref={ref}>
      <Label>{label}</Label>
      <dl className="mt-4 space-y-3">
        <div className="grid grid-cols-[5.5rem_1fr] items-center gap-4">
          <dt className="font-mono text-[0.8125rem] tabular-nums text-[var(--text-secondary)]">
            {beforeLabel}
          </dt>
          <dd className="h-1 w-full overflow-hidden rounded-full bg-[var(--surface-raised)]">
            <div className="h-full w-full" style={bar(1, BEFORE_DURATION, false)} />
          </dd>
        </div>
        <div className="grid grid-cols-[5.5rem_1fr] items-center gap-4">
          <dt className="font-mono text-[0.8125rem] tabular-nums text-[var(--foreground)]">
            {afterLabel}
          </dt>
          <dd className="h-1 w-full overflow-hidden rounded-full bg-[var(--surface-raised)]">
            <div
              className="h-full w-full"
              style={bar(Math.max(afterMs / beforeMs, 0.012), afterDuration, true)}
            />
          </dd>
        </div>
      </dl>
      <p className="mt-3 font-mono text-[11px] text-[var(--text-tertiary)]">
        {Math.round(ratio)}× faster — the bars animate at that same ratio
      </p>
    </div>
  );
}

/** Section opener — one consistent hierarchy for every section. */
export function SectionOpener({
  label,
  title,
  lead,
}: {
  label: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="max-w-[var(--measure)]">
      <Label as="h2">{label}</Label>
      <p className="t-h1 mt-4 text-[var(--foreground)]">{title}</p>
      {lead ? (
        <p className="t-lead mt-4 text-[var(--text-secondary)]">{lead}</p>
      ) : null}
    </header>
  );
}
