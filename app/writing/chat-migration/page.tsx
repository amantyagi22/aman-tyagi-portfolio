import { notFound } from "next/navigation";
import { PageHeader, PageShell, TextSection } from "@/components/Page";
import { pageMeta } from "@/lib/seo";
import { getPost } from "@/lib/writing";

const post = getPost("chat-migration");

/* Draft: getPost returns nothing in production while draft is true, so this
   route 404s there. Keep it out of search until it is published too. */
export const metadata = post
  ? {
      ...pageMeta(`/writing/${post.slug}`, post.title, post.summary),
      ...(post.draft ? { robots: { index: false, follow: false } } : {}),
    }
  : {};

export default function ChatMigrationPost() {
  if (!post) notFound();

  return (
    <PageShell>
      <PageHeader
        crumb={{ label: "← Writing", href: "/writing" }}
        title={post.title}
        lede="At Playo I moved the full messaging history of more than 600,000 users from CometChat to SendBird. The cutover took under 50 minutes, every message arrived intact, and nobody saw downtime. This is how, and why the rollback path mattered more than the migration."
      >
        <p className="label mt-4 text-soft">
          {post.draft ? "draft, not published" : post.date}
        </p>
      </PageHeader>

      <TextSection
        title="The risk was not downtime"
        body={[
          "Downtime is loud. Someone notices within minutes and you roll back.",
          "Silent data loss is the real risk in a chat migration. A message that never made it across looks exactly like a message that was never sent, until a user scrolls back months later and a conversation has a hole in it.",
          "So the plan was built around one question: at every step, how do we know nothing went missing, and how do we get back if something did?",
        ]}
      />

      <TextSection
        title="Success criteria"
        steps
        body={[
          "Every message in the old provider exists in the new one, verified, not assumed.",
          "No user loses the ability to send or read messages at any point.",
          "Every step can be undone without data loss until the old provider is switched off.",
        ]}
      />

      <TextSection
        title="Step 1: dual-write"
        body={[
          "Before moving any history, every new message was written to both providers. From that moment on, the new provider could only fall behind on history, never on live traffic.",
          "That split the problem in two: a stream of live messages that was already safe, and a fixed, finite backlog of history that could be moved at our own pace.",
        ]}
      />

      <TextSection
        title="Step 2: a checksummed backfill"
        body={[
          "History moved in batches. After each batch, a checksum computed over the source batch was compared with the same checksum computed over what landed in the new provider.",
          "A batch only counted as done once the two checksums matched, so a bad batch surfaced during the backfill, not months later.",
        ]}
      />

      <TextSection
        title="Step 3: cut reads over per cohort"
        body={[
          "Reads moved to the new provider one cohort of users at a time, smallest cohort first. If something was wrong, the smallest possible group saw it, and the next cohort waited until the first one looked clean.",
        ]}
      />

      <TextSection
        title="The rollback path"
        body={[
          "Because writes still went to both providers, any cohort could be pointed back at the old provider at any time and lose nothing. That stayed true until the very last step.",
          "Only after integrity was verified at 100% was the old provider decommissioned. That is the one step with no undo, so it came last.",
        ]}
      />

      <TextSection
        title="Result"
        body={[
          "More than 600,000 users moved, under 50 minutes, 100% integrity, zero downtime.",
        ]}
      />

      <TextSection
        title="What I would keep, and change"
        body={[
          "Keep: dual-write and verify before cutting over. The rollback path is the feature. The migration is just the part that happens if the rollback is never needed.",
        ]}
      />
    </PageShell>
  );
}
