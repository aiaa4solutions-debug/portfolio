import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findProject } from "@/data/projects";

export async function generateProjectMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const project = findProject((await params).slug);
  if (!project) notFound();
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: project.href },
  };
}
