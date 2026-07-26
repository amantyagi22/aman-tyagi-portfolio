# Portfolio Redesign Brief
**Aman Tyagi — Backend Engineer**
Direction: an operating system for a backend engineer's career, not a portfolio page.

---

## 1. Brutal critique of the current site

I built most of this, so I'm marking my own homework. Here's what's actually wrong.

### It is a template with a nicer paint job
Strip the 3D desk out and what remains is: sticky header → hero with name and two buttons → three job cards → a skills diagram → contact. That is the same skeleton as ten thousand Next.js portfolios. The desk is decoration bolted to a generic structure, not a structural idea. **A recruiter cannot tell from the layout alone that you are a backend engineer rather than a designer or a frontend dev.**

### The hero spends its most valuable asset on nothing
Three full screens of scroll — the most attention you will ever have — deliver: your name, your title, "the best backend work is invisible," and three links. That is a business card stretched across 300vh. The desk is genuinely nice, but it says "I have a desk," not "I move 600,000 records with zero downtime." **The most expensive real estate on the site carries the least information.**

### The numbers are buried where nobody scrolls
`90×`, `600k+`, `<1s`, `350+/day` are your entire pitch. They currently appear at ~40% scroll depth, at `text-2xl`, in a row of three, below a paragraph. Most visitors never reach them. These should be near-unavoidable.

### "The details" expander is where information goes to die
Every quantified achievement — the RAG isolation model, the 17 GraphQL APIs, the `$lookup` migration — is behind a collapsed disclosure labeled "the details" in 12px grey. Nobody clicks that. You have hidden your best evidence behind your weakest affordance.

### The dependency graph is a diagram, not a tool
It's a flat SVG with hardcoded x/y coordinates. Hovering prints a caption. It can't be filtered, traversed, queried, or explored. It looks like architecture but has none of architecture's behavior. A Staff Engineer will hover twice and move on. And "Aggregation / Indexing" as a *node* is not a system — the graph conflates skills with infrastructure.

### Typography has no confidence and no range
Effectively two sizes: `text-xl` headings and `text-sm` body, with `text-5xl/7xl` only on your name. There is no display tier, no editorial pull-quote, no numeric tier. Every section header is the same weight, size, and colour as every other, so the page reads as one long flat plain. Nothing says "this part matters more."

### Spacing is uniform, so nothing is emphasized
`py-20` between every section, `mt-10` under every header, `gap-8` in every grid. Consistent — but consistency without contrast is monotony. Premium layouts breathe unevenly: enormous space around one idea, tight clusters elsewhere. Rhythm is what makes Linear and Stripe feel expensive.

### The animation communicates nothing
Everything fades up 8px in 200ms. The chapter scenes have life, but the *page* is inert. For a backend engineer this is a wasted opportunity: your work is literally about things moving through systems — requests, queues, events, migrations. **The motion should be the content.**

### The terminal is a lie
There's a "Cmd+K Console" with a `❯` prompt and typed commands — but it only scrolls to anchors. It cosplays as a terminal without being one. Engineers will type `ls`, get nothing, and feel the fake. Either make it real or drop the costume.

### Recruiter Mode is an admission of failure
A button that says "click here for the version that actually works" concedes the main experience doesn't serve its primary audience. Keep the printable resume, kill the framing that the site is a toy with an escape hatch.

### Smaller cuts
- **Dead weight in the header.** Three buttons of chrome above the fold on a site with four sections.
- **The kickers are noise.** "Interlude," "Epilogue" — literary framing on an engineering site.
- **"Currently drafting: redis caching strategies · …"** — advertising four things that don't exist. Ship one or cut the line.
- **No proof of life.** No GitHub activity, no commit graph, no "deployed 3 hours ago." Nothing indicates you are *currently* an engineer.
- **Colour does no work.** Ember appears on a chapter label, a prompt glyph, and a few 3D accents — decoratively. It should mean one thing consistently.

