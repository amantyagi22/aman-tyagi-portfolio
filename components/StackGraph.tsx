"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BRANCHES,
  treeEdges,
  treeNodes,
  type Branch,
  type TreeNode,
} from "@/lib/data";
import { Label } from "@/components/primitives";

/* Interactive topology (redesign.md §5.05): click to focus, click two nodes
   to trace, filter by layer, `/` to search. The SVG is aria-hidden and
   mirrored by a real list below — screen readers get the content, not an
   apology (§17). */

/* Layout is derived, not hand-placed: one horizontal band per branch, nodes
   spread evenly inside it. Adding a node reflows its band instead of needing
   a new pair of magic coordinates. */

const BAND_H = 150;
const BAND_LABEL_X = 8;
const TRACK_X = 190;
const TRACK_W = 620;
const VIEW_W = TRACK_X + TRACK_W + 20;
const VIEW_H = BRANCHES.length * BAND_H;

const bandY = (branch: Branch) => BRANCHES.indexOf(branch) * BAND_H + BAND_H / 2;

const positions = new Map<string, { x: number; y: number }>();
for (const branch of BRANCHES) {
  const row = treeNodes.filter((n) => n.branch === branch);
  row.forEach((node, i) => {
    // single node in a band sits at the start of the track, not floating mid-air
    const step = row.length > 1 ? TRACK_W / (row.length - 1) : 0;
    positions.set(node.id, { x: TRACK_X + i * step, y: bandY(branch) });
  });
}

const byId = new Map(treeNodes.map((n) => [n.id, n]));

const neighbours = new Map<string, Set<string>>(
  treeNodes.map((n) => [n.id, new Set([n.id])])
);
for (const [a, b] of treeEdges) {
  neighbours.get(a)!.add(b);
  neighbours.get(b)!.add(a);
}

/** Shortest path between two nodes — the dependency trace. */
function findPath(from: string, to: string): string[] {
  if (from === to) return [from];
  const queue: string[][] = [[from]];
  const seen = new Set([from]);
  while (queue.length) {
    const path = queue.shift()!;
    for (const next of neighbours.get(path.at(-1)!) ?? []) {
      if (seen.has(next)) continue;
      const extended = [...path, next];
      if (next === to) return extended;
      seen.add(next);
      queue.push(extended);
    }
  }
  return [];
}

type Filter = Branch | "all";

