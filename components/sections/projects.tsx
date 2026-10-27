"use client";
import { Translated, useLanguage } from "@/components/language-provider";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProjectPreview } from "@/components/project-preview";

import { ArrowUpRight, Play, ArrowRight } from "lucide-react";

import { projects } from "@/data/projects";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Projects() {
  const { t } = useLanguage();
  return (
    <section id="projects" className="border-t border-border bg-muted/30 py-24">
      <div className="container">
        <div className="reveal max-w-2xl">
          <p className="font-mono text-sm text-accent">{"// projects"}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            <Translated text={"Featured projects"} />
          </h2>
          <p className="mt-4 text-muted-foreground">
            <Translated
              text={
                "A selection of products built around automation, integration and applied AI."
              }
            />
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.slug}

              className={
                "reveal " +
                cn(
                  "group relative flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-indigo-500/40",
                  project.featured && "md:col-span-2",
                )
              }
            >
              {project.cover && project.href && (
                <figure className="mb-6">
                  <Link
                    href={project.href}
                    scroll={false}
                    aria-label={t("Open the Bitcoin dashboard")}
                    className="group/btc relative block overflow-hidden rounded-lg border border-cyan-400/25 bg-slate-950 shadow-lg shadow-cyan-500/5"
                  >
                    <Image
                      src={project.cover}
                      alt={t(
                        "Bitcoin multi-exchange dashboard with price curves in simulation mode",
                      )}
                      width={1232}
                      height={628}
                      sizes="(min-width: 1280px) 1180px, 94vw"
                      className="aspect-[2/1] w-full object-cover object-top opacity-90 transition duration-300 group-hover/btc:scale-[1.01] group-hover/btc:opacity-100 motion-reduce:transition-none"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-slate-950/50 to-transparent">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/60 bg-cyan-400 text-slate-950 shadow-xl shadow-cyan-400/25 transition-transform group-hover/btc:scale-110">
                        <Play
                          className="ml-1 h-7 w-7"
                          fill="currentColor"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </Link>
                  <figcaption className="mt-2 font-mono text-[11px] text-muted-foreground">
                    <Translated text="Interface preview · Simulation mode" />
                  </figcaption>
                </figure>
              )}
              {project.preview && project.href && (
                <ProjectPreview
                  href={project.href}
                  src={project.preview.src}
                  title={project.title}
                  description={project.preview.description}
                />
              )}
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold">
                  {project.href ? (
                    <Link
                      href={project.href}
                      scroll={false}
                      className="transition-colors hover:text-accent"
                    >
                      <Translated text={project.title} />
                    </Link>
                  ) : (
                    <Translated text={project.title} />
                  )}
                </h3>
                {project.href && (
                  <ArrowUpRight
                    className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                    aria-hidden="true"
                  />
                )}
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                <Translated text={project.description} />
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                <Translated text={project.detail} />
              </p>

              {project.featured && project.href && (
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Button
                    variant="accent"
                    size="lg"
                    className="group/cta h-auto min-h-12 whitespace-normal rounded-lg px-6 py-3 font-semibold shadow-lg shadow-cyan-500/20"
                    asChild
                  >
                    <Link href={project.href} scroll={false}>
                      <Play
                        className="h-4 w-4 shrink-0"
                        fill="currentColor"
                        aria-hidden="true"
                      />
                      <Translated text="Explore the interactive demo" />
                      <ArrowRight
                        className="h-4 w-4 shrink-0 transition-transform group-hover/cta:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    <Translated text="3 exchanges · Curves · Price spreads" />
                  </span>
                </div>
              )}
              {!project.featured && project.href && (
                <Button variant="outline" className="mt-6 w-fit" asChild>
                  <Link href={project.href} scroll={false}>
                    <Translated text="View project details" />
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              )}
              <div className="mt-auto pt-6">
                <p className="font-mono text-xs text-accent">
                  <Translated text={project.metric} />
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <Badge key={tech} variant="indigo">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
