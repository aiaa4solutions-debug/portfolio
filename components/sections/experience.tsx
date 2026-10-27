"use client";
import { Translated } from "@/components/language-provider";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

import { experience } from "@/data/experience";
import { Badge } from "@/components/ui/badge";

export function Experience() {
  return (
    <section id="experience" className="border-t border-border py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="font-mono text-sm text-accent">{"// experience"}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            <Translated text={"Where I've worked"} />
          </h2>
          <p className="mt-4 text-muted-foreground">
            <Translated
              text={
                "Roughly eight years across freelance, agency and consulting work, from frontend interfaces to full backend systems."
              }
            />
          </p>
        </motion.div>

        <ol className="relative mt-14 space-y-10 border-l border-border pl-8 sm:pl-10">
          {experience.map((job, i) => (
            <motion.li
              key={job.role + job.period}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="relative"
            >
              <span
                className={`absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full sm:-left-[calc(2.5rem+5px)] ${
                  job.current ? "bg-accent" : "bg-muted-foreground/40"
                }`}
                aria-hidden="true"
              />

              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold">
                  <Translated text={job.role} />
                </h3>
                <span className="font-mono text-xs text-muted-foreground">
                  <Translated text={job.period} />
                </span>
              </div>

              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  <Translated text={job.company} />
                </span>
                <span aria-hidden="true">·</span>
                <MapPin className="h-3.5 w-3.5" />
                <Translated text={job.location} />
                {job.current && (
                  <Badge variant="accent" className="ml-2">
                    <Translated text={"Current"} />
                  </Badge>
                )}
              </div>

              <ul className="mt-4 space-y-1.5">
                {job.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                    <Translated text={point} />
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.stack.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