### Where attention is lost (measured against the current build)
| Scroll depth | What happens | Verdict |
|---|---|---|
| 0–100vh | Name, title | Pretty, near-zero information |
| 100–300vh | Two more sentences | **Primary drop-off — nothing new is learned** |
| ~350vh | First real number | Too late |
| ~450vh | Details collapsed | Best evidence hidden |
| ~600vh | Static graph | Looks technical, isn't interactive |
| ~750vh | Contact | Most never arrive |

---

## 2. The core idea

> **The site is a running system, and the visitor is inspecting it in production.**

Not "a portfolio with infrastructure decoration." The interface *is* an operations console: services, requests, incidents, metrics, deploys. Your career is the system under inspection. Every metaphor must be load-bearing — if it doesn't carry real information, it's decoration and it goes.

Three rules that keep this from becoming a gimmick:
1. **Every animated element displays real data.** No fake CPU graphs. A moving packet represents an actual request path you built.
2. **The metaphor never obstructs the facts.** Every visual claim has plain text beside it. A recruiter skimming with the 3D disabled still gets everything.
3. **It degrades to a document.** No WebGL, no JS, reduced motion, screen reader, print — the content survives all five.

---

## 3. Information architecture

Current IA is chronology-shaped. New IA is **system-shaped**, ordered by what each audience needs first.

```
/                        THE CONSOLE
│
├── 00  STATUS BAR          persistent · uptime, current role, availability
├── 01  SYSTEM OVERVIEW     who + scale + specialization       ← 30-second answer
├── 02  REQUEST JOURNEY     one request through the stack      ← the wow moment
├── 03  SERVICES            work as deployed services          ← replaces "chapters"
│     └── service detail    architecture · decisions · metrics ← Staff Eng depth
├── 04  INCIDENTS           postmortems of real problems       ← the differentiator
├── 05  TOPOLOGY            interactive infrastructure map     ← replaces static graph
├── 06  CHANGELOG           career as release notes            ← replaces timeline
└── 07  CONNECT             contact + resume + availability
```

Plus two persistent layers:
- **`⌘K` Console** — real command execution, navigation, and deep links.
- **Resume view** — a genuine document at `/resume`, not a mode toggle.

**Why "services" instead of jobs:** a job is a biographical fact; a service is a thing you built that has an architecture, an SLA, and failure modes. Reframing employment as deployed systems is the single most powerful move available — it makes every entry *technical* instead of *biographical*, and it gives a Staff Engineer somewhere to dig.

---

## 4. Page flow

### The first 8 seconds
Landing is not a hero image. It is a **system coming online**, and it resolves fast.

```
0.0s   Near-black. One ember cursor blinking, centre-left.
0.3s   Status line types: booting aman.systems
0.6s   Four service nodes fade in, unlit, in a topology
0.9s   Nodes light left→right as they "start" — a real deploy cadence
1.4s   Edges draw. First packet moves. The system is live.
1.8s   Headline resolves over the topology:

           Backend Engineer.
           I build the systems you never think about.

           3+ years   ·   600k records migrated, zero downtime
                      ·   4.5s → 50ms on the hot path
```

By second two, a recruiter has: role, seniority, two hard numbers, and visual proof you think in systems. Compare with the current build, where two seconds buys a name.

**Critically: the boot sequence never blocks.** Scroll or key press at any point jumps to resolved state. It is a flourish, never a gate — and it runs once per session (`sessionStorage`), because a loading animation on every visit is hostile.

### Scroll sequence
| # | Section | Length | Function |
|---|---|---|---|
| 01 | System Overview | 1.5 screens | Specialization + scale, immediately |
| 02 | Request Journey | 3 screens, pinned | The memorable moment |
| 03 | Services | 1 screen + drill-down | Work, latest first |
| 04 | Incidents | 2 screens | Judgment and depth |
| 05 | Topology | 1.5 screens | Exploration |
| 06 | Changelog | 1 screen | Trajectory, scannable |
| 07 | Connect | 0.5 screen | Convert |

Total ~11 screens — shorter than today's, carrying far more.

---

## 5. Every section, redesigned

### 00 · Status bar (persistent)
Replaces the header. A single 32px strip, monospace, that reads like a real status line:

```
● OPERATIONAL   senior backend engineer @ delightree   ·   ist 14:32   ·   open to offers        ⌘K
```

