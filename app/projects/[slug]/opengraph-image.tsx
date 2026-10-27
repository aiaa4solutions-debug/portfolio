import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { findProject } from "@/data/projects";
import { SocialCard } from "@/components/seo/social-card";
export const alt = "Portfolio project — Herimalala Ranaivoarisoa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const project = findProject((await params).slug);
  if (!project) notFound();
  return new ImageResponse(
    <SocialCard title={project.title} subtitle={project.stack.join(" · ")} />,
    size,
  );
}
