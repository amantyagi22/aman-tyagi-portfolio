/* The layout primitives. Everything on the page is one of these three:
   a bordered column section, a hairline divider between sections, or a
   label. The identity is entirely borders — no cards, no shadows. */

export function Panel({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="screen-line-bottom border-x border-[var(--border)] px-4 py-6 sm:px-6"
    >
      {children}
    </section>
  );
}

/* Striped, so the seam between sections reads as a deliberate gap rather
   than as a missing border. The two squares straddle the top corners —
   offset by half their size so the column border passes through their
   centre, which is what makes the intersection read as a joint. */
export function Divider() {
  return (
    <div
      className="stripes-bleed screen-line-both relative h-8 w-full border-x border-[var(--border)]"
      aria-hidden="true"
    >
      {/* pulled inside the column below md, where it runs full-bleed and a
          negative offset would escape the viewport */}
      <span className="absolute -top-[4.5px] left-0 z-10 size-[9px] border border-[var(--dot-line)] bg-[var(--bg)] lg:-left-[4.5px]" />
      <span className="absolute -top-[4.5px] right-0 z-10 size-[9px] border border-[var(--dot-line)] bg-[var(--bg)] lg:-right-[4.5px]" />
    </div>
  );
}

/* A real heading, not a grey label: at full size and foreground colour it
   gives the eye an anchor when scanning past a long column of body text. */
export function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 text-2xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
      {children}
    </h2>
  );
}
