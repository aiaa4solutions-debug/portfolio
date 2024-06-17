import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="container flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="font-mono text-xs text-muted-foreground">
          © {YEAR} Herimalala Ranaivoarisoa Rivomanana. Built with Next.js.
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="mailto:ranaivoarisoa@gmx.fr"
            aria-label="Email"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
          </Link>
          <Link
            href="https://linkedin.com/in/ranaivoarisoa"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
