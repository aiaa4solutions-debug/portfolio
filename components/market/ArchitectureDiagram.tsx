"use client";
import { Translated, useLanguage } from "@/components/language-provider";
const NODES = [
  {
    title: "Exchanges",
    detail: "Binance, Coinbase and Bitfinex over WebSocket",
  },
  {
    title: "Server hub",
    detail:
      "One shared connection per exchange, reconnection with backoff, USDT to USD conversion, simulation fallback",
  },
  {
    title: "SSE route",
    detail: "/api/metrics: backpressure, keep-alive, stats every second",
  },
  { title: "EventSource", detail: "Native reconnection, 50 ms buffer" },
  {
    title: "React",
    detail: "Table, curves (2 points per second), spread between exchanges",
  },
] as const;

export function ArchitectureDiagram() {
  const { t } = useLanguage();
  return (
    <ol
      aria-label={t("Data processing pipeline")}
      className="flex flex-col items-stretch gap-1 md:flex-row md:gap-0"
    >
      {NODES.map((node, index) => (
        <li
          key={node.title}
          className="flex flex-col items-stretch md:flex-1 md:flex-row md:items-center"
        >
          <div className="flex-1 rounded-lg border border-border bg-muted/40 p-3">
            <div className="text-sm font-semibold text-foreground">
              <Translated text={node.title} />
            </div>
            <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
              <Translated text={node.detail} />
            </div>
          </div>

          {index < NODES.length - 1 && (
            <span
              aria-hidden="true"
              className="self-center py-1 text-muted-foreground md:px-1.5 md:py-0"
            >
              <span className="md:hidden">↓</span>
              <span className="hidden md:inline">→</span>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
