import { contact } from "@/lib/contact";
import type { Project } from "@/data/projects";

export const site = {
  url: "https://herimalala.netlify.app",
  name: "Herimalala Ranaivoarisoa",
  fullName: "Herimalala Ranaivoarisoa Rivomanana",
  title: "Herimalala Ranaivoarisoa | Full Stack Developer",
  description:
    "Full Stack developer in Madagascar. Explore web applications, AI document processing, workflow automation and real-time dashboards built with Next.js and Python.",
};
export const absoluteUrl = (path: string) => new URL(path, site.url).href;
export const jsonLd = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c");
export const person = {
  "@type": "Person",
  "@id": `${site.url}/#person`,
  name: site.fullName,
  jobTitle: "Full Stack Developer",
  url: site.url,
  email: contact.email,
  telephone: contact.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Antsirabe",
    addressCountry: "MG",
  },
  sameAs: [contact.linkedin, contact.github],
  knowsAbout: [
    "JavaScript",
    "TypeScript",
    "Python",
    "Next.js",
    "AI integration",
    "Workflow automation",
  ],
};
export function projectStructuredData(project: Project) {
  const url = absoluteUrl(project.href!);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#project`,
        name: project.title,
        description: project.description,
        url,
        creator: { "@id": `${site.url}/#person` },
        ...(project.preview || project.cover
          ? { image: absoluteUrl(project.preview?.src ?? project.cover!) }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: project.title, item: url },
        ],
      },
    ],
  };
}
