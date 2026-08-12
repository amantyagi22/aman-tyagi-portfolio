import {
  chapters,
  focusAreas,
  incidents,
  prologue,
  scaleFacts,
  treeNodes,
  BRANCHES,
} from "@/lib/data";
import { CodeXmlIcon } from "lucide-react";
import { Panel, PanelTitle } from "@/components/ui/Panel";

/* Every section here is plain indexable text in a bordered column. No canvas,
   no scroll-driven state, no client components — the whole page is static. */

export function Overview() {
  return (
    <Panel id="overview">
      <PanelTitle>Overview</PanelTitle>

      {/* five facts, so a 3-col grid leaves a visible hole in row 2 —
          auto-fit keeps them evenly distributed at any width */}
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-x-6 gap-y-6">
        {scaleFacts.map((fact) => (
          <li key={fact.label}>
            <p className="t-metric text-[var(--foreground)]">{fact.value}</p>
            <p className="mt-1.5 text-[0.9375rem] leading-snug text-[var(--text-secondary)]">
              {fact.label}
            </p>
          </li>
        ))}
      </ul>

      <ul className="mt-8 border-t border-[var(--border)]">
        {focusAreas.map((area) => (
          <li
            key={area.label}
            className="flex flex-col gap-1 border-b border-[var(--border)] py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <p className="text-[1.0625rem] text-[var(--foreground)]">
              {area.label}
            </p>
            {/* left-aligned: right-aligning a value that wraps to two lines
                leaves a ragged left edge that reads as a layout bug */}
            <p className="font-mono text-[0.8125rem] leading-relaxed text-[var(--text-secondary)] sm:max-w-[52%]">
              {area.proof}
            </p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function Experience() {
  return (
    <Panel id="experience">
      <PanelTitle>Experience</PanelTitle>

      {/* Company is the heading with location opposite; the role sits nested
          beneath it behind an icon, then a compact meta line, then tech tags.
          The narrative paragraphs are gone — the bullets already say what the
          work was, and the prose restated them at three times the length. */}
      <div className="space-y-8">
        {chapters.map((chapter) => (
          <article key={chapter.company}>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <h3 className="text-[1.25rem] font-semibold tracking-[-0.01em] text-[var(--foreground)]">
                {chapter.company}
              </h3>
              <p className="font-mono text-[0.8125rem] text-[var(--text-tertiary)]">
                {chapter.location}
              </p>
            </div>

            {/* nested under the company, with a rule marking the indent */}
            <div className="mt-3 border-l border-[var(--border)] pl-4">
              <div className="flex items-center gap-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--text-tertiary)] [&_svg]:size-3.5">
                  <CodeXmlIcon />
                </span>
                <p className="text-[1.0625rem] font-medium text-[var(--foreground)]">
                  {chapter.role}
                </p>
              </div>

              <p className="mt-2 flex flex-wrap items-center gap-x-2 font-mono text-[0.8125rem] text-[var(--text-tertiary)] tabular-nums">
                <span>{chapter.type}</span>
                <span aria-hidden="true">·</span>
                <span>{chapter.dates}</span>
                <span aria-hidden="true">·</span>
                <span>{chapter.duration}</span>
              </p>

              <ul className="mt-3 flex flex-wrap gap-1.5">
                {chapter.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-md border border-[var(--border)] px-2.5 py-1 font-mono text-[0.8125rem] text-[var(--text-secondary)]"
                  >
                    {t}
                  </li>
                ))}
              </ul>

              <ul className="mt-5 space-y-4">
                {chapter.items.map((item) => (
                  <li key={item.title}>
                    {/* the title carries the weight so the eye can skim just
                        the titles; the explanation stays regular */}
                    <p className="text-[1rem] leading-relaxed">
                      <span className="font-semibold text-[var(--foreground)]">
                        {item.title}
                      </span>
                      <span className="font-normal text-[var(--text-secondary)]">
                        {" — "}
                        {item.description}
                      </span>
                    </p>
                    <p className="mt-1 font-mono text-[0.8125rem] text-[var(--ember)]">
                      {item.impact}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 border-t border-[var(--border)] pt-4 font-mono text-[0.8125rem] leading-relaxed text-[var(--text-tertiary)]">
        {prologue}
      </p>
    </Panel>
  );
}

export function Incidents() {
  return (
    <Panel id="incidents">
      <PanelTitle>Incidents</PanelTitle>

      <div className="space-y-8">
        {incidents.map((incident) => (
          <article key={incident.id}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="font-mono text-[0.8125rem] text-[var(--text-tertiary)]">
                {incident.id}
              </p>
              <p
                className={`font-mono text-[10px] tracking-[0.12em] uppercase ${
                  incident.severity === "high"
                    ? "text-[var(--ember)]"
                    : "text-[var(--text-tertiary)]"
                }`}
              >
                {incident.severity}
              </p>
            </div>

            <h3 className="mt-2 text-[1.125rem] font-semibold tracking-[-0.01em] text-[var(--foreground)]">
              {incident.title}
            </h3>

            <p className="mt-2.5 max-w-[64ch] text-[1rem] leading-relaxed text-[var(--text-secondary)]">
              {incident.impact}
            </p>

            <ol className="mt-4 space-y-1.5">
              {incident.timeline.map((step, i) => (
                <li
                  key={step}
                  className="flex gap-3 text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]"
                >
                  <span className="shrink-0 font-mono text-[11px] text-[var(--text-tertiary)] tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            <p className="mt-4 font-mono text-[0.8125rem] text-[var(--ember)]">
              {incident.resolution}
            </p>
            <p className="mt-3 max-w-[64ch] border-t border-[var(--border)] pt-3 text-[0.9375rem] leading-relaxed text-[var(--text-secondary)]">
              {incident.learning}
            </p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

/* The old StackGraph was 392 lines of interactive SVG to convey a grouped
   list. This is the grouped list. */
export function Stack() {
  return (
    <Panel id="stack">
      <PanelTitle>Stack</PanelTitle>

      <div className="space-y-5">
        {BRANCHES.map((branch) => (
          <div key={branch}>
            <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--text-tertiary)] uppercase">
              {branch}
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {treeNodes
                .filter((node) => node.branch === branch)
                .map((node) => (
                  <li
                    key={node.id}
                    title={`${node.note} (${node.usedAt})`}
                    className="rounded-md border border-[var(--border)] px-2.5 py-1 text-[0.9375rem] text-[var(--text-secondary)]"
                  >
                    {node.label}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </Panel>
  );
}
