"use client";

import { motion } from "framer-motion";

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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="font-mono text-sm text-accent">{"// stack"}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Technologies I work with
          </h2>
        </motion.div>

        <div className="mt-10 flex flex-wrap gap-3">
          {TECHNOLOGIES.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.3, delay: (i % 10) * 0.03 }}
              className="rounded-md border border-border bg-card px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:border-indigo-500/40 hover:text-foreground"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
