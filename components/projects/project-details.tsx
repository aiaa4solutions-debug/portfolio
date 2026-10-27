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
        <section>
          <h2 className="text-lg font-semibold">
            <Translated text="Implementation" />
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            <Translated text={project.detail} />
          </p>
        </section>
        <section className="rounded-lg border border-border bg-muted/30 p-5">
          <h2 className="text-lg font-semibold">
            <Translated text="Outcome" />
          </h2>
          <p className="mt-3 text-accent">
            <Translated text={project.metric} />
          </p>
        </section>
      </div>
      <Button variant="accent" className="mt-8" asChild>
        <Link href="/#contact">
          <Translated text="Discuss a similar project" />
        </Link>
      </Button>
    </article>
  );
}
