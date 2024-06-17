"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, MapPin, Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

const EMAIL = "ranaivoarisoa@gmx.fr";
const PHONE = "+261 34 94 032 47";
const LINKEDIN_URL = "https://linkedin.com/in/ranaivoarisoa";

export function Contact() {
  const [copied, setCopied] = React.useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden border-t border-border py-24">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="font-mono text-sm text-accent">{"// contact"}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Let&apos;s build something
          </h2>
          <p className="mt-4 text-muted-foreground">
            Open to freelance projects and full-time roles. The fastest way
            to reach me is email — I usually reply within a day.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-10 flex max-w-md flex-col gap-3"
        >
          <Button size="lg" variant="accent" asChild>
            <a href={`mailto:${EMAIL}`}>
              <Mail className="h-4 w-4" />
              {EMAIL}
            </a>
          </Button>

          <Button size="lg" variant="outline" onClick={copyEmail}>
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied to clipboard
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy email address
              </>
            )}
          </Button>

          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-indigo-500/40 hover:text-foreground"
            >
              <Phone className="h-4 w-4" />
              Call
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-indigo-500/40 hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <span className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Madagascar
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
