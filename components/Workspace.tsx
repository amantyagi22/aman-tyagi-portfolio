"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { Label } from "@/components/primitives";
import { Reveal } from "@/components/motion/Reveal";

/* The desk, demoted (redesign.md §12): it says something human, not
   technical, so it sits near contact rather than carrying the headline.
   Fixed camera — the scroll-driven version belonged to the old hero. */

const DeskStage = dynamic(
  () => import("@/components/three/DeskStage").then((m) => m.DeskStage),
  { ssr: false, loading: () => <div className="h-64 w-full md:h-80" /> }
);

export function Workspace() {
  // DeskStage interpolates its camera across four shots; 0.72 parks it on a
  // three-quarter view — closer than the final wide shot, which is framed
  // for a full viewport rather than this panel.
  const parked = useRef(0.72);

  return (
    <Reveal>
      <div>
        <div className="h-64 md:h-80">
          <DeskStage progressRef={parked} />
          <p className="sr-only">
            A low-poly 3D model of the desk this site was built at: a white
            standing desk with a monitor showing a terminal, a mechanical
            keyboard, a laptop on a stand, a speaker, and a small plant.
          </p>
        </div>
        <Label>Where this gets built</Label>
        <p className="t-body mt-3 max-w-md text-[var(--text-secondary)]">
          A standing desk in India, a mechanical keyboard, and a monitor that
          usually has a terminal on it. Most of what&apos;s on this page was
          shipped from here.
        </p>
      </div>
    </Reveal>
  );
}
