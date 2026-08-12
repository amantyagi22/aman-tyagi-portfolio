import {
  BriefcaseBusinessIcon,
  CodeXmlIcon,
  MailIcon,
  MapPinIcon,
  MarsIcon,
  ClockIcon,
} from "lucide-react";
import { links } from "@/lib/data";

/* The at-a-glance block: role, location, contact. Icons come from lucide
   rather than hand-rolled paths — its geometry is optically corrected for
   small sizes, which hand-drawn 2px strokes at 13px are not. */

const ROWS: {
  icon: React.ReactNode;
  text: string;
  href?: string;
}[] = [
  { icon: <CodeXmlIcon />, text: "Senior Backend Engineer @Delightree" },
  { icon: <MapPinIcon />, text: "India · IST (UTC+5:30)" },
  { icon: <MailIcon />, text: "amantyagi2k@gmail.com", href: links.email },
  { icon: <ClockIcon />, text: "3+ years shipping production systems" },
  {
    icon: <BriefcaseBusinessIcon />,
    text: "Open to backend & platform roles",
  },
  { icon: <MarsIcon />, text: "he/him" },
];

export function InfoRows() {
  return (
    <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {ROWS.map((row) => (
        <li key={row.text} className="flex items-center gap-3">
          <IconTile>{row.icon}</IconTile>
          {row.href ? (
            <a
              href={row.href}
              className="font-mono text-[0.8125rem] text-[var(--text-secondary)] underline decoration-[var(--border-strong)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:decoration-[var(--ember)]"
            >
              {row.text}
            </a>
          ) : (
            <span className="font-mono text-[0.8125rem] text-[var(--text-secondary)]">
              {row.text}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/* Square chip framing a leading icon. The filled ground plus offset ring is
   what makes a 16px glyph read as deliberate rather than as stray line-work. */
function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--text-tertiary)] ring-1 ring-[var(--border)] ring-offset-1 ring-offset-[var(--bg)] select-none [&_svg]:size-4 [&_svg]:shrink-0">
      {children}
    </span>
  );
}
