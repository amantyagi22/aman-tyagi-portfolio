/* Architecture diagrams as plain server-rendered SVG: boxes on a grid, arrows
   clipped to the box edges. Same vocabulary as the hero drawing (hairline
   strokes, elevated fills, mono captions) so it reads as part of the page,
   and it themes with the CSS variables for free. */

export interface DiagramNode {
  id: string;
  label: string;
  sub?: string;
  /** top-left corner, in viewBox units */
  x: number;
  y: number;
  /** the part of the system the page is about */
  accent?: boolean;
  /** a side concern (tracing, dead letters), drawn dashed */
  dashed?: boolean;
}

export interface DiagramSpec {
  width: number;
  height: number;
  nodes: DiagramNode[];
  edges: { from: string; to: string; label?: string; dashed?: boolean }[];
  caption: string;
}

const W = 150;
const H = 56;

/* where the line from a box's centre towards (dx, dy) leaves the box */
function exit(n: DiagramNode, dx: number, dy: number, pad: number) {
  const hw = W / 2 + pad;
  const hh = H / 2 + pad;
  const t = Math.min(
    dx ? hw / Math.abs(dx) : Infinity,
    dy ? hh / Math.abs(dy) : Infinity,
  );
  return { x: n.x + W / 2 + dx * t, y: n.y + H / 2 + dy * t };
}

export function Diagram({ spec }: { spec: DiagramSpec }) {
  const byId = new Map(spec.nodes.map((n) => [n.id, n]));

  return (
    <figure className="-mx-4 sm:mx-0">
      {/* below ~560px the text would shrink past legible, so the drawing
          keeps its size and scrolls; the steps beside it carry the same
          content as prose */}
      <div className="overflow-x-auto px-4 sm:px-0">
        <svg
          viewBox={`0 0 ${spec.width} ${spec.height}`}
          className="block w-full min-w-[560px] border border-[var(--border)] bg-[var(--bg-elev)]"
          role="img"
          aria-label={spec.caption}
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path
                d="M0 0.5 L7 4 L0 7.5"
                fill="none"
                stroke="var(--border-strong)"
                strokeWidth="1.2"
              />
            </marker>
          </defs>

          {spec.edges.map((e) => {
            const a = byId.get(e.from)!;
            const b = byId.get(e.to)!;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const p = exit(a, dx, dy, 2);
            const q = exit(b, -dx, -dy, 4);
            // labels sit above a horizontal line, beside a vertical one
            const vertical = Math.abs(dy) > Math.abs(dx);
            return (
              <g key={`${e.from}-${e.to}`}>
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={q.x}
                  y2={q.y}
                  stroke="var(--border-strong)"
                  strokeWidth="1"
                  strokeDasharray={e.dashed ? "4 3" : undefined}
                  markerEnd="url(#arrow)"
                />
                {e.label ? (
                  <text
                    x={(p.x + q.x) / 2 + (vertical ? 8 : 0)}
                    y={(p.y + q.y) / 2 + (vertical ? 3 : -6)}
                    textAnchor={vertical ? "start" : "middle"}
                    fontSize="11"
                    fill="var(--text-tertiary)"
                    // a halo in the ground colour, so a label crossing a line stays legible
                    stroke="var(--bg-elev)"
                    strokeWidth="4"
                    paintOrder="stroke"
                  >
                    {e.label}
                  </text>
                ) : null}
              </g>
            );
          })}

          {spec.nodes.map((n) => (
            <g key={n.id}>
              <rect
                x={n.x}
                y={n.y}
                width={W}
                height={H}
                fill="var(--bg)"
                stroke={n.accent ? "var(--ember)" : "var(--border-strong)"}
                strokeWidth="1"
                strokeDasharray={n.dashed ? "4 3" : undefined}
              />
              <text
                x={n.x + 12}
                y={n.y + (n.sub ? 23 : 32)}
                fontSize="13"
                fontWeight="500"
                fill="var(--foreground)"
              >
                {n.label}
              </text>
              {n.sub ? (
                <text
                  x={n.x + 12}
                  y={n.y + 40}
                  fontSize="11"
                  fill={n.accent ? "var(--ember)" : "var(--text-tertiary)"}
                >
                  {n.sub}
                </text>
              ) : null}
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="mt-3 px-4 text-sm text-[var(--text-tertiary)] sm:px-0">
        {spec.caption}
      </figcaption>
    </figure>
  );
}
