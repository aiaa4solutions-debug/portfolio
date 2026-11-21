export interface Project {
  slug: string;
  title: string;
  description: string;
  detail: string;
  stack: string[];
  metric: string;
  caseStudy?: { problem: string; measurement: string };
  releaseStatus?: string;
  fullWidth?: boolean;
  walkthrough?: { steps: string[]; href: string };
  repositories?: { label: string; href: string }[];
  cover?: string;
  preview?: { src: string; description: string };
  /** Internal page of the project, when it has a live demo. */
  href?: string;
  /** Rendered full width, above the other cards. */
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "ai-document-assistant",
    href: "/projects/ai-document-assistant",
    preview: {
      src: "/images/projects/ai-document-assistant-preview.png",
      description:
        "Demo interface showing an invoice, OCR regions and structured extracted fields.",
    },
    title: "AI Document Assistant",
    description:
      "Extracts structured information from documents automatically using OCR and the OpenAI API.",
    detail:
      "The concept uses a Python service to read scanned or digital documents, recover the text with OCR and structure selected fields with the OpenAI API.",
    stack: ["Python", "FastAPI", "OpenAI API", "OCR"],
    metric: "Reduce manual data entry",
  },
  {
    slug: "workflow-automation",
    href: "/projects/workflow-automation",
    preview: {
      src: "/images/projects/workflow-automation-preview.png",
      description:
        "Demo workflow showing a webhook, API validation, PostgreSQL and automated notifications.",
    },
    title: "Workflow Automation",
    description:
      "An n8n workflow concept for synchronizing data and sending notifications across tools.",
    detail:
      "The workflow design uses a webhook to start the process, validates incoming data through an API, stores it in PostgreSQL and sends a notification.",
    stack: ["n8n", "Node.js", "PostgreSQL", "REST API"],
    metric: "Reduce manual handoffs",
    caseStudy: {
      problem: "Passing data between tools by hand adds repetitive work and delays notifications.",
      measurement: "Compare the time per run with and without the workflow, including time spent monitoring runs and correcting errors.",
    },
  },
  {
    slug: "reactivecore",
    href: "/projects/reactivecore",
    title: "ReactiveCore — Real-time backend and offline sync",
    description:
      "A self-hosted backend that streams updates to apps and lets them queue changes when the connection drops.",
    detail:
      "The backend commits changes in PostgreSQL transactions and uses an outbox worker to refresh subscriptions over Server-Sent Events. The TypeScript SDK persists pending writes in IndexedDB and retries with the original operation key so a retried write is applied only once.",
    stack: ["TypeScript", "NestJS", "PostgreSQL", "Redis", "SSE", "IndexedDB"],
    metric: "Keep applications usable during network interruptions",
    releaseStatus: "Alpha release · MySQL in preview",
    fullWidth: true,
    walkthrough: {
      steps: [
        "Go offline and create two items. The SDK saves both operations in IndexedDB.",
        "Cancel one operation while it is still pending.",
        "Reconnect. The remaining item appears once in the live list. The cancelled item stays out of the server list.",
      ],
      href: "https://github.com/herimalala-ranaivoarisoa-rivomanana/reactivecore-sdk#6-queue-and-cancel-an-offline-mutation",
    },
    repositories: [
      {
        label: "Backend source · MultiDB",
        href: "https://github.com/herimalala-ranaivoarisoa-rivomanana/reactivecore-multidb",
      },
      {
        label: "TypeScript SDK",
        href: "https://github.com/herimalala-ranaivoarisoa-rivomanana/reactivecore-sdk",
      },
      {
        label: "Original PostgreSQL release",
        href: "https://github.com/herimalala-ranaivoarisoa-rivomanana/reactivecore",
      },
    ],
  },
  {
    slug: "crm-automation-platform",
    href: "/projects/crm-automation-platform",
    preview: {
      src: "/images/projects/crm-automation-platform-preview.png",
      description:
        "Demo sales pipeline with lead cards, follow-up tasks and customer activity.",
    },
    title: "CRM Automation Platform",
    description:
      "A sales management platform that connects several APIs and automates the surrounding workflows.",
    detail:
      "The concept uses Next.js, TypeScript and PostgreSQL to model customer records, reminders, status updates and integrations.",
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    metric: "Centralize customer data",
  },
  {
    slug: "marketing-dashboard",
    href: "/projects/marketing-dashboard",
    preview: {
      src: "/images/projects/marketing-dashboard-preview.png",
      description:
        "Demo marketing dashboard with campaign trends, channel metrics and performance comparison.",
    },
    title: "Marketing Dashboard",
    description:
      "A dashboard for automated tracking of marketing campaigns across platforms.",
    detail:
      "The concept uses React and TypeScript to show how Facebook and Google Ads campaign data could be compared in one dashboard.",
    stack: ["React", "TypeScript", "Facebook API", "Google Ads API"],
    metric: "Bring campaign data into one view",
  },
  {
    slug: "btc-realtime-feed",
    cover: "/images/projects/btc-realtime.png",
    title: "Real-Time BTC Multi-Exchange Feed",
    description:
      "A live dashboard comparing Bitcoin trades from Binance, Coinbase and Bitfinex, with price curves and the spread between exchanges.",
    detail:
      "A shared server hub keeps one resilient WebSocket connection per exchange and relays normalized trades over Server-Sent Events to a React dashboard. It converts USDT prices to USD, tracks the spread between exchanges, falls back to simulated data when the exchanges are unreachable, and exposes per-exchange status, latency and reconnection metrics.",
    stack: ["Next.js", "TypeScript", "WebSocket", "SSE", "Recharts"],
    metric: "3 exchanges · live demo",
    href: "/projects/btc-realtime",
    featured: true,
  },
];

export function findProject(routeSlug: string) {
  return projects.find((project) => project.href === `/projects/${routeSlug}`);
}
