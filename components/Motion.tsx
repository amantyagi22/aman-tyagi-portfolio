"use client";

import { useEffect, useRef } from "react";

const fine = () =>
  matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches;

/* A number that rolls in character by character. CSS rolls it on first
   paint; numbers still below the fold get re-armed here and roll again when
   they scroll into view, so the roll is never spent off screen. */
export function Roll({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < innerHeight) return;
    el.dataset.armed = "";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.in = "";
        io.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} className="roll">
      <span className="sr-only">{text}</span>
      {[...text].map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{ "--i": i } as React.CSSProperties}
        >
          {c}
        </span>
      ))}
    </span>
  );
}

/* A faint dot grid that brightens around the cursor. Static on touch and
   for reduced motion; redraws only while the pointer moves. */
export function DotField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const GAP = 22;
    const REACH = 170;
    let x = -1e4;
    let y = -1e4;
    let frame = 0;

    const draw = () => {
      frame = 0;
      const { width, height } = cv.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      for (let px = GAP / 2; px < width; px += GAP) {
        for (let py = GAP / 2; py < height; py += GAP) {
          const t = Math.max(0, 1 - Math.hypot(px - x, py - y) / REACH);
          ctx.fillStyle = t
            ? `rgba(236, 90, 36, ${0.12 + t * 0.7})`
            : "rgba(22, 21, 19, 0.12)";
          ctx.beginPath();
          ctx.arc(px, py, 1 + t * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    const size = () => {
      const r = cv.getBoundingClientRect();
      const d = devicePixelRatio || 1;
      cv.width = r.width * d;
      cv.height = r.height * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      draw();
    };
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      frame ||= requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(size);
    ro.observe(cv);
    const live = fine();
    if (live) addEventListener("pointermove", move, { passive: true });
    return () => {
      ro.disconnect();
      if (live) removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className={className} />;
}

/* Leans a card a few degrees toward the cursor, with a soft light under it.
   Mouse only; writes styles directly so React never re-renders on move. */
export function Tilt({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || !fine()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--px", `${px * 100}%`);
    el.style.setProperty("--py", `${py * 100}%`);
    el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 6}deg)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`tilt ${className}`}
    >
      {children}
    </div>
  );
}
