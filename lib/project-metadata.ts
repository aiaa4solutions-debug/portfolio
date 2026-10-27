import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findProject, type Project } from "@/data/projects";
import { site, absoluteUrl } from "@/lib/seo";

export function metadataForProject(project: Project): Metadata {
  const image = {
    url: absoluteUrl(`${project.href}/opengraph-image`),
    width: 1200,
    height: 630,
    alt: project.title,
  };
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: project.href },
    openGraph: {
      type: "website",
      title: project.title,
      description: project.description,
      url: project.href,
      siteName: site.name,
      locale: "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [image.url],
    },
  };
}
export async function generateProjectMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const project = findProject((await params).slug);
  if (!project) notFound();
  return metadataForProject(project);
}
