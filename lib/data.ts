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

export interface TreeNode {
  id: string;
  label: string;
  x: number;
  y: number;
  note: string;
  branch: string;
}

export const treeNodes: TreeNode[] = [
  { id: "js", label: "JavaScript / TypeScript", x: 80, y: 60, note: "The root node. Everything else hangs off this.", branch: "Core" },
  { id: "node", label: "Node.js / Express", x: 300, y: 60, note: "Default runtime since 2022.", branch: "Core" },
  { id: "gql", label: "GraphQL (Apollo)", x: 500, y: 60, note: "17 production APIs in one domain alone.", branch: "Core" },
  { id: "dist", label: "Distributed Patterns", x: 690, y: 60, note: "Queues, fan-out, sticky sessions, idempotency.", branch: "Core" },
  { id: "mongo", label: "MongoDB", x: 80, y: 160, note: "Primary store at three straight jobs.", branch: "Data" },
  { id: "agg", label: "Aggregation / Indexing", x: 300, y: 160, note: "Where the latency wins come from.", branch: "Data" },
  { id: "bq", label: "BigQuery", x: 500, y: 135, note: "Analytics sink for the queue fan-out.", branch: "Data" },
  { id: "weaviate", label: "Weaviate", x: 500, y: 185, note: "Hybrid search for the retrieval engine.", branch: "Data" },
  { id: "bull", label: "Bull / Redis", x: 80, y: 260, note: "Queues and cache. Also the 90× story.", branch: "Async" },
  { id: "cron", label: "Cron", x: 280, y: 235, note: "Scheduled fan-out.", branch: "Async" },
  { id: "pubsub", label: "Pub/Sub", x: 280, y: 285, note: "The 9-event notification system runs on this.", branch: "Async" },
  { id: "webhooks", label: "Webhooks", x: 450, y: 260, note: "Five integrations' worth of them.", branch: "Async" },
  { id: "aws", label: "AWS", x: 690, y: 185, note: "Bedrock, S3, SSM, DynamoDB.", branch: "Platform" },
  { id: "docker", label: "Docker", x: 690, y: 260, note: "Same box everywhere.", branch: "Platform" },
  { id: "rag", label: "RAG", x: 80, y: 360, note: "Multi-tenant, permission-aware.", branch: "AI" },
  { id: "vector", label: "Vector Search", x: 300, y: 360, note: "Hybrid: BM25 + vectors.", branch: "AI" },
  { id: "langchain", label: "LangChain / LangGraph", x: 520, y: 360, note: "Orchestration when a single chain isn't enough.", branch: "AI" },
];

export const treeEdges: [string, string][] = [
  ["js", "node"],
  ["node", "gql"],
  ["gql", "dist"],
  ["mongo", "agg"],
  ["agg", "bq"],
  ["agg", "weaviate"],
  ["bull", "cron"],
  ["bull", "pubsub"],
  ["cron", "webhooks"],
  ["pubsub", "webhooks"],
  ["dist", "aws"],
  ["weaviate", "vector"],
  ["rag", "vector"],
  ["vector", "langchain"],
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
