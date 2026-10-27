import type { Project } from "@/data/projects";
import { jsonLd, projectStructuredData } from "@/lib/seo";

export function ProjectStructuredData({ project }: { project: Project }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: jsonLd(projectStructuredData(project)),
      }}
    />
  );
}
