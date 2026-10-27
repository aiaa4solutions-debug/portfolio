import { notFound } from "next/navigation";
import { findProject } from "@/data/projects";
import { ProjectModal } from "@/components/projects/project-modal";
import { ProjectDetails } from "@/components/projects/project-details";
import { BtcProjectDetails } from "@/components/projects/btc-project-details";

export default async function InterceptedProject({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const project = findProject((await params).slug);
  if (!project?.href) notFound();
  return (
    <ProjectModal title={project.title} href={project.href}>
      {project.featured ? (
        <BtcProjectDetails embedded />
      ) : (
        <ProjectDetails project={project} />
      )}
    </ProjectModal>
  );
}

export { generateProjectMetadata as generateMetadata } from "@/lib/project-metadata";
