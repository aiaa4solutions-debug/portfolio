export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  points: string[];
  stack: string[];
}

export const experience: Experience[] = [
  {
    role: "Full Stack Developer, Freelance",
    company: "Independent",
    location: "Remote",
    period: "May 2024 — Present",
    current: true,
    points: [
      "Building SaaS applications for multiple clients using Next.js, Node.js and PostgreSQL",
      "Designing REST APIs and integrating third-party services",
      "Building automated workflows with n8n to remove manual, repetitive work",
      "Integrating the OpenAI API into business applications",
      "Building document-processing tools in Python for extraction and analysis",
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "n8n", "OpenAI API", "Python"],
  },
  {
    role: "JavaScript / TypeScript Developer",
    company: "BDO IT Consulting",
    location: "Mauritius",
    period: "Jan 2024 — Nov 2024",
    points: [
      "Built enterprise applications with React and TypeScript",
      "Developed APIs with Express.js",
      "Worked with PostgreSQL across a microservices-oriented architecture",
      "Collaborated day-to-day with an international team",
      "Contributed to CI/CD pipelines",
    ],
    stack: ["React", "TypeScript", "Express.js", "PostgreSQL", "CI/CD"],
  },
  {
    role: "Frontend Developer",
    company: "RAPP IO",
    location: "Mauritius",
    period: "Jun 2023 — Dec 2023",
    points: [
      "Built React interfaces for client-facing products",
      "Developed features in TypeScript across the frontend codebase",
      "Integrated the ContentStack CMS",
      "Improved application performance and load times",
      "Built dashboards for internal and client reporting",
    ],
    stack: ["React", "TypeScript", "ContentStack", "Performance"],
  },
  {
    role: "Full Stack Developer",
    company: "La Solution Multitech",
    location: "Madagascar",
    period: "Aug 2016 — Aug 2023",
    points: [
      "Delivered custom web applications for business clients",
      "Built dashboards for operational and business data",
      "Developed frontend features with React",
      "Built and maintained backend services with Node.js",
      "Maintained and evolved applications across multiple long-running projects",
    ],
    stack: ["React", "Node.js", "JavaScript", "Dashboards"],
  },
];
