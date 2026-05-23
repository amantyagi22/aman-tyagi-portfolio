"use client";

import { MotionReveal } from "@/components/motion/MotionReveal";
import { PageFade } from "@/components/motion/PageFade";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const timeline = [
  {
    date: "2025–Present",
    company: "Delightree",
    role: "Senior Software Engineer",
    highlights: [
      "Optimized backend aggregation pipelines improving performance by 75%",
      "Built AI agent using LangChain and OpenAI",
      "Migrated notification systems to event-driven architecture",
      "Automated enterprise compliance workflows",
      "Integrated HubSpot, Intuit, Zapier systems",
      "Refactored legacy audit systems",
    ],
  },
  {
    date: "2024–2025",
    company: "Playo",
    role: "Software Engineer",
    highlights: [
      "Built high-performance leaderboard system",
      "Reduced Redis-backed latency from 4.5s to 50ms",
      "Optimized MongoDB Atlas Search with geospatial queries",
      "Migrated 600k+ chat users with zero downtime",
    ],
  },
  {
    date: "2023–2024",
    company: "Teal India",
    role: "Software Engineer",
    highlights: [
      "Built real-time analytics dashboard with Socket.io",
      "Developed legal automation systems generating 350+ reports daily",
    ],
  },
  {
    date: "2022–2023",
    company: "Recruit CRM",
    role: "DevOps Engineer Intern",
    highlights: ["DevOps and infrastructure internship"],
  },
  {
    date: "2022",
    company: "Duckcart",
    role: "Backend Lead Intern",
    highlights: ["Backend lead internship"],
  },
];

const skills = [
  {
    title: "Backend",
    items: ["Node.js", "TypeScript", "JavaScript", "Express", "GraphQL"],
  },
  {
    title: "Cloud & DevOps",
    items: ["AWS", "Docker", "Kubernetes", "Terraform"],
  },
  {
    title: "Databases",
    items: ["MongoDB", "Redis"],
  },
  {
    title: "AI & Automation",
    items: ["LangChain", "Python"],
  },
  {
    title: "Frontend",
    items: ["Next.js", "React", "Socket.io"],
  },
];

const projects = [
  {
    title: "Fluxline AI Automation",
    description:
      "Workflow engine that chains LLM tools, distributed workers, and audit logs to automate internal ops.",
    stack: ["Node.js", "LangChain", "Redis", "AWS"],
  },
  {
    title: "Compliance Grid",
    description:
      "Scalable audit and compliance engine with event-driven orchestration and immutable evidence trails.",
    stack: ["TypeScript", "MongoDB", "AWS", "Redis"],
  },
  {
    title: "SignalScope Analytics",
    description:
      "Real-time analytics platform streaming metrics via WebSockets with sub-second latency.",
    stack: ["Socket.io", "Redis", "Node.js", "Kubernetes"],
  },
  {
    title: "Distributed Leaderboards",
    description:
      "Geo-aware leaderboard architecture with sharded scoring and predictable cache invalidation.",
    stack: ["Redis", "GraphQL", "TypeScript", "AWS"],
  },
];

const writing = [
  "Redis caching strategies",
  "MongoDB aggregation optimization",
  "Scaling Socket.io systems",
  "Event-driven architectures in Node.js",
];

