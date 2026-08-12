import Image from "next/image";
import { yearsOfExperience } from "@/lib/data";
import { SocialLinks } from "@/components/SocialLinks";
import { InfoRows } from "@/components/InfoRows";
import { VerifiedIcon } from "@/components/ui/VerifiedIcon";
import {
  HandwrittenArrow,
  HandwrittenNote,
} from "@/components/ui/HandwrittenNote";

/* Name, role, tagline, photo, info rows, socials — the whole pitch in one
   screen, no scroll and no WebGL context to wait on. Static: it scrolls away
   like everything else, so there's no sticky bar competing with the borders. */

export function Header() {
  return (
    <header className="screen-line-bottom border-x border-[var(--border)]">
      {/* -mt-12 lifts the avatar so it straddles the hero's lower edge rather
          than sitting in its own band below it */}
      <div className="-mt-12 px-4 pb-6 sm:-mt-14 sm:px-6">
        <div className="flex items-end gap-5 sm:gap-6">
          <div className="shrink-0">
            <Image
              src="/aman-beach.jpg"
              alt="Aman Tyagi"
              width={512}
              height={512}
              // priority: it's above the fold, so lazy-loading it would just
              // shift the layout after paint
              priority
              // cover: the source is a full-frame square portrait, so contain
              // would letterbox it inside the circle
              // ring-4 in the page colour: the avatar now overlaps the hero,
              // so it needs to punch a hole in the drawing behind it
              className="size-24 rounded-full border border-[var(--border)] object-cover ring-4 ring-[var(--bg)] sm:size-32"
            />

          </div>

          {/* relative so the note anchors to this block and not to the whole
              row, whose right edge is the far side of the column */}
          <div className="relative min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-[1.75rem]/none font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-[2rem]/none">
                Aman Tyagi
              </h1>
              <VerifiedIcon className="size-[18px] shrink-0 text-[var(--verified)]" />
            </div>
            <p className="mt-2.5 font-mono text-[0.8125rem] tracking-[0.06em] text-[var(--ember)]">
              Senior Backend Engineer
            </p>

            {/* text first, arrow beneath pointing back down-left at the name —
                the base glyph already points that way, so it needs no mirror */}
            <HandwrittenNote className="-top-2 left-full ml-4 hidden w-20 flex-col items-start lg:flex">
              <span className="ml-3 -rotate-6">that&apos;s me</span>
              <HandwrittenArrow className="size-7 -rotate-12" />
            </HandwrittenNote>
          </div>
        </div>

        <p className="mt-5 max-w-[42ch] text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">
          I build the systems you never think about — until they stop working.
        </p>
      </div>

      <div className="screen-line-top relative px-4 py-4 sm:px-6">
        <InfoRows />
      </div>

      {/* icons and availability sit on one row where there's width, and stack
          left-aligned when there isn't — no stranded right-aligned text */}
      <div className="screen-line-top relative flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <SocialLinks />
        <span className="t-label">
          {yearsOfExperience()} yrs · India · open to offers
        </span>

        <HandwrittenNote className="top-0 right-full mr-5 hidden w-20 flex-col items-end xl:flex">
          <span className="-rotate-6">say hi</span>
          <HandwrittenArrow className="size-7 translate-x-3 -scale-x-100 -rotate-12" />
        </HandwrittenNote>
      </div>
    </header>
  );
}
