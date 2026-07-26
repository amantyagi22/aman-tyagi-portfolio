"use client";

import { useEffect, useState } from "react";
import { treeEdges, treeNodes, type TreeNode } from "@/lib/data";
import { RevealGroup, useInViewOnce } from "@/components/motion/Reveal";

const SLOW = 600; // --dur-slow, also the per-depth step so each line completes as its node appears

const branches = [...new Set(treeNodes.map((n) => n.branch))];
const byId = Object.fromEntries(treeNodes.map((n) => [n.id, n]));

// longest path from a root; lines into depth-d nodes draw during [(d-1)·SLOW, d·SLOW]
const depth: Record<string, number> = Object.fromEntries(
  treeNodes.map((n) => [n.id, 0])
);
for (let changed = true; changed; ) {
  changed = false;
  for (const [a, b] of treeEdges) {
    if (depth[b] < depth[a] + 1) {
      depth[b] = depth[a] + 1;
      changed = true;
    }
  }
}
const maxDepth = Math.max(...Object.values(depth));

const neighborsOf: Record<string, Set<string>> = Object.fromEntries(
  treeNodes.map((n) => [n.id, new Set([n.id])])
);
for (const [a, b] of treeEdges) {
  neighborsOf[a].add(b);
  neighborsOf[b].add(a);
}

export function StackGraph() {
  const [active, setActive] = useState<TreeNode | null>(null);
  const [ref, seen] = useInViewOnce<HTMLDivElement>();
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!seen) return;
    const t = window.setTimeout(() => setSettled(true), maxDepth * SLOW + 400);
    return () => window.clearTimeout(t);
  }, [seen]);

  const nodeOpacity = (id: string) => {
    if (!seen) return 0;
    if (active && !neighborsOf[active.id].has(id)) return 0.4;
    return 1;
  };

  return (
    <div className="mt-10">
      <div ref={ref} className="card hidden rounded-2xl p-6 md:block">
        <svg
          viewBox="0 0 800 420"
          className="w-full"
          role="img"
          aria-label="Stack dependency graph"
        >
          {treeEdges.map(([a, b]) => {
            const na = byId[a];
            const nb = byId[b];
            const len = Math.hypot(nb.x - na.x, nb.y - na.y);
            const lit =
              !active || active.id === a || active.id === b;
            return (
              <line
                key={`${a}-${b}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke="var(--border-strong)"
                strokeWidth="1"
                strokeDasharray={`${len}`}
                strokeDashoffset={seen ? 0 : len}
                opacity={lit ? 1 : 0.4}
                style={{
                  transition: settled
                    ? "opacity var(--dur-instant) var(--ease-out)"
                    : `stroke-dashoffset ${SLOW}ms var(--ease-out) ${(depth[b] - 1) * SLOW}ms`,
                }}
              />
            );
          })}
          {treeNodes.map((n) => {
            const anchor = n.x < 150 ? "start" : n.x > 640 ? "end" : "middle";
            const isActive = active?.id === n.id;
            return (
              <g
                key={n.id}
                tabIndex={0}
                className="cursor-pointer outline-none"
                opacity={nodeOpacity(n.id)}
                style={{
                  transition: settled
                    ? "opacity var(--dur-instant) var(--ease-out)"
                    : `opacity var(--dur-fast) var(--ease-out) ${depth[n.id] * SLOW}ms`,
                }}
                onMouseEnter={() => setActive(n)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(n)}
                onBlur={() => setActive(null)}
              >
                <title>{`${n.label} — ${n.note}`}</title>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={5}
                  fill="var(--bg)"
                  stroke={isActive ? "var(--ember)" : "var(--border-strong)"}
                  strokeWidth="1.5"
                />
                <text
                  x={n.x < 150 ? n.x - 5 : n.x > 640 ? n.x + 5 : n.x}
                  y={n.y - 14}
                  textAnchor={anchor}
                  fill={isActive ? "var(--foreground)" : "var(--muted-strong)"}
                  fontSize="11"
                  fontFamily="var(--font-geist-mono)"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
        <p
          aria-live="polite"
          className="mt-3 min-h-5 border-t border-dashed border-[var(--border)] pt-3 font-mono text-xs text-[var(--muted)]"
        >
          {active ? (
            <>
              <span className="text-[var(--ember)]">{active.label}</span> —{" "}
              {active.note}
            </>
          ) : (
            "hover a node"
          )}
        </p>
      </div>

      <RevealGroup step={40} className="space-y-6 md:hidden">
        {branches.map((b) => (
          <div key={b} className="card rounded-2xl p-5">
            <p className="section-kicker">{b}</p>
            <ul className="mt-3 space-y-2.5">
              {treeNodes
                .filter((n) => n.branch === b)
                .map((n) => (
                  <li key={n.id} className="text-sm leading-relaxed">
                    <span className="font-mono text-xs text-[var(--foreground)]">
                      {n.label}
                    </span>
                    <span className="text-[var(--muted)]"> — {n.note}</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </RevealGroup>
    </div>
  );
}