export function StackGraph() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [traceFrom, setTraceFrom] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // `/` focuses search, as the spec requires
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey) return;
      const tag = (event.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const el = searchRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) return;
      event.preventDefault();
      el.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const trace = useMemo(
    () => (traceFrom && focused ? findPath(traceFrom, focused) : []),
    [traceFrom, focused]
  );

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return new Set(
      treeNodes
        .filter(
          (n) =>
            (filter === "all" || n.branch === filter) &&
            (!q ||
              n.label.toLowerCase().includes(q) ||
              n.note.toLowerCase().includes(q) ||
              n.usedAt.toLowerCase().includes(q))
        )
        .map((n) => n.id)
    );
  }, [filter, query]);

  const active = hovered ?? focused;

  /** full → related → receded. 0.28 keeps context legible while clearly
      subordinate; the spec's 20% went too dark to read on this canvas. */
  const nodeOpacity = (id: string): number => {
    if (!matches.has(id)) return 0.28;
    if (trace.length) return trace.includes(id) ? 1 : 0.28;
    if (!active) return 1;
    if (id === active) return 1;
    return neighbours.get(active)?.has(id) ? 0.62 : 0.28;
  };

  const edgeOpacity = (a: string, b: string): number => {
    if (!matches.has(a) || !matches.has(b)) return 0.1;
    if (trace.length) {
      const ia = trace.indexOf(a);
      const ib = trace.indexOf(b);
      return ia > -1 && ib > -1 && Math.abs(ia - ib) === 1 ? 1 : 0.1;
    }
    if (!active) return 0.3;
    return a === active || b === active ? 0.9 : 0.1;
  };

  const selectNode = (id: string) => {
    if (focused === id) {
      setFocused(null);
      setTraceFrom(null);
      return;
    }
    // second distinct click starts a trace from the previous focus
    setTraceFrom(focused && focused !== id ? focused : null);
    setFocused(id);
  };

  const detail: TreeNode | null = active ? (byId.get(active) ?? null) : null;

  return (
    <div className="mt-12">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", ...BRANCHES] as Filter[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
              className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${
                filter === option
                  ? "border-[var(--border-strong)] bg-[var(--surface-raised)] text-[var(--foreground)]"
                  : "border-[var(--border)] text-[var(--text-tertiary)] hover:text-[var(--foreground)]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="filter…"
            aria-label="Filter the stack"
            className="w-36 rounded-full border border-[var(--border)] bg-transparent px-3 py-1 font-mono text-[11px] text-[var(--foreground)] placeholder-[var(--text-tertiary)]"
          />
          <kbd className="hidden rounded border border-[var(--border)] px-1.5 font-mono text-[10px] text-[var(--text-tertiary)] sm:inline">
            /
          </kbd>
        </div>

        {(focused || trace.length) ? (
          <button
            type="button"
            onClick={() => {
              setFocused(null);
              setTraceFrom(null);
            }}
            className="font-mono text-[11px] text-[var(--text-tertiary)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
          >
            reset
          </button>
        ) : null}
      </div>

      <div className="mt-8 hidden md:block">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="w-full"
          role="group"
          aria-label="Stack dependency map, grouped by layer"
        >
          {BRANCHES.map((branch, i) => (
            <g key={branch}>
              {i > 0 ? (
                <line
                  x1="0"
                  y1={i * BAND_H}
                  x2={VIEW_W}
                  y2={i * BAND_H}
                  stroke="var(--border)"
                  strokeWidth="1"
                  opacity="0.5"
                />
              ) : null}
              <text
                x={BAND_LABEL_X}
                y={bandY(branch) + 4}
                fill="var(--text-tertiary)"
                fontSize="11"
                letterSpacing="0.08em"
                fontFamily="var(--font-geist-mono)"
              >
                {branch.toUpperCase()}
              </text>
            </g>
          ))}

          {treeEdges.map(([a, b]) => {
            const na = positions.get(a)!;
            const nb = positions.get(b)!;
            const ia = trace.indexOf(a);
            const ib = trace.indexOf(b);
            const onTrace = ia > -1 && ib > -1 && Math.abs(ia - ib) === 1;
            // curve cross-band edges so they read as distinct strands instead
            // of a bundle of straight lines through the same empty space
            const d =
              na.y === nb.y
                ? `M ${na.x} ${na.y} L ${nb.x} ${nb.y}`
                : `M ${na.x} ${na.y} C ${na.x} ${(na.y + nb.y) / 2}, ${nb.x} ${(na.y + nb.y) / 2}, ${nb.x} ${nb.y}`;
            return (
              <path
                key={`${a}-${b}`}
                d={d}
                fill="none"
                stroke={onTrace ? "var(--ember)" : "var(--border-strong)"}
                strokeWidth={onTrace ? 1.5 : 1}
                opacity={edgeOpacity(a, b)}
                style={{ transition: "opacity var(--dur-instant) var(--ease-out)" }}
              />
            );
          })}

          {treeNodes.map((node) => {
            const { x, y } = positions.get(node.id)!;
            const isActive = active === node.id;
            const inTrace = trace.includes(node.id);
            return (
              <g
                key={node.id}
                role="button"
                tabIndex={0}
                aria-pressed={focused === node.id}
                aria-label={`${node.label}, ${node.branch}`}
                onClick={() => selectNode(node.id)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  selectNode(node.id);
                }}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(node.id)}
                onBlur={() => setHovered(null)}
                opacity={nodeOpacity(node.id)}
                className="cursor-pointer focus:outline-none focus-visible:[&>circle]:stroke-[var(--ember)]"
                style={{ transition: "opacity var(--dur-instant) var(--ease-out)" }}
              >
                {/* generous invisible hit area — the visible dot is 5px wide */}
                <rect
                  x={x - 60}
                  y={y - 26}
                  width="120"
                  height="52"
                  fill="transparent"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={isActive || inTrace ? 6 : 4.5}
                  fill="var(--bg)"
                  stroke={
                    isActive || inTrace ? "var(--ember)" : "var(--border-strong)"
                  }
                  strokeWidth="1.5"
                  style={{ transition: "r var(--dur-instant) var(--ease-out)" }}
                />
                <text
                  x={x}
                  y={y - 16}
                  textAnchor="middle"
                  fill={
                    isActive || inTrace
                      ? "var(--foreground)"
                      : "var(--text-secondary)"
                  }
                  fontSize="11"
                  fontFamily="var(--font-geist-mono)"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* the real control surface: buttons, keyboard-reachable, screen-reader
          complete. On desktop it sits under the diagram as the legend. */}
      <div className="mt-8">
        <Label>
          {trace.length
            ? `tracing ${byId.get(trace[0])?.label} → ${byId.get(trace.at(-1)!)?.label} · ${trace.length - 1} hops`
            : "select a node · select a second to trace the path between them"}
        </Label>

        {/* on desktop the diagram itself is the control surface; this list is
            the mobile UI and stays reachable for screen readers everywhere */}
        <ul className="mt-4 flex flex-wrap gap-2 md:hidden">
          {treeNodes.map((node) => {
            const dimmed = !matches.has(node.id);
            const isFocused = focused === node.id;
            return (
              <li key={node.id}>
                <button
                  type="button"
                  aria-pressed={isFocused}
                  onClick={() => selectNode(node.id)}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(node.id)}
                  onBlur={() => setHovered(null)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors ${
                    isFocused || trace.includes(node.id)
                      ? "border-[var(--ember)] text-[var(--ember)]"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                  }`}
                  style={{ opacity: dimmed ? 0.35 : 1 }}
                >
                  {node.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* reserved height: the detail line must never shift the layout */}
        <div
          aria-live="polite"
          className="mt-6 min-h-16 max-w-[var(--measure)] border-t border-[var(--border)] pt-5"
        >
          {detail ? (
            <>
              <p className="font-mono text-[0.8125rem] text-[var(--foreground)]">
                {detail.label}
                <span className="ml-3 text-[var(--text-tertiary)]">
                  {detail.branch}
                </span>
              </p>
              <p className="t-body mt-1.5 text-[var(--text-secondary)]">
                {detail.note}
              </p>
              <p className="mt-1 font-mono text-[11px] text-[var(--text-tertiary)]">
                used at {detail.usedAt}
              </p>
            </>
          ) : (
            <p className="t-body text-[var(--text-tertiary)]">
              {matches.size} of {treeNodes.length} shown.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
