/* `next dev` previews drafts; production never sees them */
const PREVIEW = process.env.NODE_ENV !== "production";

export interface Post {
  slug: string;
  title: string;
  summary: string;
  /** ISO date; set it when the post is published */
  date?: string;
  /** drafts render in `next dev` only: no route, no nav link, no sitemap entry in production */
  draft: boolean;
  /** the incident this expands, so the home page can link to it */
  incident?: string;
}

const all: Post[] = [
  {
    slug: "chat-migration",
    title: "Moving 600,000 users between chat providers without downtime",
    summary:
      "Dual-write, a checksummed backfill, a per-cohort cutover, and a rollback path that was the real feature.",
    draft: true,
    incident: "INCIDENT-001",
  },
];

export const posts = all.filter((p) => PREVIEW || !p.draft);

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
