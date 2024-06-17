"use client";

import { motion } from "framer-motion";
import { Sparkles, Workflow, Search } from "lucide-react";

const TRAITS = [
  {
    icon: Search,
    title: "Curious by default",
    description:
      "I dig into how things work rather than stopping at the first solution that compiles.",
  },
  {
    icon: Workflow,
    title: "Process-minded",
    description:
      "I look for the repetitive step in a workflow and build the thing that removes it.",
  },
  {
    icon: Sparkles,
    title: "AI-forward",
    description:
      "I bring OpenAI's API into real products — document processing, automation, assistants.",
  },
];

export function About() {
  return (
    <section id="about" className="border-t border-border py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Profile
            </h2>
            <p className="mt-5 text-muted-foreground">
              I&apos;m a Full Stack Developer specializing in modern web
              applications built with JavaScript, TypeScript and Python. I
              like designing applications that perform well, building APIs,
              and automating processes that make work simpler for the people
              using them.
            </p>
            <p className="mt-4 text-muted-foreground">
              Over the past several months I&apos;ve been building solutions
              that integrate AI — using the OpenAI API, document processing
              and automated workflows to turn manual tasks into systems that
              run themselves. I&apos;m looking for a team where I can keep
              learning and contribute to work that matters.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {TRAITS.map((trait, i) => (
              <motion.div
                key={trait.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-lg border border-border bg-card p-6 sm:first:col-span-2"
              >
                <trait.icon className="h-5 w-5 text-indigo-400" />
                <h3 className="mt-4 font-medium">{trait.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {trait.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
