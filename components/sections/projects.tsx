"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { projects } from "@/data/projects";
import { Badge } from "@/components/ui/badge";

export function Projects() {
  return (
    <section id="projects" className="border-t border-border bg-muted/30 py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="font-mono text-sm text-accent">{"// projects"}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Featured projects
          </h2>
          <p className="mt-4 text-muted-foreground">
            A selection of products built around automation, integration and
            applied AI.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 2) * 0.08 }}
              className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-indigo-500/40"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <ArrowUpRight
                  className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                {project.description}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {project.detail}
              </p>

              <div className="mt-auto pt-6">
                <p className="font-mono text-xs text-accent">
                  {project.metric}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <Badge key={tech} variant="indigo">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