The dot is the accent's primary job: **ember = live**. It pulses at true 1Hz. Hovering reveals uptime-since-2023. This is chrome that *is* content.

### 01 · System overview
Kills the current "Focus" list. A three-column ledger, monospace, no cards, no borders — hairline rules only:

```
SPECIALIZATION            SCALE                        STACK

distributed systems       600k+  records migrated      node · typescript
performance engineering    90×   latency reduction     mongodb · redis
data modeling             350+   daily automated runs  graphql · bullmq
retrieval / RAG            17    apis, one domain      aws · docker
api design                  0    downtime incidents    weaviate · bedrock
```

Numbers count up when scrolled into view, `tabular-nums`, 40px, ember. This is the 30-second answer, and it is text — indexable, screen-readable, copy-pasteable.

### 02 · Request journey ← **the wow moment**
Pinned full-viewport. A single API request traverses a real architecture — the one behind your RAG engine — and **scroll is the request's progress**.

```
CLIENT → API GATEWAY → AUTH → RESOLVER → CACHE → DB → QUEUE → WORKER → RESPONSE
```

As the packet reaches each node:
- The node lights ember and scales imperceptibly (1.02).
- A latency chip appears: `+2ms`, `+0.4ms`, `+180ms`.
- A running total climbs in the corner: `elapsed: 47ms`.
- A caption explains one real decision: *"Redis first. 94% hit rate — most requests stop here."*
- On a cache hit, the packet **short-circuits back**, skipping the database. The visitor *sees* why caching matters.

Two toggles above the flow — `cache: hit / miss` and `load: 1x / 100x` — re-run the journey with different numbers. Under 100x, the queue backs up and you narrate backpressure. **This is the single best idea in this document.** It is unforgettable, it is unmistakably backend, and no template has it.

### 03 · Services (replaces career chapters)
Reverse-chronological, as required. Each role is a **deployed service** with a live-looking header:

```
● delightree-platform                                    v3.0 · deployed jun 2025 · CURRENT
  senior backend engineer

  multi-tenant retrieval, integration platform, support domain from scratch

  p99 ─ 17 apis   ·   5 integrations   ·   4 files to add the sixth   ·   0 secrets in logs

  [ inspect ] [ architecture ] [ decisions ]
```

`inspect` expands inline; `architecture` opens that service's topology; `decisions` opens the ADR list. **Nothing important is collapsed by default** — the metrics row is always visible. Only the deep detail is behind a click, and the click is labeled with what it reveals, not "the details."

### 04 · Incidents ← **the differentiator**
Nobody has this. Real engineering problems written as postmortems — the format signals seniority before a word is read.

```
INCIDENT-002                                            severity: high
600,000 users, two chat providers, one weekend

IMPACT      full messaging history migration, CometChat → SendBird
DETECTION   planned migration; the risk was silent data loss
TIMELINE    ▸ dual-write both providers
            ▸ backfill in batches, checksum each
            ▸ cut reads over per-cohort
            ▸ verify 100%, decommission
RESOLUTION  under 50 minutes · 100% integrity · zero downtime
LEARNING    dual-write and verify before you cut over. the rollback
            path is the feature, not the migration.
```

Three of these: the migration, the 90× leaderboard, the credential exposure in log shipping. The last one matters most — **admitting you found and fixed a security problem reads as senior, not risky.** Engineering managers hire people who write clear postmortems.

### 05 · Topology (replaces the static graph)
A real interactive map, not a diagram:
- **Click a node** → it becomes the focus; the graph re-lays out around it; unrelated nodes recede to 20%.
- **Trace dependencies** → click two nodes, the path between them highlights.
- **Filter** → `all / data / async / ai / platform`.
- **Every node carries evidence** → "Redis · leaderboard cache, BullMQ backend · 90× improvement · used at Playo and Delightree."
- **Search** → `/` focuses a filter input.

The distinction from today: **the current graph shows you know the words; this one shows you know the relationships.**

### 06 · Changelog
Career as release notes — dense, scannable, one screen:

