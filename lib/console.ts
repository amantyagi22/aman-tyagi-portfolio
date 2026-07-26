import {
  chapters,
  incidents,
  journeyHops,
  cacheSkips,
  releases,
  scaleFacts,
  treeNodes,
  yearsOfExperience,
  type Hop,
} from "@/lib/data";

/* A real shell, not a menu in costume (redesign.md §7).
   Pure functions: the command layer is testable and has no DOM dependency —
   the UI only supplies effects (navigate, theme, resume, clear). */

export type Effect =
  | { type: "navigate"; target: string }
  | { type: "resume" }
  | { type: "theme" }
  | { type: "clear" }
  | { type: "close" };

export interface CommandResult {
  /** printed above the next prompt; empty means no output */
  lines: string[];
  effect?: Effect;
}

export interface CommandSpec {
  name: string;
  args?: string;
  summary: string;
  run: (args: string[]) => CommandResult;
}

const SECTIONS = [
  "overview",
  "journey",
  "services",
  "incidents",
  "stack",
  "changelog",
  "contact",
] as const;

const pad = (s: string, n: number) => s.padEnd(n, " ");

function ok(...lines: string[]): CommandResult {
  return { lines };
}

function err(message: string): CommandResult {
  return { lines: [message] };
}

/** `curl` prints a realistic response, and a second call serves from cache. */
const curlCache = new Set<string>();

function curl(path: string): CommandResult {
  const route = path.replace(/^https?:\/\/[^/]+/, "") || "/";
  const known: Record<string, { body: string[]; miss: number; hit: number }> = {
    "/api/answers": {
      body: [
        `  "answer": "Closing checklist: lock the safe, log the drawer count…",`,
        `  "citations": [{ "sop": "closing-procedure", "section": 4 }],`,
        `  "tenant": "franchise-0421"`,
      ],
      miss: 178,
      hit: 9,
    },
    "/api/leaderboard": {
      body: [
        `  "scope": "weekly",`,
        `  "ranking": "dense",`,
        `  "entries": [{ "rank": 1, "player": "…", "score": 4821 }]`,
      ],
      miss: 4500,
      hit: 50,
    },
  };

  const hit = known[route];
  if (!hit) {
    return err(
      `curl: (22) no route ${route} — try /api/answers or /api/leaderboard`
    );
  }

  const cached = curlCache.has(route);
  curlCache.add(route);
  const ms = cached ? hit.hit : hit.miss;

  return ok(
    `> GET ${route}`,
    ``,
    `< HTTP/1.1 200 OK`,
    `< content-type: application/json`,
    `< x-cache: ${cached ? "HIT" : "MISS"}`,
    `< x-response-time: ${ms}ms`,
    ``,
    `{`,
    ...hit.body,
    `}`,
    ``,
    cached
      ? `served from redis in ${ms}ms — run it again and it stays warm`
      : `cold read, ${ms}ms. run the same command again to see the cache.`
  );
}

function describeHop(hop: Hop): string {
  const skips = cacheSkips.has(hop.id);
  return `${pad(hop.label, 18)}${pad(
    skips ? "miss only" : "always",
    12
  )}${hop.miss}ms`;
}

