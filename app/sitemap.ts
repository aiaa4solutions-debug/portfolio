import { site } from "@/lib/seo";
import { projects } from "@/data/projects";
import type { MetadataRoute } from "next";

const SITE_URL = site.url;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.flatMap((project) =>
      project.href
        ? [
            {
              url: `${SITE_URL}${project.href}`,
              changeFrequency: "monthly" as const,
              priority: 0.7,
            },
          ]
        : [],
    ),
  ];
}
