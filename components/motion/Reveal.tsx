"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Fires once at 15% visibility; never reverses. */
export function useInViewOnce<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  return [ref, seen] as const;
}

export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${seen ? "reveal-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

/** Observes the container once, staggers each direct child by `step` ms. */
export function RevealGroup({
  children,
  step = 40,
  className = "",
  itemClassName = "",
}: {
  children: ReactNode;
  step?: number;
  className?: string;
  itemClassName?: string;
}) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, i) => (
        <div
          className={`reveal ${seen ? "reveal-in" : ""} ${itemClassName}`}
          style={{ "--d": `${i * step}ms` } as CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