```
v3.0.0  jun 2025   senior backend engineer @ delightree      MAJOR
        + multi-tenant rag over franchise sops
        + integration platform, 5 providers
        ! data model migration: 2 queries → 1 $lookup
        # remediated credential exposure in log shipping

v2.0.0  sep 2024   software engineer @ playo                 MAJOR
        ! leaderboard 4.5s → 50ms
        ! geo search 4s → <1s
        + 600k record migration, zero downtime
```

Semver framing implies you understand breaking vs additive change. Costs one screen; reads as very senior.

### 07 · Connect
No form (nobody fills forms). One line, three links, and the availability state repeated from the status bar. Add local time in IST — for an India-based engineer talking to global companies, timezone is a real question, so answer it before it's asked.

---

## 6. Animation ideas (all data-bearing)

| Animation | What it communicates | Where |
|---|---|---|
| **Boot sequence** | Systems start in dependency order | Landing |
| **Packet traversal** | Request path through real architecture | 02 |
| **Cache short-circuit** | Why the 94% hit rate matters | 02 |
| **Backpressure** | Queue depth under 100× load | 02 |
| **Latency collapse** | 4.5s bar drains to 50ms, *timed to real duration* | 01, 04 |
| **Dependency trace** | How systems actually connect | 05 |
| **Node wake** | Cold start → ready | Landing, 05 |
| **Counter roll-up** | Scale, with tabular-nums stability | 01 |
| **Log stream** | Live-system texture — 3 lines, then stops | Status bar |
| **Deploy progress** | Release cadence | 06 |

**Banned:** parallax, letter-by-letter text outside the console, confetti, cursor followers, infinite ambient loops, scroll-jacking that traps, decorative particles.

**The timing rule that makes it feel engineered:** when you show a latency improvement, animate at a *real ratio*. 4.5s → 50ms is 90×; if the "before" bar takes 900ms to drain, the "after" takes 10ms. The viewer feels the difference physically. That's the difference between illustrating a number and demonstrating it.

---

## 7. Interaction ideas

**The console, made real.** Not a nav menu in costume — a working shell:
```
help  ·  ls  ·  cd <service>  ·  cat incident-002  ·  curl /api/leaderboard
metrics  ·  whoami  ·  resume  ·  theme  ·  clear
```
`curl` runs the request journey in miniature and prints a realistic response with timing. `cat incident-002` prints the postmortem as text. Real command history with ↑/↓, real tab completion. **If it can't be real, remove the prompt styling and call it a menu.**

**Keyboard-first**, because your audience lives there:
`⌘K` console · `/` search topology · `j`/`k` between sections · `g` then `s` to services · `?` shortcuts overlay · `Esc` closes everything.
Ship a `?` overlay. It signals "built for engineers" faster than any copy.

**Deep links.** `#incident-002`, `#service/delightree` — anything worth reading is worth sharing. A hiring manager forwarding a specific incident to a teammate is the best outcome this site can produce.

**Hover with restraint.** Nodes brighten and reveal one line. Related nodes brighten at 50%. Everything else drops to 20%. No lift, no shadow, no scale beyond 1.02.

**Copy affordances.** Every metric and command is click-to-copy with a quiet confirmation. Recruiters paste numbers into ATS notes — make that frictionless.

---

## 8. Typography system

Two families. `Geist Sans` display/body, `Geist Mono` for all data, labels, and commands. **The discipline: prose is sans, anything a machine produced is mono.** That single rule does most of the design's work — the visitor subconsciously reads the mono as system output.

| Tier | Size / line-height | Weight | Tracking | Use |
|---|---|---|---|---|
| Display | 72 / 0.95 (clamp 44→72) | 600 | −0.03em | One per page: the landing statement |
| H1 | 48 / 1.05 | 600 | −0.02em | Section openers |
| H2 | 30 / 1.15 | 600 | −0.015em | Service and incident names |
| H3 | 20 / 1.3 | 600 | −0.01em | Subsections |
| Body-L | 18 / 1.65 | 400 | 0 | Lead paragraphs — max 62ch |
| Body | 15 / 1.6 | 400 | 0 | Default |
| Metric | 40 / 1 mono | 600 | −0.02em | Numbers. `tabular-nums`, always |
| Label | 11 / 1.4 mono | 500 | 0.16em, uppercase | Field labels |
| Code | 13 / 1.7 mono | 400 | 0 | Console, logs |

