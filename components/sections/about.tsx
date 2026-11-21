import { Translated } from "@/components/language-provider";

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
      "I integrate AI into applications to help users process information and complete tasks.",
  },
];

export function About() {
  return (
    <section id="about" className="border-t border-border py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="reveal">
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              <Translated text={"Profile"} />
            </h2>
            <p className="mt-5 text-muted-foreground">
              <Translated
                text={
                  "I'm a full-stack developer working with JavaScript, TypeScript, and Python. I build web applications from user interfaces to APIs and backend services, including tools for real-time data and workflow automation."
                }
              />
            </p>
            <p className="mt-4 text-muted-foreground">
              <Translated
                text={
                  "In my freelance work, I help teams connect their tools, simplify workflows, and integrate AI where it serves a practical need. I’m open to freelance projects and full-time roles in full-stack development, integrations, and automation."
                }
              />
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {TRAITS.map((trait) => (
              <div
                key={trait.title}

                className="reveal rounded-lg border border-border bg-card p-6 sm:first:col-span-2"
              >
                <trait.icon className="h-5 w-5 text-indigo-400" />
                <h3 className="mt-4 font-medium">
                  <Translated text={trait.title} />
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  <Translated text={trait.description} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