export default function Home() {
  return (
    <PageFade>
      <div className="relative min-h-screen bg-[var(--bg)] text-[var(--foreground)]">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-xs focus:font-medium focus:text-black"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold tracking-tight">Aman Tyagi</span>
              <span className="text-xs font-mono text-[var(--muted)]">Backend Engineer</span>
            </div>
            <nav className="hidden items-center gap-2 text-sm text-[var(--muted)] md:flex">
              {[
                "About",
                "Experience",
                "Skills",
                "Projects",
                "Writing",
                "Contact",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="rounded-full border border-[var(--border)] px-3 py-1 transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="hidden items-center gap-2 md:flex">
              <ThemeToggle />
              <CommandMenu
                items={[
                  { label: "About", href: "#about", description: "Summary" },
                  { label: "Experience", href: "#experience", description: "Timeline" },
                  { label: "Skills", href: "#skills", description: "Stack" },
                  { label: "Projects", href: "#projects", description: "Featured" },
                  { label: "Writing", href: "#writing", description: "Notes" },
                  { label: "Contact", href: "#contact", description: "Reach out" },
                ]}
              />
            </div>
          </div>
        </Container>
      </header>

      <main id="content" className="relative z-10">
        <section className="border-b border-white/5 pb-16 pt-20 md:pt-28">
          <Container>
            <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
              <MotionReveal>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-xs font-mono text-[var(--muted)]">
                    <span className="rounded-full border border-[var(--border)] px-3 py-1">
                      Available for backend consulting
                    </span>
                    <span>Based in India</span>
                  </div>
                  <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[var(--foreground)] md:text-5xl">
                    Aman Tyagi
                  </h1>
                  <p className="text-lg text-[var(--muted)] md:text-xl">
                    Backend Engineer
                  </p>
                  <p className="max-w-xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
                    I build scalable backend systems, performance-critical infrastructure,
                    and automation platforms using Node.js, distributed systems, and cloud
                    technologies.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <PrimaryButton href="#projects">View Projects</PrimaryButton>
                    <SecondaryButton href="#contact">Contact</SecondaryButton>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                    <a
                      href="https://github.com/amantyagi22"
                      className="flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                    >
                      GitHub
                    </a>
                    <a
                      href="https://www.linkedin.com/in/aman-tyagi-700a06190/"
                      className="flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="mailto:amantyagi2k@gmail.com"
                      className="flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </MotionReveal>
              <MotionReveal delay={0.1}>
                <div className="glass-card rounded-2xl p-6">
                  <div className="space-y-6">
                    <div>
                      <p className="section-kicker">Now</p>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        Designing resilient systems, optimizing latency, and building
                        automation layers that scale with enterprise demand.
                      </p>
                    </div>
                    <div>
                      <p className="section-kicker">Focus Areas</p>
                      <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                        <li>System design and distributed architecture</li>
                        <li>Performance engineering and caching strategy</li>
                        <li>Event-driven workflows and orchestration</li>
                      </ul>
                    </div>
                    <div className="border-t border-[var(--border)] pt-4 text-xs font-mono text-[var(--muted)]">
                      Last update: May 2026
                    </div>
                  </div>
                </div>
              </MotionReveal>
            </div>
          </Container>
        </section>

        <section id="about" className="py-16">
          <Container>
            <MotionReveal>
              <SectionHeader
                kicker="About"
                title="Focused on scalable, reliable backend systems"
                description="Backend engineer with 2+ years of experience across distributed workers, caching layers, MongoDB optimization, AI integrations, and cloud infrastructure. I care deeply about system design, performance engineering, and building architectures that stay predictable under load."
              />
            </MotionReveal>
          </Container>
        </section>

        <section id="experience" className="border-t border-[var(--border)] py-16">
          <Container>
            <MotionReveal>
              <SectionHeader
                kicker="Experience"
                title="Delivery across product, platform, and infrastructure"
                description="Engineering impact across high-growth product teams and platform modernization."
              />
            </MotionReveal>
            <div className="relative mt-10 space-y-6 pl-10">
              <div className="absolute left-3 top-0 h-full w-px bg-[var(--border)]" />
              {timeline.map((item) => (
                <MotionReveal key={item.company}>
                  <div className="group relative">
                    <span className="absolute left-[-1.75rem] top-6 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-[var(--border-strong)] bg-[var(--bg)] transition-all duration-200 group-hover:ring-2 group-hover:ring-white/30 group-hover:shadow-[0_0_12px_rgba(255,255,255,0.22)] dark:group-hover:ring-white/30" />
                    <div className="card rounded-2xl p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-[var(--foreground)]">
                            {item.company}
                          </h3>
                          <p className="text-sm text-[var(--muted)]">{item.role}</p>
                        </div>
                        <span className="text-xs font-mono text-[var(--muted)]">
                          {item.date}
                        </span>
                      </div>
                      <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                        {item.highlights.length > 0
                          ? item.highlights.map((highlight) => (
                              <li key={highlight} className="flex gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--muted)]" />
                                <span>{highlight}</span>
                              </li>
                            ))
                          : null}
                      </ul>
                    </div>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </Container>
        </section>

        <section id="skills" className="border-t border-[var(--border)] py-16">
          <Container>
            <MotionReveal>
              <SectionHeader
                kicker="Skills"
                title="Backend-centric stack with cloud depth"
                description="Focused on resilient services, real-time systems, and automation."
              />
            </MotionReveal>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {skills.map((group) => (
                <MotionReveal key={group.title}>
                  <div className="card rounded-2xl p-6">
                    <p className="text-sm font-mono text-[var(--muted)]">{group.title}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <Pill key={item}>{item}</Pill>
                      ))}
                    </div>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </Container>
        </section>

        <section id="projects" className="border-t border-[var(--border)] py-16">
          <Container>
            <MotionReveal>
              <SectionHeader
                kicker="Featured Projects"
                title="Systems built for speed and reliability"
                description="Selected work across automation, analytics, and distributed infrastructure."
              />
            </MotionReveal>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {projects.map((project) => (
                <MotionReveal key={project.title}>
                  <div className="card rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--foreground)]">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-sm text-[var(--muted)]">
                          {project.description}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-[var(--muted)]">Featured</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <Pill key={tech}>{tech}</Pill>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3 text-sm">
                      <a
                        href="https://github.com/amantyagi22"
                        className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                      >
                        GitHub
                      </a>
                      <a
                        href="#"
                        className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                      >
                        Demo
                      </a>
                    </div>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </Container>
        </section>

        <section id="writing" className="border-t border-[var(--border)] py-16">
          <Container>
            <MotionReveal>
              <SectionHeader
                kicker="Writing"
                title="Notes on backend systems"
                description="Upcoming deep dives on performance engineering and scalable architecture."
              />
            </MotionReveal>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {writing.map((topic) => (
                <MotionReveal key={topic}>
                  <div className="card rounded-2xl p-5">
                    <p className="text-sm font-mono text-[var(--muted)]">In progress</p>
                    <h3 className="mt-2 text-base font-semibold text-[var(--foreground)]">
                      {topic}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Drafting a focused technical note on real-world constraints and
                      production trade-offs.
                    </p>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </Container>
        </section>

        <section id="contact" className="border-t border-[var(--border)] py-16">
          <Container>
            <MotionReveal>
              <SectionHeader
                kicker="Contact"
                title="Let's build something scalable."
                description="Open to collaborations, advisory work, and backend architecture engagements."
              />
              <div className="mt-8">
                <PrimaryButton href="mailto:amantyagi2k@gmail.com">
                  Email Aman
                </PrimaryButton>
              </div>
            </MotionReveal>
          </Container>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-8 text-center text-xs text-[var(--muted)]">
        <Container>
          <p>Designed for clarity, engineered for scale.</p>
        </Container>
      </footer>
      </div>
    </PageFade>
  );
}
