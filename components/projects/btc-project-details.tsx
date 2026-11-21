import { Translated } from "@/components/language-provider";
import { CloseProjectPage } from "@/components/projects/project-details";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CaseStudy } from "@/components/market/CaseStudy";
import RealTimeDashboard from "@/components/market/RealTimeDashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TECH = [
  "Next.js",
  "TypeScript",
  "WebSocket",
  "SSE",
  "Recharts",
  "Tailwind CSS",
];

export function BtcProjectDetails({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  return (
    <div className={embedded ? "pb-4" : "container pb-24 pt-28"}>
      {!embedded && <CloseProjectPage />}
      <Button variant="ghost" size="sm" className="-ml-3" asChild>
        <Link href="/#projects">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <Translated text={"Back to projects"} />
        </Link>
      </Button>

      <header className="mt-6 max-w-3xl">
        <p className="font-mono text-sm text-accent">{"// live demo"}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          <Translated text={"Real-Time BTC Multi-Exchange Feed"} />
        </h1>
        <p className="mt-4 text-muted-foreground">
          <Translated
            text={
              "Trades from Binance, Coinbase and Bitfinex arrive over WebSocket on the server, are relayed to this page over SSE, and are compared in dollars: live prices, buy and sell curves, and the spread between exchanges."
            }
          />
        </p>

        <ul className="mt-5 flex flex-wrap items-center gap-2">
          {TECH.map((tech) => (
            <li key={tech}>
              <Badge variant="indigo">{tech}</Badge>
            </li>
          ))}
        </ul>
      </header>

      <RealTimeDashboard className="mt-10" />
      <CaseStudy />
    </div>
  );
}
