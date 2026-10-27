import { Translated } from "@/components/language-provider";

import { skillGroups } from "@/data/skills";
import { Badge } from "@/components/ui/badge";

export function Skills() {
  return (
    <section id="skills" className="border-t border-border bg-muted/30 py-24">
      <div className="container">
        <div className="reveal max-w-2xl">
          <p className="font-mono text-sm text-accent">{"// skills"}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            <Translated text={"Technical skills"} />
          </h2>
          <p className="mt-4 text-muted-foreground">
            <Translated
              text={
                "The languages, frameworks and tools I reach for day to day — grouped the way I'd group them in a terminal."
              }
            />
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div
              key={group.label}

              className="reveal rounded-lg border border-border bg-card p-5"
            >
              <p className="font-mono text-xs text-muted-foreground">
                <span className="text-accent">$</span> {group.command}
              </p>
              <h3 className="mt-2 text-sm font-semibold text-foreground">
                <Translated text={group.label} />
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Badge key={item} variant="indigo">
                    <Translated text={item} />
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