export function buildCommands(): CommandSpec[] {
  const commands: CommandSpec[] = [
    {
      name: "help",
      summary: "list commands",
      run: () =>
        ok(
          "available commands:",
          "",
          ...commands.map(
            (c) => `  ${pad(c.args ? `${c.name} ${c.args}` : c.name, 20)}${c.summary}`
          ),
          "",
          "↑ ↓ history · tab completes · esc closes"
        ),
    },
    {
      name: "whoami",
      summary: "the short version",
      run: () =>
        ok(
          "aman tyagi — backend engineer",
          `${yearsOfExperience()} years · india · open to offers`,
          "",
          "distributed systems, performance engineering, data modeling,",
          "retrieval/RAG, api design.",
          "",
          ...scaleFacts.map((f) => `  ${pad(f.value, 8)}${f.label}`)
        ),
    },
    {
      name: "ls",
      summary: "list sections",
      run: () => ok(...SECTIONS.map((s) => `  ${s}/`)),
    },
    {
      name: "cd",
      args: "<section>",
      summary: "jump to a section",
      run: ([target]) => {
        if (!target) return err("cd: needs a section — try `ls`");
        const match = SECTIONS.find((s) => s === target || s.startsWith(target));
        if (!match) return err(`cd: no such section: ${target}`);
        return { lines: [], effect: { type: "navigate", target: match } };
      },
    },
    {
      name: "services",
      summary: "what I've shipped",
      run: () =>
        ok(
          ...chapters.flatMap((c) => [
            `${pad(c.service, 24)}${c.version}${
              c === chapters[0] ? " · current" : ""
            }`,
            `  ${c.company} — ${c.role}, ${c.period}`,
            `  ${c.stats.map((s) => `${s.value} ${s.label}`).join(" · ")}`,
            "",
          ])
        ),
    },
    {
      name: "cat",
      args: "<incident-00N>",
      summary: "read a postmortem",
      run: ([target]) => {
        if (!target)
          return err(
            `cat: needs a file — ${incidents
              .map((i) => i.id.toLowerCase())
              .join(", ")}`
          );
        const found = incidents.find(
          (i) => i.id.toLowerCase() === target.toLowerCase()
        );
        if (!found) return err(`cat: ${target}: no such file`);
        return ok(
          `${found.id} — severity: ${found.severity}`,
          found.title,
          "",
          `IMPACT      ${found.impact}`,
          `DETECTION   ${found.detection}`,
          `TIMELINE`,
          ...found.timeline.map((t, i) => `  ${i + 1}. ${t}`),
          `RESOLUTION  ${found.resolution}`,
          `LEARNING    ${found.learning}`
        );
      },
    },
    {
      name: "curl",
      args: "<path>",
      summary: "send a request (cached on repeat)",
      run: ([path]) => (path ? curl(path) : err("curl: needs a path")),
    },
    {
      name: "trace",
      summary: "the read path, hop by hop",
      run: () =>
        ok(
          `${pad("HOP", 18)}${pad("WHEN", 12)}COST (miss)`,
          ...journeyHops.map(describeHop),
          "",
          "on a cache hit, mongodb / weaviate / bullmq are skipped entirely."
        ),
    },
    {
      name: "stack",
      summary: "the dependency graph, as text",
      run: () =>
        ok(
          ...treeNodes.map(
            (n) => `${pad(n.label, 26)}${pad(n.branch, 10)}${n.usedAt}`
          )
        ),
    },
    {
      name: "changelog",
      summary: "career as release notes",
      run: () =>
        ok(
          ...releases.flatMap((r) => [
            `${pad(r.version, 10)}${pad(r.date, 12)}${r.title}`,
            ...r.changes.map((c) => `           ${c.kind} ${c.text}`),
            "",
          ])
        ),
    },
    {
      name: "resume",
      summary: "open the printable document",
      run: () => ({ lines: [], effect: { type: "resume" } }),
    },
    {
      name: "theme",
      summary: "toggle dark / light",
      run: () => ({ lines: [], effect: { type: "theme" } }),
    },
    {
      name: "clear",
      summary: "clear the screen",
      run: () => ({ lines: [], effect: { type: "clear" } }),
    },
    {
      name: "exit",
      summary: "close the console",
      run: () => ({ lines: [], effect: { type: "close" } }),
    },
  ];

  return commands;
}

export function execute(
  input: string,
  commands: CommandSpec[]
): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };
  const [name, ...args] = trimmed.split(/\s+/);
  const command = commands.find((c) => c.name === name.toLowerCase());
  if (!command) {
    return err(`command not found: ${name} — type \`help\``);
  }
  return command.run(args);
}

/** Tab completion: command names first, then that command's known arguments. */
export function complete(input: string, commands: CommandSpec[]): string | null {
  const parts = input.split(/\s+/);
  if (parts.length <= 1) {
    const matches = commands.filter((c) => c.name.startsWith(parts[0] ?? ""));
    return matches.length === 1 ? matches[0].name + " " : null;
  }
  const [name, partial = ""] = parts;
  const pool =
    name === "cd"
      ? [...SECTIONS]
      : name === "cat"
        ? incidents.map((i) => i.id.toLowerCase())
        : name === "curl"
          ? ["/api/answers", "/api/leaderboard"]
          : [];
  const matches = pool.filter((p) => p.startsWith(partial));
  return matches.length === 1 ? `${name} ${matches[0]}` : null;
}
