/* Marginalia: asides that point at a thing rather than describe it in prose.
   Absolutely positioned and pointer-events-none, so they never intercept a
   click meant for what they annotate. Hidden on narrow screens — there is no
   margin to write in. */

export function HandwrittenNote({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute font-handwritten text-lg/none tracking-normal text-[var(--text-tertiary)] select-none ${className}`}
    >
      {children}
    </div>
  );
}

/** Points down-left. Rotate or mirror it to aim at the subject. */
export function HandwrittenArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`size-8 shrink-0 ${className}`}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M34 4c1 15-5 26-21 30" />
      <path d="m21 36-8-2 7-7" />
    </svg>
  );
}
