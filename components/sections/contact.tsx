"use client";
import { Linkedin, Github } from "@/components/ui/brand-icons";
import { Translated } from "@/components/language-provider";

import * as React from "react";

import {
  Mail,
  Phone,
  MapPin,
  Check,
  Copy,
  MessageCircle,
  CalendarDays,
} from "lucide-react";

import { contact, meetingEmail } from "@/lib/contact";
import { Button } from "@/components/ui/button";

const EMAIL = contact.email;
const PHONE = contact.phone;
const LINKEDIN_URL = contact.linkedin;

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
    <section
      id="contact"
      className="relative overflow-hidden border-t border-border py-24"
    >
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="container relative">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="font-mono text-sm text-accent">{"// contact"}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            <Translated text={"Let's build something"} />
          </h2>
          <p className="mt-4 text-muted-foreground">
            <Translated
              text={
                "Open to freelance projects and full-time roles. The fastest way to reach me is email — I usually reply within a day."
              }
            />
          </p>
        </div>

        <div className="reveal mx-auto mt-10 flex max-w-md flex-col gap-3">
          <Button size="lg" variant="accent" asChild>
            <a href={`mailto:${EMAIL}`}>
              <Mail className="h-4 w-4 shrink-0" />
              {EMAIL}
            </a>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-emerald-500/40 hover:bg-emerald-500/10"
            asChild
          >
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4 shrink-0" /> WhatsApp · +261 34
              94 032 47
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a
              href={contact.calendly || meetingEmail}
              target={contact.calendly ? "_blank" : undefined}
              rel={contact.calendly ? "noopener noreferrer" : undefined}
            >
              <CalendarDays className="h-4 w-4 shrink-0" />
              <Translated
                text={
                  contact.calendly
                    ? "Book a meeting"
                    : "Request a meeting by email"
                }
              />
            </a>
          </Button>

          <Button size="lg" variant="outline" onClick={copyEmail}>
            {copied ? (
              <>
                <Check className="h-4 w-4 shrink-0" />
                <Translated text={"Copied to clipboard"} />
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 shrink-0" />
                <Translated text={"Copy email address"} />
              </>
            )}
          </Button>

          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-indigo-500/40 hover:text-foreground"
            >
              <Phone className="h-4 w-4 shrink-0" />
              <Translated text={"Call"} />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-indigo-500/40 hover:text-foreground"
            >
              <Linkedin className="h-4 w-4 shrink-0" />
              LinkedIn
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-4 w-4 shrink-0" /> GitHub
            </a>
            <span className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              Madagascar
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
