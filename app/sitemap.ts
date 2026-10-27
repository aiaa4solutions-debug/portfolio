import { projects } from "@/data/projects";
import type { MetadataRoute } from "next";

const SITE_URL = "https://herimalala.netlify.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.flatMap((project) =>
      project.href
        ? [
            {
              url: `${SITE_URL}${project.href}`,
              lastModified: new Date(),
              changeFrequency: "monthly" as const,
              priority: 0.7,
            },
          ]
        : [],
    ),
  ];
}
