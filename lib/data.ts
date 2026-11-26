/* First role: Duckcart, 2022. Exact month unknown, so this is the latest 2022
   month that still gives "4+" today; the count can run late, never early. */
export const CAREER_START = new Date("2022-11-01");

export function yearsOfExperience(): string {
  const years =
    (Date.now() - CAREER_START.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  return `${Math.floor(years)}+`;
}

/** "1y 3m" since `start` - for the current role, so it never goes stale. */
export function durationSince(start: Date): string {
  const now = new Date();
  const months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    now.getMonth() -
    start.getMonth();
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y}y`, m && `${m}m`].filter(Boolean).join(" ") || "0m";
}

export interface FocusArea {
  label: string;
  proof: string;
}

/* AI first, to match the headline. Four rows: the 90× stat above already
   carries the leaderboard, so performance leans on the search win instead. */
export const focusAreas: FocusArea[] = [
  {
    label: "AI Agents",
    proof: "an agent that spots which store openings are about to slip",
  },
  {
    label: "RAG & LLM Evals",
    proof: "answers from a company's own documents, with sources and a test set",
  },
  {
    label: "Performance Engineering",
    proof: "geospatial search from 4 seconds to under 1",
  },
  {
    label: "Platform & APIs",
    proof: "integrations, queues and public APIs other teams build on",
  },
];

/* The 30-second answer. Four, not five: "0 downtime incidents" was dropped -
   an absence is unfalsifiable and read as filler beside the hard numbers, and
   the fifth item orphaned itself on its own grid row. The zero-downtime claim
   still earns its place in INCIDENT-001, where the method backs it up. */
export const scaleFacts: { value: string; label: string }[] = [
  { value: "600k+", label: "records migrated" },
  { value: "90×", label: "latency reduction" },
  { value: "350+", label: "legal reports a day" },
  { value: "17", label: "APIs, one domain" },
];

export interface Incident {
  id: string;
  title: string;
  severity: "high" | "moderate";
  impact: string;
  detection: string;
  timeline: string[];
  resolution: string;
  learning: string;
  /** present when the outcome is a latency win worth demonstrating (§6) */
  latency?: {
    label: string;
    beforeMs: number;
    afterMs: number;
    beforeLabel: string;
    afterLabel: string;
  };
}

/** Postmortems, per redesign.md §5.04 - the seniority signal. */
export const incidents: Incident[] = [
  {
    id: "INCIDENT-001",
    title: "600,000 users, two chat providers, one cutover",
    severity: "high",
    impact:
      "Full messaging history migration, CometChat → SendBird, for every user on the platform.",
    detection:
      "Planned migration. The risk was never downtime. It was silent data loss nobody notices until a user scrolls back.",
    timeline: [
      "Dual-write to both providers so no message could be lost mid-flight",
      "Backfill history in batches, checksum every batch against the source",
      "Cut reads over per-cohort, smallest cohort first",
      "Verify 100% integrity, then decommission the old provider",
    ],
    resolution: "Under 50 minutes, 100% integrity, zero downtime.",
    learning:
      "Dual-write and verify before you cut over. The rollback path is the feature; the migration is just the part that happens if the rollback is never needed.",
  },
  {
    id: "INCIDENT-002",
    title: "A leaderboard that took 4.5 seconds",
    severity: "high",
    impact:
      "The most-viewed screen in the product blocked for 4.5s on every load. Dense ranking over a growing player set, recomputed per request.",
    detection:
      "User-reported slowness, confirmed by tracing the read path end to end rather than guessing at the query.",
    timeline: [
      "Profile first: the cost was recomputing dense ranks, not fetching them",
      "Introduce tiered Redis caching keyed by leaderboard segment",
      "Precompute ranks on write, serve reads from cache",
      "Add explicit invalidation rather than short TTLs, to keep reads correct",
    ],
    resolution: "4.5s → 50ms. A 90× reduction on the hot path.",
    learning:
      "Measure before optimizing. The obvious suspect was the database; the actual cost was work being redone on every single request.",
    latency: {
      label: "Leaderboard read, p50",
      beforeMs: 4500,
      afterMs: 50,
      beforeLabel: "4.5s",
      afterLabel: "50ms",
    },
  },
  {
    id: "INCIDENT-003",
    title: "Credentials in the log pipeline",
    severity: "moderate",
    impact:
      "Application logs being shipped to an external aggregator included credential material that should never have left the process.",
    detection:
      "Found while auditing what the log shipper actually forwarded. Not reported by anyone, and not caught by review.",
    timeline: [
      "Identify every field carrying sensitive values through the shipper",
      "Redact at the source, before serialization, not at the sink",
      "Rotate the exposed credentials",
      "Re-audit the shipped payload to confirm the leak was closed",
    ],
    resolution: "Zero secrets in shipped logs, verified after the fix.",
    learning:
      "Redact where the data is produced, not where it is stored. A sink-side filter is one config change away from leaking again. And audit what you ship, because nobody reports a leak they cannot see.",
  },
];

export interface WorkItem {
  title: string;
  description: string;
  impact: string;
  /** the case study, when one exists */
  href?: string;
}

export interface Chapter {
  company: string;
  /** where the role sat, and whether it was remote */
  location: string;
  role: string;
  /** Full-time / Part-time / Internship */
  type: string;
  /** compact range, e.g. "06.2025 - present" */
  dates: string;
  /** elapsed time, e.g. "1y 2m" */
  duration: string;
  /** the tools actually used, rendered as tags */
  tech: string[];
  items: WorkItem[];
}

/* chronological source of truth; the site renders it reversed (latest first) */
const timeline: Chapter[] = [
  {
    company: "Teal India",
    location: "Bengaluru, India (On-site)",
    role: "Software Engineer",
    type: "Full-time",
    dates: "02.2023 - 08.2024",
    duration: "1y 7m",
    tech: ["Node.js", "Socket.io", "MongoDB", "Express", "Docker"],
    items: [
      {
        title: "Real-time analytics",
        description:
          "Live dashboards that kept updating correctly even as we added more servers.",
        impact: "sub-second updates, even as servers scaled out",
      },
      {
        title: "Legal document-extraction framework",
        description:
          "Software that reads legal documents and writes the reports itself.",
        impact: "350+ reports a day, no one touching them",
      },
    ],
  },
  {
    company: "Playo",
    location: "Bengaluru, India (On-site)",
    role: "Software Engineer",
    type: "Full-time",
    dates: "09.2024 - 06.2025",
    duration: "10m",
    tech: ["Node.js", "Redis", "MongoDB Atlas", "TypeScript", "AWS"],
    items: [
      {
        title: "Dense-ranking leaderboard",
        description:
          "Precomputed the rankings and kept them in fast memory, instead of rebuilding them every visit.",
        impact: "4.5s to 50ms, 90x faster",
      },
      {
        title: "Geospatial search",
        description: "Made 'find places near me' actually fast.",
        impact: "4s to under 1s",
      },
      {
        title: "Chat migration",
        description:
          "Moved every user's chat history to a new provider without taking the app down.",
        impact: "600k users moved in under 50 minutes, zero downtime",
      },
    ],
  },
  {
    company: "Delightree",
    location: "Remote",
    role: "Senior Software Engineer",
    type: "Full-time",
    dates: "06.2025 - present",
    duration: durationSince(new Date("2025-06-01")),
    tech: [
      "TypeScript",
      "Python",
      "GraphQL",
      "Weaviate",
      "AWS Bedrock",
      "AWS Lambda",
      "BullMQ",
      "BigQuery",
      "MongoDB",
      "Zod",
    ],
    items: [
      {
        title: "Launch-risk agent",
        description:
          "An AI agent that predicts which franchise openings will run late, ranks what is blocking them and drafts the follow-ups. Took it from my own prototype to beta.",
        impact: "late openings get flagged before they are late, 110+ tests",
        href: "/work/launch-risk-agent",
      },
      {
        title: "Multi-tenant RAG engine",
        description:
          "Ask a question in plain English, get an answer pulled from the company's own manuals.",
        impact: "2 layers of tenant isolation, so no franchise sees another's documents",
        href: "/work/rag-assistant",
      },
      {
        title: "Agent tooling",
        description:
          "Prototyped an MCP server that lets AI agents use the product's operations, procedures, tasks and training, as tools, passing the user's own login through. Plus a loader for the golden dataset we grade LLM answers against.",
        impact: "3 product areas exposed as agent tools, zero backend changes, 100+ tests",
      },
      {
        title: "Integration platform",
        description:
          "One shared way to connect outside tools: HubSpot, QuickBooks, Zapier, Zenoti and Read AI.",
        impact: "5 production integrations, a new provider is 4 files",
      },
      {
        title: "Async analytics pipeline",
        description:
          "Moved the heavy number-crunching to the background, on a schedule.",
        impact: "7+ metric domains, none of it on the request path",
      },
      {
        title: "Support ticketing domain",
        description:
          "Designed and built the whole support-ticket system, start to finish.",
        impact: "17 GraphQL APIs and 6 collections, built from nothing",
      },
    ],
  },
];

/** Latest first - portfolio convention. `chapters[0]` is the current role. */
export const chapters: Chapter[] = [...timeline].reverse();

export const prologue =
  "2022 · Where it started: founding engineer at Duckcart, DevOps intern at Recruit CRM.";

export interface TreeNode {
  id: string;
  label: string;
  note: string;
  /** where it was used - the evidence the spec (§5.05) requires per node */
  usedAt: string;
  /** the band it sits in - layout derives x/y from this plus row order */
  branch: Branch;
}

export const BRANCHES = ["core", "data", "async", "platform", "ai"] as const;
export type Branch = (typeof BRANCHES)[number];

/* Display names for the skill groups, in the order pages show them */
export const branchTitles: [Branch, string][] = [
  ["ai", "AI"],
  ["core", "Languages & APIs"],
  ["data", "Data"],
  ["async", "Async & events"],
  ["platform", "Platform"],
];

export const treeNodes: TreeNode[] = [
  { id: "js", label: "JavaScript / TypeScript", note: "The root node. Everything else hangs off this.", usedAt: "every role since 2022", branch: "core" },
  { id: "python", label: "Python / FastAPI", note: "Eval tooling and the golden-dataset loader.", usedAt: "Delightree", branch: "core" },
  { id: "node", label: "Node.js / Express", note: "Default runtime. Services, workers, and CLIs.", usedAt: "Teal, Playo, Delightree", branch: "core" },
  { id: "gql", label: "GraphQL (Apollo)", note: "17 production APIs in the ticketing domain alone.", usedAt: "Delightree", branch: "core" },
  { id: "dist", label: "Distributed Patterns", note: "Sticky sessions, fan-out, idempotency, dual-write cutovers.", usedAt: "Teal, Playo, Delightree", branch: "core" },
  { id: "mongo", label: "MongoDB", note: "Primary store at three straight jobs.", usedAt: "Teal, Playo, Delightree", branch: "data" },
  { id: "agg", label: "Aggregation / Indexing", note: "Where the latency wins come from, including 2 queries to one $lookup.", usedAt: "Playo, Delightree", branch: "data" },
  { id: "bq", label: "BigQuery", note: "Analytics sink for the cron-driven queue fan-out. 7+ metric domains.", usedAt: "Delightree", branch: "data" },
  { id: "weaviate", label: "Weaviate", note: "Hybrid BM25 + dense retrieval for the RAG engine.", usedAt: "Delightree", branch: "data" },
  { id: "redis", label: "Redis", note: "Leaderboard cache and BullMQ backend. The 90× story.", usedAt: "Playo, Delightree", branch: "async" },
  { id: "bull", label: "BullMQ", note: "Async fan-out so the read path never waits on analytics.", usedAt: "Delightree", branch: "async" },
  { id: "cron", label: "Cron", note: "Scheduled triggers for the analytics pipeline.", usedAt: "Delightree", branch: "async" },
  { id: "webhooks", label: "Webhooks", note: "Five production integrations' worth, normalized behind one interface.", usedAt: "Delightree", branch: "async" },
  { id: "aws", label: "AWS", note: "Lambda, SQS, EventBridge, Bedrock, S3, DynamoDB.", usedAt: "Delightree", branch: "platform" },
  { id: "docker", label: "Docker", note: "Same box everywhere, from laptop to production.", usedAt: "Teal, Playo, Delightree", branch: "platform" },
  { id: "rag", label: "RAG", note: "Multi-tenant retrieval with two-layer permission isolation.", usedAt: "Delightree", branch: "ai" },
  { id: "vector", label: "Vector Search", note: "Hybrid retrieval: keyword and embedding scores combined.", usedAt: "Delightree", branch: "ai" },
  { id: "bedrock", label: "AWS Bedrock", note: "Claude and Titan, for answer synthesis and the launch-risk agent.", usedAt: "Delightree", branch: "ai" },
  { id: "agents", label: "AI Agents", note: "Nightly EventBridge → Lambda → SQS pipeline that scores launch risk.", usedAt: "Delightree", branch: "ai" },
  { id: "mcp", label: "MCP", note: "Product operations exposed as agent tools via JWT pass-through.", usedAt: "Delightree", branch: "ai" },
  { id: "evals", label: "LLM Evals / Langfuse", note: "Golden datasets and prompt tracing.", usedAt: "Delightree", branch: "ai" },
];

/* The one place every profile URL lives. The resume, JSON-LD, llms.txt and
   every page read from here, so the identity stays consistent. */
export const links = {
  github: "https://github.com/amantyagi22",
  linkedin: "https://www.linkedin.com/in/aman-tyagi-700a06190/",
  site: "https://www.amantyagi.me",
  email: "mailto:amantyagi2k@gmail.com",
};
