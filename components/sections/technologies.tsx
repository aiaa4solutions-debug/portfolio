import { Translated } from "@/components/language-provider";

const TECHNOLOGIES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Express.js",
  "NestJS",
  "FastAPI",
  "GraphQL",
  "WebSocket",
  "PostgreSQL",
  "MongoDB",
  "Prisma",
  "OpenAI API",
  "n8n",
  "Docker",
  "GitHub Actions",
  "Vitest",
  "Playwright",
  "Vercel",
  "Git",
];

export function Technologies() {
  return (
    <section id="technologies" className="border-t border-border py-24">
      <div className="container">
        <div className="reveal max-w-2xl">
          <p className="font-mono text-sm text-accent">{"// stack"}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            <Translated text={"Technologies I work with"} />
          </h2>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {TECHNOLOGIES.map((tech) => (
            <span
              key={tech}

              className="reveal rounded-md border border-border bg-card px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:border-indigo-500/40 hover:text-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