**What's broken today:** no display tier, so nothing is ever loud; body at 14px is a touch small for 18px-reading hiring managers; measure is unconstrained on wide screens. Fix: add the display tier, body to 15, cap measure at 62ch.

**One editorial device:** a single 30px sans pull-quote per major section, no quotation marks, generous space. Used exactly once per section, it creates the rhythm the site currently lacks.

---

## 9. Spacing system

8px base. **Use only these:** `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192`. Nothing between.

The current failure is uniformity. Replace with a deliberate three-density rhythm:

| Density | Section padding | Internal gap | Applied to |
|---|---|---|---|
| **Expansive** | 192 | 64 | Landing, request journey — one idea, vast air |
| **Standard** | 128 | 32 | Services, incidents |
| **Dense** | 96 | 16 | Ledger, changelog, topology legend |

Density itself becomes information: air means "contemplate this," density means "scan this." A changelog *should* be tight; a landing statement should not.

Grid: 12 columns, 1280 max, 24 gutters, 24 margins (16 mobile). Long-form text never exceeds 8 columns even when the container is 12.

---

## 10. Colour system

Monochrome plus one accent, and the accent has exactly one meaning: **ember = activity, live, now.**

```
                        dark              light
canvas                  #060607           #fbfbfa
surface                 #0d0d0f           #ffffff
surface-raised          #141417           #f6f6f5
hairline                #ffffff / 8%      #0c0c0e / 10%
hairline-strong         #ffffff / 16%     #0c0c0e / 18%
text-primary            #f5f5f4           #0a0a0a
text-secondary          #a1a1a6           #55555c
text-tertiary           #6b6b70           #86868b

ember (accent)          #e8590c           #c2410c
ember-dim (10%)         rgba(232,89,12,.10)
```

**Rules that keep it disciplined:**
1. Ember only on: live status, the traveling packet, the active node, the current role, the counting metric. Never on a button, never on a border for decoration, never as a gradient.
2. **Ember never exceeds ~2% of pixels on screen.** Its power is scarcity.
3. All state — hover, focus, selection — is expressed in *lightness*, not hue.
4. No semantic red/green/yellow anywhere except the incident severity chip, where red is genuinely meaningful.
5. Contrast floors: 15:1 primary, 7:1 secondary, 4.5:1 tertiary and ember-on-canvas. Verify ember in **both** themes — `#e8590c` on white fails; that's why the light token is darker.

Light mode is not an inversion. Dark is a console; light is a technical document — slightly warmer paper, slightly heavier hairlines, same structure.

---

## 11. Component library

**Primitives:** `StatusDot` (pulses only when live) · `Metric` (tabular-nums, count-up, click-to-copy) · `Label` (mono uppercase) · `Hairline` · `Chip` (latency/severity/version) · `KeyCap` · `CopyButton` · `Prompt`.

**Composites:** `LedgerTable` (borderless, hairline rows) · `ServiceCard` (status + version + metrics, never fully collapsed) · `IncidentReport` (fixed postmortem fields) · `ChangelogEntry` (semver + typed change lines) · `TopologyNode` / `TopologyEdge` · `ConsoleLine` · `LatencyBar` (real-ratio animation) · `ShortcutOverlay` · `SectionOpener`.

**Layout:** `Console` (shell) · `StatusBar` · `Section` (density variant) · `Grid` · `Measure` (62ch cap) · `PinnedStage` (scroll-driven scenes).

Every component takes a `static` prop that renders it inert — that's how reduced-motion, print, and no-JS fallbacks stay honest instead of being separate code paths that rot.

---

## 12. Three.js ideas

**Rule: 3D only where 2D genuinely can't do it.** Two scenes earn WebGL; everything else is SVG/CSS, which is sharper, faster, and accessible.

**Scene A — the topology (primary).** Nodes as instanced geometry, edges as lines, packets as points along paths. 3D earns its place because depth encodes layers (edge → service → data) and rotation reveals relationships a flat diagram flattens away. Interactions: orbit within limits, click to focus with a camera tween, hover to trace. Under ~400 objects, one draw call per type, 60fps on integrated graphics.

