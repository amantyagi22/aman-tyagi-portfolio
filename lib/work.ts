import type { DiagramSpec } from "@/components/Diagram";

/* Case studies. Every number here is either from Aman's verified list or read
   straight out of a public repo; nothing else is claimed.
   Delightree work is under NDA: generic descriptions, no internal names, no
   customers, no code. */

export interface Section {
  title: string;
  /** rendered as numbered steps instead of paragraphs */
  steps?: boolean;
  body: string[];
}

export interface Project {
  slug: string;
  title: string;
  /** where and in what capacity */
  context: string;
  /** the one-sentence pitch, also the meta description */
  summary: string;
  stack: string[];
  /** the proof strip: tests, status, the headline number */
  proof: { value: string; label: string }[];
  live?: string;
  repo?: string;
  diagram: DiagramSpec;
  /** in reading order; "Architecture" is where the diagram goes */
  sections: Section[];
}

/* grid for the diagrams: four columns, three rows */
const C = [20, 220, 420, 620];
const R = [30, 150, 270];

export const projects: Project[] = [
  {
    slug: "debugging-simulator",
    title: "AI Debugging Simulator",
    context: "Personal project, public",
    summary:
      "A practice ground for production debugging that scores how you investigate an incident, not just the answer you type, with AI coaching on what you missed.",
    stack: ["React", "Vite", "Node.js", "Express", "MongoDB", "Gemini API"],
    proof: [
      { value: "2", label: "production-incident scenarios" },
      { value: "5", label: "investigation actions per scenario" },
      { value: "3", label: "scored sections: root cause, reasoning, fix" },
    ],
    live: "https://debugging-simulator.vercel.app",
    repo: "https://github.com/amantyagi22/debugging-simulator",
    diagram: {
      width: 790,
      height: 236,
      caption:
        "Fig. 2: the answer key never leaves the server; the LLM only writes feedback",
      nodes: [
        { id: "ui", label: "Browser", sub: "React + Vite", x: C[0], y: R[0] },
        {
          id: "api",
          label: "Express API",
          sub: "/scenarios, /submit",
          x: C[1],
          y: R[0],
        },
        {
          id: "db",
          label: "MongoDB",
          sub: "scenarios, attempts",
          x: C[2],
          y: R[0],
        },
        {
          id: "score",
          label: "Scorer",
          sub: "fuzzy match, penalties",
          x: C[1],
          y: R[1],
          accent: true,
        },
        {
          id: "llm",
          label: "Gemini",
          sub: "2.5 Flash, 2.0 fallback",
          x: C[2],
          y: R[1],
        },
        {
          id: "static",
          label: "Static message",
          sub: "if both models fail",
          x: C[3],
          y: R[1],
          dashed: true,
        },
      ],
      edges: [
        { from: "ui", to: "api" },
        { from: "api", to: "db" },
        { from: "api", to: "score", label: "diagnosis + actions" },
        { from: "score", to: "llm" },
        { from: "llm", to: "static", dashed: true },
      ],
    },
    sections: [
      {
        title: "Problem",
        body: [
          "Debugging quizzes check whether you know the answer. Real incidents test something else: which signal you look at first, what you rule out, and whether you jump to a conclusion before the evidence is in.",
          "The simulator trains and evaluates that investigation. You get a production incident, a set of things you can inspect, and a structured diagnosis to write.",
        ],
      },
      {
        title: "Success criteria",
        body: [
          "Score the investigation path, not just keywords: reward the optimal order of steps, penalize skipping a critical one, such as blaming the database without checking its indexes.",
          "Tolerate typos and synonyms in written answers.",
          "Keep the score deterministic, so the same attempt always gets the same number, even when the LLM is down.",
          "Never ship the answer key to the browser.",
        ],
      },
      {
        title: "Approach",
        steps: true,
        body: [
          "Each scenario is a MongoDB document: a problem statement, investigation actions with canned responses (logs, code, metrics, DB indexes, query explain), hints, the optimal path, required actions, expected keywords per section, and known wrong concepts.",
          "The API strips the answer key fields before returning a scenario, so the client only ever sees the evidence.",
          "The browser records every action taken and every hint used, then submits a diagnosis in three parts: root cause, reasoning, fix.",
          "Each part is fuzzy-matched against its expected keywords (fuzzball partial ratio of 75 or more; two matches earn full marks), and the three are averaged.",
          "Then the behavior adjustments: minus 10 per hint, minus 10 per skipped required action, minus 15 per wrong concept named, plus 10 for following the optimal path. The result is clamped to 0 to 100.",
          "Only after the score is fixed does Gemini see the attempt and write two to four sentences of coaching, like a senior engineer reviewing the investigation.",
        ],
      },
      { title: "Architecture", body: [] },
      {
        title: "Key tradeoffs",
        body: [
          "Deterministic score, LLM for feedback only. The number is reproducible and survives a model outage. The cost: the coaching cannot raise the score when the model spots a correct answer the keywords missed.",
          "Fuzzy keyword matching over LLM grading. Cheap, instant and every penalty is explainable. The cost: it can be gamed by keyword stuffing, and a correct answer phrased in unexpected words scores low.",
          "Canned evidence over a live sandbox. Every attempt sees the same logs and metrics, so scores are comparable. The cost: there is nothing to explore beyond the five prepared actions.",
        ],
      },
      {
        title: "Outcome",
        body: [
          "Live, with two scenarios: a memory leak in a data processor, and an API latency spike under load caused by a collection scan on a 2 million document collection.",
        ],
      },
      {
        title: "Known limits",
        body: [
          "Two scenarios is a demo, not a curriculum.",
          "The optimal-path bonus compares steps in strict order, so a valid but different order earns nothing.",
          "Attempts are anonymous and the API has no auth or rate limit, so the attempt data is not a reliable signal yet.",
        ],
      },
      {
        title: "Tests",
        body: [
          "No automated tests in the repository yet. The scorer is the first thing that needs them: it is pure, and every penalty rule is a one-line assertion.",
        ],
      },
      {
        title: "Deploy",
        body: [
          "Frontend on Vercel. The backend is a standalone Express service configured by two environment variables (MongoDB URI and Gemini API key), seeded with one script.",
        ],
      },
      {
        title: "Observability",
        body: [
          "Console logs only: model fallbacks and errors are logged, and the coaching degrades to a fixed message instead of failing the submission.",
        ],
      },
    ],
  },
  {
    slug: "launch-risk-agent",
    title: "Launch-risk agent",
    context: "Delightree, under NDA",
    summary:
      "A Python agent that predicts which franchise openings will run late, ranks what is blocking them and drafts the follow-ups. Taken from my own prototype to beta.",
    stack: [
      "Python",
      "AWS EventBridge",
      "AWS Lambda",
      "SQS + DLQ",
      "AWS Bedrock",
    ],
    proof: [
      { value: "110+", label: "tests" },
      { value: "nightly", label: "scoring run, no one triggers it" },
      { value: "POC to beta", label: "taken there by me" },
    ],
    diagram: {
      width: 790,
      height: 236,
      caption:
        "Fig. 2: scores are computed and backtested; the LLM ranks and drafts",
      nodes: [
        {
          id: "cron",
          label: "EventBridge",
          sub: "nightly schedule",
          x: C[0],
          y: R[0],
        },
        {
          id: "lambda",
          label: "Lambda",
          sub: "starts the run",
          x: C[1],
          y: R[0],
        },
        { id: "sqs", label: "SQS", sub: "work queue", x: C[2], y: R[0] },
        {
          id: "dlq",
          label: "DLQ",
          sub: "failed messages",
          x: C[3],
          y: R[0],
          dashed: true,
        },
        {
          id: "score",
          label: "Slip scoring",
          sub: "backtested",
          x: C[2],
          y: R[1],
          accent: true,
        },
        {
          id: "llm",
          label: "Bedrock LLM",
          sub: "rank blockers, draft",
          x: C[1],
          y: R[1],
        },
        {
          id: "ops",
          label: "Operations team",
          sub: "risks + follow-ups",
          x: C[0],
          y: R[1],
        },
      ],
      edges: [
        { from: "cron", to: "lambda" },
        { from: "lambda", to: "sqs" },
        { from: "sqs", to: "dlq", dashed: true },
        { from: "sqs", to: "score" },
        { from: "score", to: "llm" },
        { from: "llm", to: "ops" },
      ],
    },
    sections: [
      {
        title: "Problem",
        body: [
          "A franchise opening depends on many parallel tasks owned by different people. When one slips, the opening date slips with it, and today that is usually discovered when it is already late.",
          "The goal: tell the operations team which openings are at risk while there is still time to act, why, and what to send to whom.",
        ],
      },
      {
        title: "Success criteria",
        body: [
          "Flag an opening before it is late, not after.",
          "Every flag comes with ranked blockers and a drafted follow-up, not just a score.",
          "The risk score must hold up against history before anyone trusts it.",
        ],
      },
      {
        title: "Approach",
        steps: true,
        body: [
          "Every night an EventBridge schedule starts the run; no one has to remember to trigger it.",
          "A Lambda queues the work on SQS, with a dead-letter queue so one bad record cannot sink the whole run.",
          "Slip scoring predicts which openings will run late, guarded by backtests against past openings.",
          "Bedrock LLMs rank the blockers behind each flagged opening and draft the follow-ups.",
        ],
      },
      { title: "Architecture", body: [] },
      {
        title: "Key tradeoffs",
        body: [
          "The score is computed and backtested without an LLM; the model only ranks blockers and writes drafts. A wrong draft is cheap to ignore, a wrong score is not.",
          "A nightly batch over real-time scoring. Opening risk moves over days, not minutes, and a batch is simpler to reason about and to backtest.",
        ],
      },
      {
        title: "Outcome",
        body: [
          "In beta, built on 110+ tests.",
        ],
      },
      {
        title: "Deploy",
        body: [
          "Serverless on AWS: EventBridge, Lambda, SQS with a dead-letter queue, Bedrock.",
        ],
      },
      {
        title: "Observability",
        body: [
          "The dead-letter queue is the failure signal: a message that keeps failing lands there instead of disappearing.",
        ],
      },
    ],
  },
  {
    slug: "rag-assistant",
    title: "Multi-tenant RAG assistant",
    context: "Delightree, under NDA",
    summary:
      "Ask a question in plain English and get an answer from your own company's documents, with citations, and never from another tenant's.",
    stack: ["Python", "Weaviate", "AWS Bedrock", "Langfuse"],
    proof: [
      { value: "2", label: "layers of tenant isolation" },
      { value: "hybrid", label: "keyword + vector retrieval" },
      { value: "every call", label: "traced in Langfuse" },
    ],
    diagram: {
      width: 790,
      height: 356,
      caption:
        "Fig. 2: the tenant is checked twice, and nothing is answered below the confidence floor",
      nodes: [
        {
          id: "user",
          label: "Operator",
          sub: "asks a question",
          x: C[0],
          y: R[0],
        },
        { id: "auth", label: "Auth", sub: "tenant, layer 1", x: C[1], y: R[0] },
        {
          id: "search",
          label: "Weaviate",
          sub: "hybrid, layer 2",
          x: C[2],
          y: R[0],
          accent: true,
        },
        {
          id: "floor",
          label: "Confidence floor",
          sub: "cite or decline",
          x: C[3],
          y: R[0],
        },
        {
          id: "trace",
          label: "Langfuse",
          sub: "traces each step",
          x: C[0],
          y: R[1],
          dashed: true,
        },
        {
          id: "answer",
          label: "Answer",
          sub: "with citations",
          x: C[1],
          y: R[1],
        },
        { id: "llm", label: "Bedrock LLM", sub: "synthesis", x: C[3], y: R[1] },
        {
          id: "memory",
          label: "Conversation",
          sub: "rolling summary",
          x: C[3],
          y: R[2],
        },
      ],
      edges: [
        { from: "user", to: "auth" },
        { from: "auth", to: "search" },
        { from: "search", to: "floor" },
        { from: "floor", to: "llm" },
        { from: "memory", to: "llm" },
        { from: "llm", to: "answer" },
      ],
    },
    sections: [
      {
        title: "Problem",
        body: [
          "Franchise operators run on standard operating procedures, and finding the right paragraph in them is slow. A plain-English assistant helps only if operators can trust it.",
          "Trust has two parts. Every answer has to show where it came from. And because every customer is a tenant on the same platform, one tenant's documents can never appear in another tenant's answer. That is the failure that cannot happen once.",
        ],
      },
      {
        title: "Success criteria",
        body: [
          "Zero cross-tenant retrieval, enforced in two independent places.",
          "Every answer cites its sources; when retrieval is not confident enough, decline instead of guessing.",
          "Token cost stays bounded as a conversation grows.",
          "Every step is traceable when an answer looks wrong.",
        ],
      },
      {
        title: "Approach",
        steps: true,
        body: [
          "The tenant is resolved from the request at auth time. That is layer one.",
          "Retrieval runs in Weaviate as hybrid search, keyword and vector together, filtered by tenant again at query time. That is layer two: one check is a bug waiting to happen.",
          "Retrieved passages must clear a citation confidence floor. Below it, the assistant says it could not find an answer.",
          "An LLM on AWS Bedrock writes the answer from the passages that cleared the floor, citing them.",
          "Long conversations are compressed with rolling summarization, so the context sent to the model stays bounded.",
          "Langfuse traces every step, prompt and response.",
        ],
      },
      { title: "Architecture", body: [] },
      {
        title: "Key tradeoffs",
        body: [
          "Tenant isolation twice, not once. It costs a redundant filter on every query, and it means a single bug in either layer still leaks nothing.",
          "Hybrid retrieval over pure vector search. Operating procedures are full of exact terms that embeddings blur and keyword search catches.",
          "A confidence floor over always answering. Some answerable questions get declined; no question gets a confident, uncited guess.",
          "Rolling summaries over full history. Cost stays flat as a conversation grows, at the price of detail from early turns.",
        ],
      },
      {
        title: "Evals",
        body: [
          "A golden test set for grading LLM answers.",
        ],
      },
      {
        title: "Fallback behavior",
        body: [
          "Below the citation confidence floor the assistant declines rather than answering without a source.",
        ],
      },
      {
        title: "LLM data handling",
        body: [
          "Tenant documents are retrieved only within their own tenant, checked at auth and again at query time.",
          "Models run on AWS Bedrock, which does not use prompts or completions to train models.",
        ],
      },
      {
        title: "Observability",
        body: [
          "Langfuse traces every prompt, retrieval and response, so a bad answer can be replayed step by step.",
        ],
      },
    ],
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
