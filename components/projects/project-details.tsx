"use client";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import type { Project } from "@/data/projects";
import { Translated, useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CloseProjectPage() {
  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/#projects">
        <X className="h-4 w-4" aria-hidden="true" />
        <Translated text="Close project details" />
      </Link>
    </Button>
  );
}

export function ProjectDetails({ project }: { project: Project }) {
  const { t } = useLanguage();
  return (
    <article>
      <p className="font-mono text-xs text-accent">
        <Translated text="Project details" />
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        <Translated text={project.title} />
      </h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        <Translated text={project.description} />
      </p>
      {project.releaseStatus && (
        <p className="mt-2 text-sm font-medium text-accent">
          <Translated text={project.releaseStatus} />
        </p>
      )}
      <ul className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li key={tech}>
            <Badge variant="indigo">{tech}</Badge>
          </li>
        ))}
      </ul>
      {project.preview && (
        <figure className="mt-8 overflow-hidden rounded-lg border border-border bg-slate-950">
          <Image
            src={project.preview.src}
            alt={t(project.preview.description)}
            width={1536}
            height={1024}
            sizes="(min-width: 1280px) 1120px, 92vw"
            className="h-auto w-full"
          />
          <figcaption className="border-t border-border bg-card px-4 py-3 text-xs text-muted-foreground">
            <Translated text="Concept preview · Fictional data" />
          </figcaption>
        </figure>
      )}
      <div className="mt-8 grid gap-6 sm:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {project.caseStudy && (
            <section>
              <h2 className="text-lg font-semibold"><Translated text="Problem" /></h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                <Translated text={project.caseStudy.problem} />
              </p>
            </section>
          )}
          <section>
            <h2 className="text-lg font-semibold">
              <Translated text={project.caseStudy ? "Workflow design" : "Technical design"} />
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              <Translated text={project.detail} />
            </p>
          </section>
        </div>
        <section className="rounded-lg border border-border bg-muted/30 p-5">
          <h2 className="text-lg font-semibold">
            <Translated text="Business objective" />
          </h2>
          <p className="mt-3 text-accent">
            <Translated text={project.metric} />
          </p>
          {project.caseStudy && (
            <>
              <h3 className="mt-5 text-sm font-semibold">
                <Translated text="How to measure impact" />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                <Translated text={project.caseStudy.measurement} />
              </p>
            </>
          )}
        </section>
      </div>
      {project.walkthrough && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">
            <Translated text="Offline sync walkthrough" />
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
            {project.walkthrough.steps.map((step) => (
              <li key={step}><Translated text={step} /></li>
            ))}
          </ol>
          <a className="mt-3 inline-block text-accent underline" href={project.walkthrough.href}>
            <Translated text="Read the SDK walkthrough" />
          </a>
        </section>
      )}
      {project.npmPackage && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">
            <Translated text="TypeScript SDK" />
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <Translated text="The TypeScript SDK connects to a running ReactiveCore API. It provides a React hook for React and Next.js and a Vue composable for Vue and Nuxt. Both integrations support live queries and share the same IndexedDB queue for offline writes." />
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <a href={project.npmPackage.href}>{project.npmPackage.name} · npm</a>
            </Button>
            <Button variant="outline" asChild>
              <a href={project.npmPackage.sourceHref}><Translated text="SDK source code" /></a>
            </Button>
          </div>
        </section>
      )}
      {project.backendRepositories && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold"><Translated text="Self-hosted backend" /></h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <Translated text="MultiDB continues the original PostgreSQL backend and adds preview support for MySQL." />
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.backendRepositories.map(({ label, href }) => (
              <li key={href}>
                <Button variant="outline" className="h-auto whitespace-normal py-2" asChild>
                  <a href={href}><Translated text={label} /></a>
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}
      <Button variant="accent" className="mt-8" asChild>
        {/* Document navigation avoids modal cleanup overriding the contact scroll. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/#contact">
          <Translated text="Discuss a similar project" />
        </a>
      </Button>
    </article>
  );
}
