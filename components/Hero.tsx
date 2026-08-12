/* The block above the profile: a tall figure panel that gives the page
   somewhere to begin, with the name and avatar landing at its lower edge.
   The drawing is an isometric stack of slabs — a request passing down through
   the layers of a backend, which is the thing this whole site is about.
   Pure inline SVG: no image request, and it inherits the theme. */

export function Hero() {
  return (
    <figure className="relative h-56 overflow-hidden border-x border-[var(--border)] sm:h-72">
      <svg
        viewBox="0 0 400 240"
        className="absolute inset-0 size-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* the hatch fill that gives the slabs their drafting-paper face */}
          <pattern
            id="hatch"
            width="6"
            height="6"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              stroke="var(--border)"
              strokeWidth="1.1"
            />
          </pattern>
        </defs>

        {/* construction lines, running off the edges like a working drawing */}
        <g stroke="var(--line)" strokeWidth="0.75">
          <line x1="0" y1="70" x2="400" y2="70" />
          <line x1="0" y1="170" x2="400" y2="170" />
          <line x1="120" y1="0" x2="120" y2="240" />
          <line x1="280" y1="0" x2="280" y2="240" />
        </g>

        {/* Four slabs, top to bottom: edge, service, cache, store. Each is one
            isometric parallelogram plus two side faces for thickness. */}
        <Slab y={44} label="edge" />
        <Slab y={82} label="service" />
        <Slab y={120} label="cache" />
        <Slab y={158} label="store" />
      </svg>

      <figcaption className="pointer-events-none absolute right-3 bottom-2 font-mono text-[10px] tracking-wide text-[var(--text-tertiary)] select-none sm:right-4">
        Fig. 1 — a request, on its way down
      </figcaption>
    </figure>
  );
}

/* One isometric slab. cx/cy is the centre of its top face; the 2:1 ratio is
   what makes it read as isometric rather than merely skewed. */
function Slab({ y, label }: { y: number; label: string }) {
  const cx = 200;
  const w = 78; // half-width of the top face
  const h = 39; // half-depth, half of w for a true 2:1 isometric
  const t = 9; // slab thickness

  const top = `${cx},${y - h} ${cx + w},${y} ${cx},${y + h} ${cx - w},${y}`;
  const left = `${cx - w},${y} ${cx},${y + h} ${cx},${y + h + t} ${cx - w},${y + t}`;
  const right = `${cx + w},${y} ${cx},${y + h} ${cx},${y + h + t} ${cx + w},${y + t}`;

  return (
    <g>
      <polygon points={left} fill="var(--bg-elev)" stroke="var(--border-strong)" strokeWidth="1" />
      <polygon points={right} fill="var(--bg-elev)" stroke="var(--border-strong)" strokeWidth="1" />
      <polygon points={top} fill="url(#hatch)" stroke="var(--border-strong)" strokeWidth="1" />
      <text
        x={cx - w + 12}
        y={y + 3}
        className="font-mono"
        fontSize="7"
        fill="var(--text-tertiary)"
        letterSpacing="1.2"
      >
        {label}
      </text>
    </g>
  );
}
