export interface Project {
  slug: string;
  title: string;
  description: string;
  detail: string;
  stack: string[];
  metric: string;
  /** Internal page of the project, when it has a live demo. */
  href?: string;
  /** Rendered full width, above the other cards. */
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "btc-realtime-feed",
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
  {
    slug: "ai-document-assistant",
    title: "AI Document Assistant",
    description:
      "Extracts structured information from documents automatically using OCR and the OpenAI API.",
    detail:
      "A Python service that ingests scanned or digital documents, runs OCR to recover text, then uses the OpenAI API to identify and structure the relevant fields — turning unstructured paperwork into usable data with no manual entry.",
    stack: ["Python", "FastAPI", "OpenAI API", "OCR"],
    metric: "Removes manual data entry",
  },
  {
    slug: "workflow-automation",
    title: "Workflow Automation",
    description:
      "Automated workflows that cut manual tasks and streamline business processes end to end.",
    detail:
      "A set of n8n workflows connected to internal APIs and a PostgreSQL data layer, replacing manual handoffs between tools with triggers that run automatically — from data sync to notifications and reporting.",
    stack: ["n8n", "Node.js", "PostgreSQL", "REST API"],
    metric: "Fewer manual handoffs",
  },
  {
    slug: "crm-automation-platform",
    title: "CRM Automation Platform",
    description:
      "A sales management platform that connects several APIs and automates the surrounding workflows.",
    detail:
      "A Next.js and TypeScript application backed by PostgreSQL, built to centralize customer data and automate the follow-up work — reminders, status updates and integrations — that used to happen manually.",
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    metric: "Centralized customer data",
  },
  {
    slug: "marketing-dashboard",
    title: "Marketing Dashboard",
    description:
      "A dashboard for automated tracking of marketing campaigns across platforms.",
    detail:
      "A React and TypeScript dashboard that pulls campaign data from the Facebook and Google Ads APIs into one view, replacing manual exports with live, comparable metrics.",
    stack: ["React", "TypeScript", "Facebook API", "Google Ads API"],
    metric: "One view across platforms",
  },
];
