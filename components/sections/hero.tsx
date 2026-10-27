import { Translated } from "@/components/language-provider";

import { ArrowRight, MapPin, MessageCircle } from "lucide-react";

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
    <div className="relative w-full max-w-md rounded-lg border border-border bg-card shadow-xl">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">
          heri@portfolio — zsh
        </span>
      </div>
      <div className="space-y-2.5 p-5 font-mono text-[13px] leading-relaxed">
        {TERMINAL_LINES.map((line) => (
          <div key={line.prompt}>
            <div className="flex gap-2">
              <span className="text-accent">➜</span>
              <span className="text-indigo-400">{line.prompt}</span>
            </div>
            <p className="pl-5 text-muted-foreground">
              <Translated text={line.output} />
            </p>
          </div>
        ))}
        <div className="flex gap-2 pt-1">
          <span className="text-accent">➜</span>
          <span
            className="h-4 w-2 animate-blink bg-foreground/70"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 font-mono text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            <Translated
              text={"Antsirabe, Madagascar — open to remote & on-site"}
            />
          </div>

          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Herimalala Ranaivoarisoa
            <br />
            <span className="gradient-text">Rivomanana</span>
          </h1>

          <p className="mt-5 max-w-xl text-balance text-lg text-muted-foreground">
            <Translated
              text={
                "Full Stack Developer building fast, reliable products with"
              }
            />{" "}
            <span className="text-foreground">JavaScript</span>,{" "}
            <span className="text-foreground">TypeScript</span>{" "}
            <Translated text={"and"} />{" "}
            <span className="text-foreground">Python</span>{" "}
            <Translated
              text={"— and connecting them to AI where it removes real work."}
            />
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" variant="accent" asChild>
              <a href="#projects">
                <Translated text={"View projects"} />
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#contact">
                <MessageCircle className="h-4 w-4" />
                <Translated text={"Get in touch"} />
              </a>
            </Button>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <TerminalWindow />
        </div>
      </div>
    </section>
  );
}
