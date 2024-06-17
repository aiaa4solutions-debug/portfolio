"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, FileDown } from "lucide-react";

import { Button } from "@/components/ui/button";

const TERMINAL_LINES = [
  { prompt: "whoami", output: "Herimalala Ranaivoarisoa Rivomanana" },
  { prompt: "role --current", output: "Full Stack Developer" },
  {
    prompt: "stack --core",
    output: "JavaScript · TypeScript · Python",
  },
  { prompt: "focus", output: "AI Integration & Workflow Automation" },
  { prompt: "location", output: "Antsirabe, Madagascar" },
];

function TerminalWindow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="relative w-full max-w-md rounded-lg border border-border bg-card shadow-xl"
    >
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">
          heri@portfolio — zsh
        </span>
      </div>
      <div className="space-y-2.5 p-5 font-mono text-[13px] leading-relaxed">
        {TERMINAL_LINES.map((line, i) => (
          <motion.div
            key={line.prompt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.35 }}
          >
            <div className="flex gap-2">
              <span className="text-accent">➜</span>
              <span className="text-indigo-400">{line.prompt}</span>
            </div>
            <p className="pl-5 text-muted-foreground">{line.output}</p>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 + TERMINAL_LINES.length * 0.35 }}
          className="flex gap-2 pt-1"
        >
          <span className="text-accent">➜</span>
          <span className="h-4 w-2 animate-blink bg-foreground/70" aria-hidden="true" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[92vh] items-center overflow-hidden pt-16"
    >
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[140px]" />

      <div className="container relative grid gap-12 py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 font-mono text-xs text-muted-foreground"
          >
            <MapPin className="h-3.5 w-3.5 text-accent" />
            Antsirabe, Madagascar — open to remote &amp; Antananarivo on-site
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Herimalala Ranaivoarisoa
            <br />
            <span className="gradient-text">Rivomanana</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 max-w-xl text-balance text-lg text-muted-foreground"
          >
            Full Stack Developer building fast, reliable products with{" "}
            <span className="text-foreground">JavaScript</span>,{" "}
            <span className="text-foreground">TypeScript</span> and{" "}
            <span className="text-foreground">Python</span> — and connecting
            them to AI where it removes real work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button size="lg" variant="accent" asChild>
              <Link href="#projects">
                View projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#contact">
                <FileDown className="h-4 w-4" />
                Get in touch
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <TerminalWindow />
        </div>
      </div>
    </section>
  );
}
