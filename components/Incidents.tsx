"use client";

import { incidents, type Incident } from "@/lib/data";
import { Reveal } from "@/components/motion/Reveal";
import { Chip, Label, LatencyBar, SectionOpener } from "@/components/primitives";

/* Postmortems per redesign.md §5.04. Fixed field order — the format itself
   is the signal, so it never varies between entries. */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
      <dt className="t-label pt-0.5">{label}</dt>
      <dd className="t-body text-[var(--text-secondary)]">{children}</dd>
    </div>
  );
}

function IncidentReport({ incident }: { incident: Incident }) {
  return (
    <article
      id={incident.id.toLowerCase()}
      className="scroll-mt-24 border-t border-[var(--border)] pt-10"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        {/* deep link: a hiring manager forwarding one incident is the best
            outcome this page can produce (§7) */}
        <a
          href={`#${incident.id.toLowerCase()}`}
          className="group inline-flex items-baseline gap-2"
        >
          <Label as="span">{incident.id}</Label>
          <span
            aria-hidden="true"
            className="font-mono text-[11px] text-[var(--text-tertiary)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            #
          </span>
          <span className="sr-only">— link to this incident</span>
        </a>
        <Chip tone={incident.severity === "high" ? "critical" : "neutral"}>
          severity: {incident.severity}
        </Chip>
      </div>

      <h3 className="t-h2 mt-3 max-w-[24ch] text-[var(--foreground)]">
        {incident.title}
      </h3>

      <dl className="mt-8 space-y-5">
        <Field label="Impact">{incident.impact}</Field>
        <Field label="Detection">{incident.detection}</Field>
        <Field label="Timeline">
          <ol className="space-y-2">
            {incident.timeline.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="font-mono text-[11px] leading-6 text-[var(--text-tertiary)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Field>
        <Field label="Resolution">
          <span className="text-[var(--foreground)]">{incident.resolution}</span>
        </Field>
        <Field label="Learning">{incident.learning}</Field>
      </dl>

      {/* the 90× incident earns a demonstration, not just a sentence (§6) */}
      {incident.latency ? (
        <div className="mt-8 sm:ml-[8.5rem]">
          <LatencyBar {...incident.latency} />
        </div>
      ) : null}
    </article>
  );
}

export function Incidents() {
  return (
    <section id="incidents" className="section-standard border-t border-[var(--border)]">
      {/* narrower container than the rest of the page: postmortems are read
          top-to-bottom, and a wide column would leave dead space at right */}
      <div className="mx-auto w-full max-w-4xl px-6">
        <Reveal>
          <SectionOpener
            label="03 · Incidents"
            title="Three problems, written up honestly"
            lead="The work that mattered, in the format engineers actually use to reason about failure."
          />
        </Reveal>

        <div className="mt-16 space-y-16">
          {incidents.map((incident) => (
            <Reveal key={incident.id}>
              <IncidentReport incident={incident} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