**Scene B — the request journey (primary).** The pinned scroll scene. Camera dollies along the request path; depth-of-field ahead and behind the packet focuses attention on the current hop. Real-ratio timing.

**Keep the desk — demote it.** It's charming and it's *yours*, but it belongs at the bottom near contact, as a small "where this gets built" moment, not as the headline. It says something human, not something technical, and it should be positioned accordingly.

**Budget, non-negotiable:** <150KB gzipped for all 3D · zero WebGL before first paint · pause when offscreen · static frame under reduced motion · full canvas-less fallback (topology renders as SVG, journey as a static annotated diagram) · never block interaction on WebGL init. Detect low-end devices and serve the fallback rather than 12fps.

---

## 13. Motion principles

1. **Every animation is an explanation.** If you can't say what it teaches, delete it.
2. **Real ratios.** Latency animations are scaled to actual measurements.
3. **Reading is never delayed.** Text is legible at frame one; motion may finish afterward.
4. **Interruptible always.** Any scroll or key press completes the current animation immediately.
5. **Settle and stop.** Nothing loops forever. The only permitted repeat is the 1Hz status pulse — because a heartbeat is information.
6. **Transform and opacity only.** Compositor-only, 60fps floor.
7. **Motion follows causality.** Things move because something caused them, along the path the data actually takes.

