"use client";

import { useEffect, useRef } from "react";

/* Hero topology (redesign.md §5, item 16): nodes wake in dependency order,
   edges draw, then a packet runs the path. SVG rather than WebGL — the spec
   says 3D only where 2D genuinely can't do it (§12), and this can't justify
   a canvas before first paint.

   Mirrors the real read path, so the shape is honest: the same hops the
   Request Journey section walks through in detail. */

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
}

const NODES: Node[] = [
  { id: "client", label: "client", x: 8, y: 50 },
  { id: "api", label: "api", x: 32, y: 22 },
  { id: "cache", label: "redis", x: 56, y: 22 },
  { id: "db", label: "mongo", x: 56, y: 78 },
  { id: "queue", label: "queue", x: 80, y: 50 },
];

const EDGES: [string, string][] = [
  ["client", "api"],
  ["api", "cache"],
  ["api", "db"],
  ["cache", "queue"],
  ["db", "queue"],
];

const byId = new Map(NODES.map((n) => [n.id, n]));
/** the packet's route: client → api → redis → queue */
const PATH: string[] = ["client", "api", "cache", "queue"];

export function HeroTopology({ stage }: { stage: 0 | 1 | 2 }) {
  const packetRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (stage !== 2) return;
    const packet = packetRef.current;
    if (!packet) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let start = 0;
    const LEG = 900; // ms per hop, constant velocity (§13: data moves linearly)
    const total = (PATH.length - 1) * LEG;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = ((now - start) % total) / LEG;
      const i = Math.min(Math.floor(t), PATH.length - 2);
      const f = t - i;
      const a = byId.get(PATH[i])!;
      const b = byId.get(PATH[i + 1])!;
      packet.setAttribute("cx", String(a.x + (b.x - a.x) * f));
      packet.setAttribute("cy", String(a.y + (b.y - a.y) * f));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      className="h-full w-full"
    >
      {EDGES.map(([a, b], i) => {
        const na = byId.get(a)!;
        const nb = byId.get(b)!;
        return (
          <line
            key={`${a}-${b}`}
            x1={na.x}
            y1={na.y}
            x2={nb.x}
            y2={nb.y}
            stroke="var(--border-strong)"
            strokeWidth="0.35"
            opacity={stage === 0 ? 0 : 1}
            style={{
              transition: `opacity var(--dur-base) var(--ease-out) ${
                stage === 0 ? 0 : 260 + i * 70
              }ms`,
            }}
          />
        );
      })}

      {NODES.map((node, i) => {
        // nodes wake left to right — a real deploy cadence
        const lit = stage === 2 || (stage === 1 && i < 3);
        return (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="1.9"
              fill="var(--bg)"
              stroke={lit ? "var(--ember)" : "var(--border-strong)"}
              strokeWidth="0.7"
              opacity={stage === 0 ? 0.25 : 1}
              style={{
                transition: `opacity var(--dur-base) var(--ease-out) ${i * 90}ms, stroke var(--dur-fast) var(--ease-out) ${i * 90}ms`,
              }}
            />
            <text
              x={node.x}
              y={node.y - 4}
              textAnchor="middle"
              fill="var(--text-tertiary)"
              fontSize="3"
              fontFamily="var(--font-geist-mono)"
              opacity={stage === 0 ? 0 : 1}
              style={{
                transition: `opacity var(--dur-base) var(--ease-out) ${i * 90}ms`,
              }}
            >
              {node.label}
            </text>
          </g>
        );
      })}

      <circle
        ref={packetRef}
        cx={NODES[0].x}
        cy={NODES[0].y}
        r="1.1"
        fill="var(--ember)"
        opacity={stage === 2 ? 1 : 0}
        style={{ transition: "opacity var(--dur-fast) var(--ease-out)" }}
      />
    </svg>
  );
}
