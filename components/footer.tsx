import { Github, Linkedin } from "@/components/ui/brand-icons";
import { contact } from "@/lib/contact";

import { Translated } from "@/components/language-provider";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="container flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="font-mono text-xs text-muted-foreground">
          © {YEAR}{" "}
          <Translated
            text={"Herimalala Ranaivoarisoa Rivomanana. Built with Next.js."}
          />
        </p>

        <div className="flex items-center gap-4">
          <Link
            href={`mailto:${contact.email}`}
            aria-label="Email"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
          </Link>
          <Link
            href={contact.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
          </Link>
          <Link
            href={contact.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </Link>
          <a
            href={contact.whatsapp}
            aria-label="WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
