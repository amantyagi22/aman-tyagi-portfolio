import { FileTextIcon, MailIcon } from "lucide-react";
import { links } from "@/lib/data";

/* Brand marks are solid filled paths (GitHub and LinkedIn, from the official
   brand geometry) — that's what makes them read crisply at 16px. Mail and
   resume have no brand mark, so they come from lucide, the same library the
   info rows use, rather than a third hand-drawn style. */

const SOCIALS = [
  { label: "GitHub", href: links.github, icon: <GitHubIcon /> },
  { label: "LinkedIn", href: links.linkedin, icon: <LinkedInIcon /> },
  { label: "Email", href: links.email, icon: <MailIcon /> },
  { label: "Resume", href: "/resume", icon: <FileTextIcon /> },
];

export function SocialLinks() {
  return (
    <ul className="flex flex-wrap items-center gap-2">
      {SOCIALS.map(({ label, href, icon }) => (
        <li key={label}>
          <a
            href={href}
            // external links open away; /resume and mailto stay in-tab
            {...(href.startsWith("http")
              ? { target: "_blank", rel: "noopener" }
              : {})}
            title={label}
            className="flex size-8 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)] [&_svg]:size-[18px] [&_svg]:shrink-0"
          >
            {icon}
            <span className="sr-only">{label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.372 0 11.997 0 17.3 3.438 21.795 8.205 23.38c.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.609-4.042-1.609C4.422 17.77 3.633 17.4 3.633 17.4c-1.087-.744.084-.73.084-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.417-1.304.76-1.604-2.665-.3-5.466-1.332-5.466-5.929 0-1.31.465-2.38 1.235-3.219-.135-.303-.54-1.523.105-3.175 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.006 2.04.138 3 .404 2.28-1.551 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.608-2.805 5.623-5.475 5.918.42.36.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.284 0 .315.21.69.825.57C20.565 21.79 24 17.291 24 11.997 24 5.372 18.627 0 12 0" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.274 0H1.728C.692 0 0 .685 0 1.715v20.569C0 23.316.864 24 1.727 24h20.546C23.31 24 24 23.315 24 22.285V1.716C24.001.684 23.31 0 22.274 0M7.08 20.4H3.454V8.915h3.625zM5.352 7.371c-1.209 0-2.07-.856-2.07-2.056s.863-2.059 2.07-2.059c1.21 0 2.073.859 2.073 2.059S6.388 7.37 5.352 7.37M20.548 20.4h-3.626v-5.485c0-1.371 0-3.087-1.9-3.087-1.898 0-2.073 1.372-2.073 2.916V20.4H9.325V8.915h3.454v1.541c.69-1.2 2.073-1.885 3.453-1.885 3.627 0 4.316 2.4 4.316 5.485z" />
    </svg>
  );
}
