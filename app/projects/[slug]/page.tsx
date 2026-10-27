import { ProjectStructuredData } from "@/components/seo/project-structured-data";
import { notFound } from "next/navigation";
import { findProject, projects } from "@/data/projects";
import {
  CloseProjectPage,
  ProjectDetails,
} from "@/components/projects/project-details";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return projects
    .filter((project) => project.preview)
    .map((project) => ({ slug: project.slug }));
}
export { generateProjectMetadata as generateMetadata } from "@/lib/project-metadata";
export default async function ProjectPage({ params }: Props) {
  const project = findProject((await params).slug);
  if (!project) notFound();
  return (
    <div className="container pb-20 pt-24">
      <ProjectStructuredData project={project} />
      <div className="mb-6">
        <CloseProjectPage />
      </div>
      <ProjectDetails project={project} />
    </div>
  );
}
