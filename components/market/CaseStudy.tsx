"use client";

import { Translated } from "@/components/language-provider";
const SECTIONS = [
  {
    title: "Problem",
    body: "Compare three exchanges live when they use different message formats, different quote currencies (USDT versus USD) and different conventions for the direction of a trade.",
  },
  {
    title: "Solution",
    body: "A server hub normalizes the three feeds, converts prices to dollars and relays them over SSE. The client batches messages, samples the curves and computes the spreads.",
  },
  {
    title: "Challenges",
    body: "Reconnecting upstream sockets without losing the other exchanges (the Bitfinex channel id changes on every connection), keeping the chart tooltip consistent while the window slides, staying useful when exchanges are unreachable, and reading the trade side correctly: Coinbase reports the maker side, not the aggressor.",
  },
  {
    title: "Connection lifecycle",
    body: "Within each server instance, visitors share one upstream WebSocket per exchange. The hub starts with the first subscriber and stops 15 seconds after the last subscriber leaves. Failed connections retry with exponential backoff and jitter, capped at 30 seconds.",
  },
  {
    title: "Load and memory",
    body: "Each SSE connection buffers up to 1,000 messages before dropping new trades for slow clients and counting the drops. Disconnecting releases subscriptions and timers. This demo has not been load-tested to establish a concurrent visitor capacity.",
  },
  {
    title: "Result",
    body: "A demo that stays usable offline, covered by unit and end-to-end tests, with visible metrics (latency, reconnects, dropped messages) that show how the system really behaves.",
  },
] as const;

export function CaseStudy() {
  return (
    <section aria-labelledby="case-study-title" className="mt-16">
      <p className="font-mono text-sm text-accent">{"// case study"}</p>
      <h2
        id="case-study-title"
        className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        <Translated text={"How it was built"} />
      </h2>

      <dl className="mt-8 grid gap-6 md:grid-cols-2">
        {SECTIONS.map((section) => (
          <div
            key={section.title}
            className="rounded-lg border border-border bg-card p-6"
          >
            <dt className="text-base font-semibold text-foreground">
              <Translated text={section.title} />
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
              <Translated text={section.body} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