**Tokens** (keep the current scale — it's good):
`instant 120ms` hover/focus · `fast 200ms` reveals · `base 320ms` panels · `slow 600ms` draws · `sequence 1200ms` orchestrated.
`ease-out cubic-bezier(.16,1,.3,1)` entrances · `ease-inout cubic-bezier(.65,0,.35,1)` reversible · `ease-linear` data motion (packets move at constant velocity — physics, not personality).

**Reduced motion:** every animation resolves to its final state instantly. The request journey becomes a static annotated diagram with all latencies printed. Nothing is lost, only the theatre.

---

## 14. Recruiter journey

Optimizing for a non-engineer with 40 tabs open.

| Time | Sees | Takeaway |
|---|---|---|
| 0:00–0:05 | Boot + headline + two numbers | Backend engineer, senior, real scale |
| 0:05–0:30 | The ledger | Specialization, scale, stack — all skimmable text |
| 0:30–1:30 | Services, latest first, metrics visible | Current role, trajectory, quantified impact |
| 1:30–3:00 | An incident | Communicates clearly, handles pressure |
| 3:00+ | Console or topology | Curiosity, not obligation |

**Three non-negotiables for this audience:**
1. **Everything critical is real text.** Not baked into canvas, not behind interaction.
2. **`/resume` is a URL**, prints to one clean page, no mode toggle. Linked from the status bar.
3. **Availability is unambiguous** and above the fold: open to offers, notice period, location, timezone.

The recruiter never needs to touch a 3D scene. They should *notice* it and think "this person is thorough."

### The 30-second test
> Backend engineer, 3+ years, senior. Distributed systems, performance, RAG. Migrated 600k records with zero downtime; cut a hot path 90×; built a multi-tenant retrieval platform. Node/TS/Mongo/Redis/AWS. In India, open to offers.

If a redesign iteration doesn't deliver that in 30 seconds without interaction, it has failed regardless of how good it looks.

---

## 15. Engineering manager journey

A Staff Engineer is asking one question: *is this person's depth real or rehearsed?* Give them somewhere to dig, and let the digging be rewarding.

| Depth | Provides |
|---|---|
| Surface | Same 30-second summary |
| Second layer | **Decisions with tradeoffs** — "Weaviate over pgvector because hybrid BM25+dense mattered more than one less service; cost: another system to operate" |
| Third layer | **Postmortems** — sequence, verification strategy, what was learned |
| Fourth layer | **The request journey with a cache miss** — where time actually goes |
| Fifth layer | **Topology tracing** — how the pieces genuinely connect |

**What earns their respect specifically:**
- Naming the **tradeoff**, not just the choice. Every ADR states what you gave up.
- The **failure** entry: found and remediated a credential exposure in log shipping. Include it prominently.
- **Honest scale.** "600k records" not "millions." Precision reads as trustworthy; inflation is detectable and fatal.
- **Verification strategy** — checksums, dual-write, per-cohort cutover. Seniors care more about how you knew it worked than that it worked.
- One **"what I'd do differently"** line per incident. Nothing signals seniority faster.

---

## 16. Mobile experience

Not a squeezed desktop — a different information density for a different context (a recruiter on a phone between meetings).

- **Status bar collapses** to `● senior backend engineer · open` with the console behind a tap.
- **Landing**: boot sequence runs, topology becomes a simplified 5-node 2D diagram, headline and both numbers stack. Full weight, no truncation.
- **Request journey**: the killer feature must survive. It becomes a **vertical** flow — the packet descends through nodes as you scroll, latency chips to the right. Same lesson, portrait orientation. This is the one place worth building a second implementation.
- **Services**: full-width, metrics wrap to two columns, `inspect` opens a sheet.
- **Incidents**: field labels stack above values.
- **Topology**: 3D off by default. A filterable list grouped by layer, with a "view as diagram" opt-in.
- **Changelog**: unchanged, it's already dense text.

**Rules:** 44px minimum touch targets · never trap vertical scroll · WebGL off below 1.5 aspect unless opted in · assume 4G and a cold cache.

---

## 17. Accessibility

The current site is decent; this makes it genuinely good — and for this audience, accessibility *is* a craft signal.

- **Semantic landmarks** throughout; sections are `<section>` with `aria-labelledby`, not styled divs.
- **Full keyboard path** to every piece of information, including anything reachable in the topology. If a node's note is only available on hover, it's inaccessible — every node is a `<button>` in a roving-tabindex group.
- **Visible focus everywhere**: 2px ember ring, 2px offset. Never `outline: none` without a replacement.
- **Canvas is `aria-hidden` and always has a text twin.** The topology has a real nested `<ul>`; the request journey has an ordered list of hops with latencies. Screen readers get the *content*, not an apology.
- **Live regions, used sparingly.** Console output is `aria-live="polite"`; the counting metrics are not (announcing every tick is torture) — they expose only the final value via `aria-label`.
- **Reduced motion** disables all of it and shows final states. Verify by actually browsing with it on.
- **Contrast verified in both themes**, including ember-on-canvas and all hairlines.
- **Respect `prefers-contrast: more`** by promoting hairlines to `hairline-strong`.
- **Print stylesheet** produces a clean resume from any page.
- Zoom to 200% without horizontal scroll; `⌘K` has a visible button equivalent; every interactive element has an accessible name.

---

## 18. Wow moments

Five, in order of memorability:

1. **The cache short-circuit.** Watching a request stop at Redis and return — then toggling to a miss and watching it travel all the way to Mongo and back. It teaches something true in three seconds. This is what people will describe to a colleague.
2. **100× load.** Flip the toggle and the queue visibly backs up, workers saturate, p99 climbs. You've demonstrated understanding of backpressure without a paragraph about backpressure.
3. **`curl /api/leaderboard` in the console** returning a realistic JSON response with a timing header — then the same call again returning in 2ms from cache, with a `x-cache: HIT` header. Engineers will try it twice on purpose.
4. **The boot sequence** — services waking in dependency order. Sets the frame before a single word is read.
5. **Dependency tracing.** Click Redis, click BigQuery, watch the actual path light up through the queue and worker. The graph *knows* its own structure.

Each of these is a **demonstration**, not a decoration. That's the bar.

---

## 19. What puts this in the top 1%

Ranked by how rare they are:

1. **Incidents as postmortems.** Effectively nobody does this. It is the single strongest seniority signal available and it costs one component.
2. **A request journey you can parameterize.** Interactive systems teaching, not an animation.
3. **A console that actually executes.** Real commands, real history, real completion.
4. **Work reframed as services with SLAs and versions.** Changes the entire read of the page.
5. **Tradeoffs stated explicitly.** "I chose X and gave up Y" — vanishingly rare in portfolios.
6. **A topology that models relationships**, not a picture of logos.
7. **Real-ratio motion.** Sub-perceptual, but it's why it feels engineered rather than designed.
8. **Career as semver changelog.**
9. **Genuine keyboard-first navigation** with a `?` overlay.
10. **Accessibility as craft** — a canvas with a real text twin is a flex a Staff Engineer will notice.

The through-line: **every one of these is a way of showing engineering judgment rather than claiming it.** That's what separates a top-1% portfolio from a beautiful one.

---

## 20. Impact vs effort

Effort in focused days. Impact is 1–10 against the goal (5+ minutes of exploration, interview triggered).

### Build first — high impact, low effort
| # | Item | Impact | Effort | Why first |
|---|---|---|---|---|
| 1 | Rewrite hero: headline + 2 metrics above fold | 10 | 0.5 | Fixes the biggest single flaw. Half a day. |
| 2 | Incidents section (3 postmortems) | 10 | 1.5 | Rarest signal, pure content + one component |
| 3 | Un-hide the metrics; kill "the details" default | 9 | 0.5 | Your evidence becomes visible |
| 4 | Typography scale (display tier, 62ch, tabular-nums) | 8 | 1 | Lifts every screen at once |
| 5 | Spacing rhythm (three densities) | 7 | 0.5 | Rhythm from a token change |
| 6 | Status bar with live dot + availability | 7 | 0.5 | Answers the recruiter's question instantly |
| 7 | Colour discipline (ember = live, ≤2%) | 7 | 0.5 | Mostly deletion |
| 8 | Services reframing (versions, metrics visible) | 8 | 1 | Copy + layout, no new tech |

**Subtotal ≈ 6 days for the majority of the value.** Everything here is content and CSS.

### Build second — high impact, real effort
| # | Item | Impact | Effort |
|---|---|---|---|
| 9 | **Request journey** (desktop + vertical mobile) | 10 | 4 |
| 10 | Real console (execution, history, completion) | 8 | 3 |
| 11 | Interactive topology (focus, trace, filter, a11y twin) | 8 | 4 |
| 12 | Changelog | 6 | 1 |
| 13 | Deep links + `?` shortcuts overlay | 6 | 1 |
| 14 | `/resume` as a real printable route | 7 | 1 |
| 15 | Full a11y pass incl. canvas text twins | 7 | 2 |

### Build third — polish
| # | Item | Impact | Effort |
|---|---|---|---|
| 16 | Boot sequence | 6 | 2 |
| 17 | Real-ratio latency animations | 5 | 1 |
| 18 | Click-to-copy metrics | 4 | 0.5 |
| 19 | Log-stream texture in status bar | 4 | 1 |
| 20 | Demote desk to a contact-section moment | 5 | 0.5 |

### Explicitly not worth it
| Item | Why |
|---|---|
| GraphQL schema explorer | High effort, narrow audience, reads as filler |
| Zoomable multi-level architecture explorer | The focused topology delivers 80% at 30% of the cost |
| Sound design | High risk of feeling gimmicky; muted by default anyway |
| Live GitHub API integration | Rate limits, empty-state risk, breaks when you're heads-down |
| Full CI/CD pipeline animation | Doesn't represent *your* work — you're not a platform/DevOps engineer |
| Physics / cursor effects | Contradicts the entire design thesis |

---

## Recommended sequence

**Phase 1 (~1 week, content & type).** Items 1–8. No new dependencies, no 3D. The site would already be dramatically better and meaningfully differentiated. *If you only ever do one phase, do this one — it's where the impact-per-hour is highest by a wide margin.*

**Phase 2 (~2 weeks, the signature).** Item 9 first — the request journey is the thing people will remember and describe to others. Then the console and topology.

**Phase 3 (~1 week, polish).** Boot sequence, real-ratio motion, and the accessibility pass that makes the whole thing legitimate rather than decorative.

**The honest summary:** the current site's problem is not that it lacks 3D or animation. It's that **its structure is generic and its evidence is hidden.** Phase 1 is almost entirely content, hierarchy, and typography — and it fixes most of that. The 3D in Phase 2 is what makes it memorable, but it's amplifying a signal that Phase 1 has to establish first. Build in that order.
