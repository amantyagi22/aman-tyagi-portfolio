export const CAREER_START = new Date("2023-02-01");

export function yearsOfExperience(): string {
  const years =
    (Date.now() - CAREER_START.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  return `${Math.floor(years)}+`;
}

export interface FocusArea {
  label: string;
  proof: string;
}

export const focusAreas: FocusArea[] = [
  {
    label: "Distributed Systems",
    proof: "cron-driven Bull fan-out, 7+ metric domains into BigQuery",
  },
  {
    label: "Performance Engineering",
    proof: "4.5s → 50ms leaderboard reads on the hot path",
  },
  {
    label: "Data Modeling",
    proof: "nested docs → flat collections; 2 queries → one $lookup",
  },
  {
    label: "AI & RAG",
    proof: "multi-tenant retrieval over franchise SOPs, Weaviate + Bedrock",
  },
  {
    label: "API Design",
    proof: "17 GraphQL APIs in one domain; partner API with hosted OpenAPI docs",
  },
];

/** The 30-second answer, per redesign.md §5.01 — three parallel columns. */
export const scaleFacts: { value: string; label: string }[] = [
  { value: "600k+", label: "records migrated" },
  { value: "90×", label: "latency reduction" },
  { value: "350+", label: "daily automated runs" },
  { value: "17", label: "APIs, one domain" },
  { value: "0", label: "downtime incidents" },
];

export const stackList = [
  "node · typescript",
  "mongodb · redis",
  "graphql · bullmq",
  "aws · docker",
  "weaviate · bedrock",
];

/** The two headline proofs, surfaced above the fold (§5, §14). */
export const headlineProofs: { value: string; label: string }[] = [
  { value: "600k+", label: "records migrated, zero downtime" },
  { value: "90×", label: "faster on the hot path" },
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

/** Postmortems, per redesign.md §5.04 — the seniority signal. */
export const incidents: Incident[] = [
  {
    id: "INCIDENT-001",
    title: "600,000 users, two chat providers, one cutover",
    severity: "high",
    impact:
      "Full messaging history migration, CometChat → SendBird, for every user on the platform.",
    detection:
      "Planned migration. The risk was never downtime — it was silent data loss nobody notices until a user scrolls back.",
    timeline: [
      "Dual-write to both providers so no message could be lost mid-flight",
      "Backfill history in batches, checksum every batch against the source",
      "Cut reads over per-cohort, smallest cohort first",
      "Verify 100% integrity, then decommission the old provider",
    ],
    resolution: "Under 50 minutes · 100% integrity · zero downtime.",
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
      "Found while auditing what the log shipper actually forwarded — not reported by anyone, and not caught by review.",
    timeline: [
      "Identify every field carrying sensitive values through the shipper",
      "Redact at the source, before serialization, not at the sink",
      "Rotate the exposed credentials",
      "Re-audit the shipped payload to confirm the leak was closed",
    ],
    resolution: "Zero secrets in shipped logs, verified after the fix.",
    learning:
      "Redact where the data is produced, not where it is stored. A sink-side filter is one config change away from leaking again — and audit what you ship, because nobody reports a leak they cannot see.",
  },
];

export interface WorkItem {
  title: string;
  description: string;
  impact: string;
}

export interface ChapterStat {
  value: string;
  label: string;
}

export type ChapterScene = "realtime" | "hotpath" | "platform";

export interface Chapter {
  arc: string;
  /** service identifier — work reframed as a deployed system (§5.03) */
  service: string;
  version: string;
  company: string;
  role: string;
  period: string;
  narrative: string;
  stats: ChapterStat[];
  scene: ChapterScene;
  items: WorkItem[];
}

/* chronological source of truth; the site renders it reversed (latest first) */
const timeline: Chapter[] = [
  {
    arc: "Foundations",
    service: "teal-analytics",
    version: "v1.0",
    company: "Teal India",
    role: "Software Engineer",
    period: "Feb 2023 – Aug 2024",
    narrative:
      "The first production systems: live dashboards over Socket.io with sticky sessions across distributed servers, and a legal document framework that shipped reports every day, unattended.",
    stats: [{ value: "350+", label: "reports a day" }],
    scene: "realtime",
    items: [
      {
        title: "Real-time analytics",
        description:
          "Socket.io with sticky sessions across distributed servers.",
        impact: "real-time at multi-server scale",
      },
      {
        title: "Legal document-extraction framework",
        description: "Automated extraction and report generation.",
        impact: "350+ reports daily",
      },
    ],
  },
  {
    arc: "Speed",
    service: "playo-core",
    version: "v2.0",
    company: "Playo",
    role: "Software Engineer",
    period: "Sep 2024 – Jun 2025",
    narrative:
      "The hot path. A leaderboard that took 4.5 seconds learned to answer in 50 milliseconds. Search dropped under a second. And 600,000 people changed chat providers without noticing.",
    stats: [
      { value: "90×", label: "leaderboard reads" },
      { value: "<1s", label: "geo search, from 4s" },
      { value: "600k+", label: "records, zero downtime" },
    ],
    scene: "hotpath",
    items: [
      {
        title: "Dense-ranking leaderboard",
        description: "Tiered Redis caching over dense ranks.",
        impact: "4.5s → 50ms (90×)",
      },
      {
        title: "Geospatial search",
        description: "MongoDB Atlas Search with geospatial querying.",
        impact: "4s → under 1s",
      },
      {
        title: "Chat migration",
        description:
          "600,000+ user records, CometChat → SendBird, zero downtime.",
        impact: "under 50 minutes · 100% integrity",
      },
    ],
  },
  {
    arc: "Platforms",
    service: "delightree-platform",
    version: "v3.0",
    company: "Delightree",
    role: "Senior Software Engineer",
    period: "Jun 2025 – Present",
    narrative:
      "Platform work — the plumbing other teams build on. A multi-tenant RAG engine over franchise SOPs, an integration platform where a new provider costs four files, and a support domain built from a blank page.",
    stats: [
      { value: "17", label: "GraphQL APIs" },
      { value: "4", label: "files per integration" },
      { value: "0", label: "secrets in logs" },
    ],
    scene: "platform",
    items: [
      {
        title: "Multi-tenant RAG engine",
        description:
          "Answers over franchise SOPs: Weaviate hybrid search + AWS Bedrock, session memory.",
        impact: "2-layer per-tenant permission isolation",
      },
      {
        title: "Integration platform",
        description:
          "Standardized 5 production integrations on Paragon: HubSpot, QuickBooks, Zapier, Zenoti, Read AI.",
        impact: "new integration = 4 files",
      },
      {
        title: "Async analytics pipeline",
        description: "Cron-driven Bull queue fan-out into BigQuery.",
        impact: "7+ metric domains",
      },
      {
        title: "Support ticketing domain",
        description: "Built from scratch — collections, APIs, notifications.",
        impact: "17 GraphQL APIs · 6 collections · 9-event notifications",
      },
      {
        title: "Data-model migration",
        description: "Nested documents flattened into their own collection.",
        impact: "2 queries → single $lookup",
      },
      {
        title: "Partner ingestion API",
        description: "Scoped API-key auth, Zod validation, hosted OpenAPI docs.",
        impact: "self-serve partner onboarding",
      },
      {
        title: "Security hardening",
        description: "Remediated credential exposure in log shipping.",
        impact: "0 secrets in logs",
      },
    ],
  },
];

/** Latest first — portfolio convention. `chapters[0]` is the current role. */
export const chapters: Chapter[] = [...timeline].reverse();

export const prologue =
  "2022 · Where it started: backend lead intern at Duckcart, DevOps intern at Recruit CRM.";

/* --- read path -----------------------------------------------------------
   Latencies are the real shape of the RAG read path: cache-first, with the
   database and queue only on a miss. `cacheSkips` lists the hops a cache hit
   short-circuits past.

   Console-only now (`trace`). This used to drive a pinned scroll section that
   made visitors scroll 320vh to learn that a cache hit is fast — the impact
   claims in `chapters` already cover that, so the section went and the data
   stayed for anyone who opens the console and actually wants the hop costs. */

export interface Hop {
  id: string;
  label: string;
  detail: string;
  /** milliseconds this hop adds on a cache hit */
  hit: number;
  /** milliseconds on a miss (undefined = hop is skipped on a hit) */
  miss: number;
  /** multiplier applied under 100× load — where queues actually back up */
  loadFactor: number;
  caption: string;
}

export const journeyHops: Hop[] = [
  {
    id: "client",
    label: "Client",
    detail: "GET /api/answers",
    hit: 0,
    miss: 0,
    loadFactor: 1,
    caption: "A question arrives from a franchise operator's dashboard.",
  },
  {
    id: "gateway",
    label: "API Gateway",
    detail: "routing · rate limit",
    hit: 2,
    miss: 2,
    loadFactor: 1.4,
    caption: "Rate limiting happens before anything expensive runs.",
  },
  {
    id: "auth",
    label: "Auth",
    detail: "tenant + scope",
    hit: 3,
    miss: 3,
    loadFactor: 1.2,
    caption:
      "Two-layer isolation: the tenant is resolved here, and again at query time. One check is a bug waiting to happen.",
  },
  {
    id: "resolver",
    label: "GraphQL Resolver",
    detail: "17 APIs, one domain",
    hit: 4,
    miss: 4,
    loadFactor: 1.6,
    caption: "One resolver, one responsibility. Batching happens below it.",
  },
  {
    id: "cache",
    label: "Redis",
    detail: "94% hit rate",
    hit: 8,
    miss: 3,
    loadFactor: 1.1,
    caption:
      "Redis first. 94% of requests stop here and return in single-digit milliseconds.",
  },
  {
    id: "db",
    label: "MongoDB",
    detail: "$lookup, indexed",
    hit: 0,
    miss: 42,
    loadFactor: 3.2,
    caption:
      "Only reached on a miss. The flattened data model turned two round trips into one $lookup.",
  },
  {
    id: "vector",
    label: "Weaviate",
    detail: "hybrid BM25 + dense",
    hit: 0,
    miss: 120,
    loadFactor: 2.4,
    caption:
      "Hybrid search: keyword and vector together. This is the expensive hop, which is exactly why the cache exists.",
  },
  {
    id: "queue",
    label: "BullMQ",
    detail: "async fan-out",
    hit: 0,
    miss: 6,
    loadFactor: 9.5,
    caption:
      "Analytics fan-out is queued, never inline. Under load this is where depth builds — and why the read path stays fast.",
  },
  {
    id: "response",
    label: "Response",
    detail: "answer + citations",
    hit: 1,
    miss: 1,
    loadFactor: 1,
    caption: "The operator gets an answer with citations back to the SOP.",
  },
];

/** Hops skipped when the cache hits — the short-circuit (§6). */
export const cacheSkips = new Set(["db", "vector", "queue"]);

/* --- changelog (§5.06) --------------------------------------------------- */

export type ChangeKind = "+" | "!" | "#";

export interface Release {
  version: string;
  date: string;
  title: string;
  scale: "MAJOR" | "MINOR";
  changes: { kind: ChangeKind; text: string }[];
}

export const releases: Release[] = [
  {
    version: "v3.0.0",
    date: "jun 2025",
    title: "senior backend engineer @ delightree",
    scale: "MAJOR",
    changes: [
      { kind: "+", text: "multi-tenant rag over franchise sops" },
      { kind: "+", text: "integration platform, 5 providers, 4 files to add a sixth" },
      { kind: "+", text: "support ticketing domain: 17 graphql apis, 6 collections" },
      { kind: "!", text: "data model migration: 2 queries → 1 $lookup" },
      { kind: "#", text: "remediated credential exposure in log shipping" },
    ],
  },
  {
    version: "v2.0.0",
    date: "sep 2024",
    title: "software engineer @ playo",
    scale: "MAJOR",
    changes: [
      { kind: "!", text: "leaderboard 4.5s → 50ms" },
      { kind: "!", text: "geo search 4s → under 1s" },
      { kind: "+", text: "600k record migration, zero downtime" },
    ],
  },
  {
    version: "v1.0.0",
    date: "feb 2023",
    title: "software engineer @ teal india",
    scale: "MAJOR",
    changes: [
      { kind: "+", text: "real-time analytics over socket.io, sticky sessions" },
      { kind: "+", text: "legal document extraction, 350+ reports daily" },
    ],
  },
  {
    version: "v0.1.0",
    date: "2022",
    title: "internships @ duckcart, recruit crm",
    scale: "MINOR",
    changes: [
      { kind: "+", text: "backend lead intern; devops and infrastructure intern" },
    ],
  },
];

export interface TreeNode {
  id: string;
  label: string;
  note: string;
  /** where it was used — the evidence the spec (§5.05) requires per node */
  usedAt: string;
  /** the band it sits in — layout derives x/y from this plus row order */
  branch: Branch;
}

export const BRANCHES = ["core", "data", "async", "platform", "ai"] as const;
export type Branch = (typeof BRANCHES)[number];

export const treeNodes: TreeNode[] = [
  { id: "js", label: "JavaScript / TypeScript", note: "The root node. Everything else hangs off this.", usedAt: "every role since 2022", branch: "core" },
  { id: "node", label: "Node.js / Express", note: "Default runtime. Services, workers, and CLIs.", usedAt: "Teal, Playo, Delightree", branch: "core" },
  { id: "gql", label: "GraphQL (Apollo)", note: "17 production APIs in the ticketing domain alone.", usedAt: "Delightree", branch: "core" },
  { id: "dist", label: "Distributed Patterns", note: "Sticky sessions, fan-out, idempotency, dual-write cutovers.", usedAt: "Teal, Playo, Delightree", branch: "core" },
  { id: "mongo", label: "MongoDB", note: "Primary store at three straight jobs.", usedAt: "Teal, Playo, Delightree", branch: "data" },
  { id: "agg", label: "Aggregation / Indexing", note: "Where the latency wins come from — including 2 queries to one $lookup.", usedAt: "Playo, Delightree", branch: "data" },
  { id: "bq", label: "BigQuery", note: "Analytics sink for the cron-driven queue fan-out. 7+ metric domains.", usedAt: "Delightree", branch: "data" },
  { id: "weaviate", label: "Weaviate", note: "Hybrid BM25 + dense retrieval for the RAG engine.", usedAt: "Delightree", branch: "data" },
  { id: "redis", label: "Redis", note: "Leaderboard cache and BullMQ backend. The 90× story.", usedAt: "Playo, Delightree", branch: "async" },
  { id: "bull", label: "BullMQ", note: "Async fan-out so the read path never waits on analytics.", usedAt: "Delightree", branch: "async" },
  { id: "cron", label: "Cron", note: "Scheduled triggers for the analytics pipeline.", usedAt: "Delightree", branch: "async" },
  { id: "webhooks", label: "Webhooks", note: "Five production integrations' worth, normalized behind one interface.", usedAt: "Delightree", branch: "async" },
  { id: "aws", label: "AWS", note: "Bedrock, S3, SSM, DynamoDB.", usedAt: "Delightree", branch: "platform" },
  { id: "docker", label: "Docker", note: "Same box everywhere, from laptop to production.", usedAt: "Teal, Playo, Delightree", branch: "platform" },
  { id: "rag", label: "RAG", note: "Multi-tenant retrieval with two-layer permission isolation.", usedAt: "Delightree", branch: "ai" },
  { id: "vector", label: "Vector Search", note: "Hybrid retrieval: keyword and embedding scores combined.", usedAt: "Delightree", branch: "ai" },
  { id: "bedrock", label: "AWS Bedrock", note: "Model access for answer synthesis, with session memory.", usedAt: "Delightree", branch: "ai" },
];

export const treeEdges: [string, string][] = [
  ["js", "node"],
  ["node", "gql"],
  ["gql", "dist"],
  ["node", "mongo"],
  ["mongo", "agg"],
  ["agg", "bq"],
  ["agg", "weaviate"],
  ["node", "redis"],
  ["redis", "bull"],
  ["bull", "cron"],
  ["bull", "webhooks"],
  ["bull", "bq"],
  ["dist", "aws"],
  ["dist", "docker"],
  ["weaviate", "vector"],
  ["rag", "vector"],
  ["vector", "bedrock"],
  ["aws", "bedrock"],
];

export const writing = [
  "Redis caching strategies",
  "MongoDB aggregation optimization",
  "Scaling Socket.io systems",
  "Event-driven architectures in Node.js",
];

export const links = {
  github: "https://github.com/amantyagi22",
  linkedin: "https://www.linkedin.com/in/aman-tyagi-700a06190/",
  email: "mailto:amantyagi2k@gmail.com",
};
