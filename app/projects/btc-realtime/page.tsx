import { BtcProjectDetails } from "@/components/projects/btc-project-details";
import { ProjectStructuredData } from "@/components/seo/project-structured-data";
import { findProject } from "@/data/projects";
import { metadataForProject } from "@/lib/project-metadata";

const project = findProject("btc-realtime")!;
export const metadata = metadataForProject(project);
export default function BtcRealtimePage() {
  return (
    <>
      <ProjectStructuredData project={project} />
      <BtcProjectDetails />
    </>
  );
}
