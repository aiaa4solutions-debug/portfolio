export interface SkillGroup {
  label: string;
  command: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    command: "languages --list",
    items: ["JavaScript", "TypeScript", "Python", "SQL"],
  },
  {
    label: "Frontend",
    command: "frontend --stack",
    items: ["React", "Next.js", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    label: "Backend",
    command: "backend --stack",
    items: ["Node.js", "Express.js", "NestJS", "FastAPI", "REST API", "GraphQL"],
  },
  {
    label: "Databases",
    command: "db --drivers",
    items: ["PostgreSQL", "MongoDB", "Prisma ORM"],
  },
  {
    label: "AI Integration",
    command: "ai --capabilities",
    items: ["OpenAI API", "Prompt Engineering", "Document Processing", "OCR"],
  },
  {
    label: "Automation",
    command: "automation --tools",
    items: ["n8n", "Webhooks", "API Integration", "CRM Automation"],
  },
  {
    label: "Tooling",
    command: "tooling --env",
    items: ["Git", "GitHub", "Docker", "GitHub Actions", "Vercel"],
  },
];
