"use client";
import { Translated, useLanguage } from "@/components/language-provider";

import {
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PAIRS, selectWindow, toCsv } from "@/lib/market/analytics";
import { SOURCES, type Source, type SourceStatus } from "@/lib/market/types";
import { cn } from "@/lib/utils";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import {
  formatLatency,
  formatPrice,
  formatQuantity,
  formatSigned,
  formatTime,
} from "./format";
import dynamic from "next/dynamic";
import type { ChartSeries } from "./LiveChart";
const LiveChart = dynamic(
  () => import("./LiveChart").then((module) => module.LiveChart),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[360px] animate-pulse rounded-lg bg-muted"
        role="status"
      >
        <span className="sr-only">
          <Translated text="Loading chart" />
        </span>
      </div>
    ),
  },
);
import { useMarketStream } from "./useMarketStream";

type View = "table" | "curves" | "spread";
type BadgeLabel = SourceStatus | "simulated";

const SOURCE_META: Record<
  Source,
  { label: string; pair: string; color: string }
> = {
  BINANCE: { label: "Binance", pair: "BTC/USDT", color: "#f59e0b" },
  COINBASE: { label: "Coinbase", pair: "BTC/USD", color: "#3b82f6" },
  BITFINEX: { label: "Bitfinex", pair: "BTC/USD", color: "#10b981" },
};

const SOURCE_TEXT: Record<Source, string> = {
  BINANCE: "text-amber-600 dark:text-amber-400",
  COINBASE: "text-blue-600 dark:text-blue-400",
  BITFINEX: "text-emerald-600 dark:text-emerald-400",
};

// 6 curves: buy (solid) and sell (dashed) for each exchange.
const PRICE_SERIES: ChartSeries[] = SOURCES.flatMap((source) => [
  {
    key: `${source}_BUY`,
    label: `${SOURCE_META[source].label} buy`,
    color: SOURCE_META[source].color,
  },
  {
    key: `${source}_SELL`,
    label: `${SOURCE_META[source].label} sell`,
    color: SOURCE_META[source].color,
    dash: "5 3",
  },
]);

const PAIR_COLORS = ["#a78bfa", "#f472b6", "#22d3ee"];
const SPREAD_SERIES: ChartSeries[] = PAIRS.map((pair, index) => ({
  key: pair.key,
  label: pair.label,
  color: PAIR_COLORS[index] ?? "#94a3b8",
}));

const TABS: { id: View; label: string }[] = [
  { id: "table", label: "Table" },
  { id: "curves", label: "Curves" },
  { id: "spread", label: "Spread" },
];

const WINDOWS = [
  { label: "30 seconds", ms: 30_000 },
  { label: "2 minutes", ms: 120_000 },
  { label: "10 minutes", ms: 600_000 },
];

const BADGE_STYLES: Record<BadgeLabel, string> = {
  live: "border-transparent bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  connecting: "border-transparent bg-muted text-muted-foreground",
  reconnecting:
    "border-transparent bg-amber-500/10 text-amber-700 dark:text-amber-300",
  offline: "border-transparent bg-red-500/10 text-red-700 dark:text-red-300",
  simulated:
    "border-transparent bg-violet-500/10 text-violet-700 dark:text-violet-300",
};

type BannerTone = "ok" | "neutral" | "warn" | "error" | "sim";
const BANNER_STYLES: Record<BannerTone, string> = {
  ok: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
  neutral: "border-border bg-muted/50 text-foreground",
  warn: "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200",
  error: "border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-200",
  sim: "border-violet-500/30 bg-violet-500/10 text-violet-800 dark:text-violet-200",
};

const CARD = "rounded-lg border border-border bg-card p-4";

function Metric({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className={CARD}>
      <dt className="text-xs text-muted-foreground">
        <Translated text={label} />
      </dt>
      <dd className="mt-1 font-mono text-lg font-semibold text-foreground">
        {value}
      </dd>
    </div>
  );
}

export default function RealTimeDashboard({
  className = "",
}: {
  className?: string;
}) {
  const [replay, setReplay] = useState(false);

  // `key`: switching mode starts from a clean state (history, buffers, connection).
  return (
    <Dashboard
      key={replay ? "replay" : "live"}
      replay={replay}
      onReplayChange={setReplay}
      className={className}
    />
  );
}

function Dashboard({
  replay,
  onReplayChange,
  className,
}: {
  replay: boolean;
  onReplayChange: (value: boolean) => void;
  className: string;
}) {
  const stream = useMarketStream(replay);
  const { t } = useLanguage();
  const uid = useId();

  const [view, setView] = useState<View>("table");
  const [windowMs, setWindowMs] = useState(120_000);
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const windowed = useMemo(
    () => selectWindow(stream.history, windowMs),
    [stream.history, windowMs],
  );

  const { stats } = stream;
  const simulatedByServer = stats?.mode === "simulated";

  const banner: { tone: BannerTone; text: string } = stream.outage
    ? {
        tone: "error",
        text: "Simulated outage: this page’s SSE connection is closed. It restarts automatically in a few seconds.",
      }
    : stream.connection === "offline"
      ? {
          tone: "error",
          text: "Connection to the server lost. Retrying with a growing delay.",
        }
      : stream.connection === "reconnecting"
        ? { tone: "warn", text: "Reconnecting to the feed." }
        : replay
          ? {
              tone: "sim",
              text: "Simulation mode: the server generates the data for this session, with no call to the exchanges.",
            }
          : simulatedByServer
            ? {
                tone: "sim",
                text: "Simulated feed: the exchanges are not answering, so the server switched to simulated data. Live data resumes as soon as an exchange is back.",
              }
            : stream.connection === "connecting"
              ? { tone: "neutral", text: "Connecting to the feed." }
              : {
                  tone: "ok",
                  text: "Live feed: real trades from Binance, Coinbase and Bitfinex.",
                };

  const sourceStats = SOURCES.map((source) => stats?.sources[source]);
  const totalEps = sourceStats.reduce(
    (sum, item) => sum + (item?.eventsPerSecond ?? 0),
    0,
  );
  const platformReconnects = sourceStats.reduce(
    (sum, item) => sum + (item?.reconnects ?? 0),
    0,
  );
  const latencies = sourceStats.flatMap((item) =>
    item && item.latencyMs !== null ? [item.latencyMs] : [],
  );
  const averageLatency =
    latencies.length > 0
      ? latencies.reduce((a, b) => a + b, 0) / latencies.length
      : null;

  const toggleSeries = (key: string) =>
    setHidden((previous) => ({ ...previous, [key]: !previous[key] }));

  const exportCsv = () => {
    const blob = new Blob([toCsv(stream.getFullHistory())], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");

    link.href = url;
    link.download = `btc-feed-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = TABS.findIndex((tab) => tab.id === view);
    let next = current;

    if (event.key === "ArrowRight") next = (current + 1) % TABS.length;
    else if (event.key === "ArrowLeft")
      next = (current - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;

    event.preventDefault();
    const tab = TABS[next];
    if (!tab) return;
    setView(tab.id);
    tabRefs.current[next]?.focus();
  };

  const spreadLine = (info: { spread: number; pct: number } | null) =>
    info ? `${formatPrice(info.spread)} USD (${info.pct.toFixed(3)}%)` : "—";

  const direction = (info: { high: Source; low: Source } | null) =>
    info
      ? `${SOURCE_META[info.high].label} ${t("is more expensive than")} ${SOURCE_META[info.low].label}`
      : t("Waiting for two exchanges");

  return (
    <section
      aria-label={t("Live BTC dashboard")}
      className={cn("space-y-6", className)}
    >
      <div
        role="status"
        aria-live="polite"
        data-testid="mode-banner"
        className={cn(
          "rounded-lg border px-4 py-2.5 text-sm",
          BANNER_STYLES[banner.tone],
        )}
      >
        <Translated text={banner.text} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {SOURCES.map((source) => {
          const meta = SOURCE_META[source];
          const trade = stream.latest[source];
          const item = stats?.sources[source];
          const badge: BadgeLabel =
            simulatedByServer || replay
              ? "simulated"
              : (item?.status ?? "connecting");

          return (
            <article key={source} className={CARD}>
              <div className="flex items-center justify-between gap-2">
                <h3
                  className={cn("text-sm font-semibold", SOURCE_TEXT[source])}
                >
                  {meta.label}{" "}
                  <span className="font-normal text-muted-foreground">
                    {meta.pair}
                  </span>
                </h3>
                <Badge className={BADGE_STYLES[badge]}>
                  <Translated text={badge} />
                </Badge>
              </div>

              <div className="mt-3 min-h-[3.25rem]">
                {trade ? (
                  <>
                    <div className="font-mono text-2xl font-bold text-foreground">
                      {formatPrice(trade.price)}{" "}
                      <span className="text-sm font-medium text-muted-foreground">
                        {trade.quote}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {trade.quote === "USDT" && trade.usdPrice !== null
                        ? `≈ ${formatPrice(trade.usdPrice)} USD`
                        : " "}
                    </div>
                  </>
                ) : (
                  <div
                    aria-hidden="true"
                    className="h-8 w-40 rounded bg-muted motion-safe:animate-pulse"
                  />
                )}
              </div>

              <p className="mt-3 font-mono text-xs text-muted-foreground">
                {item?.eventsPerSecond ?? 0} evt/s ·{" "}
                {formatLatency(item?.latencyMs ?? null)} ·{" "}
                {item?.reconnects ?? 0} <Translated text={"reconnect"} />
                {item?.reconnects === 1 ? "" : "s"}
              </p>
            </article>
          );
        })}
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <Metric label="Events per second" value={totalEps} />
        <Metric label="Average latency" value={formatLatency(averageLatency)} />
        <Metric label="Exchange reconnects" value={platformReconnects} />
        <Metric label="Client reconnects" value={stream.clientReconnects} />
        <Metric label="Dropped messages" value={stats?.dropped ?? 0} />
        <Metric
          label="Connected visitors"
          value={replay ? "—" : (stats?.subscribers ?? "—")}
        />
        <Metric
          label="USDT/USD rate"
          value={stats?.usdtUsd ? stats.usdtUsd.toFixed(4) : "—"}
        />
      </dl>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className={CARD}>
          <div className="text-xs text-muted-foreground">
            <Translated text={"Current spread between exchanges"} />
          </div>
          <div className="mt-1 font-mono text-lg font-semibold text-foreground">
            {spreadLine(stream.spreadNow)}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {direction(stream.spreadNow)}
          </div>
        </div>
        <div className={CARD}>
          <div className="text-xs text-muted-foreground">
            <Translated text={"Largest spread since opening"} />
          </div>
          <div className="mt-1 font-mono text-lg font-semibold text-foreground">
            {spreadLine(stream.sessionMax)}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {stream.sessionMax
              ? `${direction(stream.sessionMax)}, at ${formatTime(stream.sessionMax.t)}`
              : t("Waiting for two exchanges")}
          </div>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        <Translated
          text={
            "Price of the last trade on each exchange, with Binance converted to dollars using Coinbase's USDT/USD rate (Binance curves appear once that rate is known). Fees, order book depth and latency are not accounted for: this spread is not a usable arbitrage signal."
          }
        />
      </p>

      <div className={cn(CARD, "p-4 sm:p-6")}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label={t("Display mode")}
            onKeyDown={onTabKeyDown}
            className="inline-flex rounded-md bg-muted p-0.5 text-sm font-medium"
          >
            {TABS.map((tab, index) => (
              <button
                key={tab.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={`${uid}-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={view === tab.id}
                aria-controls={`${uid}-panel-${tab.id}`}
                tabIndex={view === tab.id ? 0 : -1}
                onClick={() => setView(tab.id)}
                className={cn(
                  "rounded px-3 py-1 transition-colors",
                  view === tab.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Translated text={tab.label} />
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              role="switch"
              aria-checked={replay}
              variant="outline"
              size="sm"
              onClick={() => onReplayChange(!replay)}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "relative h-4 w-7 rounded-full transition-colors",
                  replay ? "bg-primary" : "bg-muted-foreground/40",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all",
                    replay ? "left-3.5" : "left-0.5",
                  )}
                />
              </span>
              <Translated text={"Simulation"} />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={stream.simulateOutage}
              disabled={stream.outage}
            >
              <Translated text={"Simulate an outage"} />
            </Button>
          </div>
        </div>

        {view !== "table" && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <Translated text={"Window"} />
              <select
                value={windowMs}
                onChange={(event) => setWindowMs(Number(event.target.value))}
                className="h-9 rounded-md border border-border bg-card px-2 text-xs text-foreground"
              >
                {WINDOWS.map((option) => (
                  <option key={option.ms} value={option.ms}>
                    <Translated text={option.label} />
                  </option>
                ))}
              </select>
            </label>

            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-pressed={stream.paused}
              onClick={stream.togglePause}
            >
              {t(stream.paused ? "Resume curves" : "Pause curves")}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={exportCsv}
              disabled={stream.history.length === 0}
            >
              <Translated text={"Export CSV"} />
            </Button>
          </div>
        )}

        {TABS.map((tab) => (
          <div
            key={tab.id}
            id={`${uid}-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${tab.id}`}
            hidden={view !== tab.id}
          >
            {view === tab.id && tab.id === "table" && (
              <div
                role="region"
                aria-label={t("Latest trades")}
                tabIndex={0}
                className="h-80 overflow-y-auto rounded-lg bg-slate-950 p-3 font-mono text-xs text-slate-200 sm:h-96 sm:p-4"
              >
                {stream.trades.length === 0 && (
                  <div aria-hidden="true" className="space-y-2">
                    <p className="text-slate-500">
                      <Translated
                        text={"Subscribing to the exchange feeds..."}
                      />
                    </p>
                    {[0, 1, 2, 3, 4].map((row) => (
                      <div
                        key={row}
                        className="h-5 rounded bg-slate-900 motion-safe:animate-pulse"
                      />
                    ))}
                  </div>
                )}

                {[...stream.trades].reverse().map((trade) => (
                  <div
                    key={trade.key}
                    data-testid="trade-row"
                    className="flex items-center justify-between gap-2 border-b border-slate-900 px-1 py-1.5 hover:bg-slate-900/50"
                  >
                    <span className="hidden w-24 text-slate-500 sm:block">
                      {formatTime(trade.ts, true)}
                    </span>
                    <span
                      className={cn(
                        "w-20 font-extrabold sm:w-24",
                        trade.source === "BINANCE"
                          ? "text-amber-400"
                          : trade.source === "COINBASE"
                            ? "text-blue-400"
                            : "text-emerald-400",
                      )}
                    >
                      {trade.source}
                    </span>
                    <span className="flex-1 font-bold text-slate-100">
                      {formatPrice(trade.price)} {trade.quote}
                    </span>
                    <span className="hidden w-24 text-right text-slate-400 sm:block">
                      {formatQuantity(trade.quantity)} BTC
                    </span>
                    <span
                      className={cn(
                        "w-12 text-right font-bold",
                        trade.side === "SELL"
                          ? "text-red-400"
                          : "text-green-400",
                      )}
                    >
                      <Translated text={trade.side} />
                    </span>
                  </div>
                ))}
              </div>
            )}

            {view === tab.id && tab.id === "curves" && (
              <LiveChart
                data={windowed}
                series={PRICE_SERIES}
                hidden={hidden}
                onToggleSeries={toggleSeries}
                formatValue={formatPrice}
                ariaLabel={t(
                  "Buy and sell price curves per exchange, in dollars",
                )}
                footnote="Solid line: last buy trade. Dashed line: last sell trade. One point every 500 ms."
              />
            )}

            {view === tab.id && tab.id === "spread" && (
              <LiveChart
                data={windowed}
                series={SPREAD_SERIES}
                hidden={hidden}
                onToggleSeries={toggleSeries}
                formatValue={formatSigned}
                ariaLabel={t("Price spread between exchanges, in dollars")}
                yPad={1}
                yWidth={72}
                referenceY={0}
                footnote="Each curve is the price difference between two exchanges (first minus second). Above zero, the first one is more expensive."
              />
            )}
          </div>
        ))}

        <p className="mt-3 font-mono text-xs text-muted-foreground">
          {stream.totalCount}
          <Translated text={"events received"} />
        </p>
      </div>

      <details className={CARD}>
        <summary className="cursor-pointer text-sm font-semibold text-foreground">
          <Translated text={"Architecture and technical choices"} />
        </summary>
        <div className="mt-4 space-y-4">
          <ArchitectureDiagram />
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              <Translated
                text={
                  "SSE rather than WebSocket in the browser: the feed is one-way, and EventSource handles reconnection natively."
                }
              />
            </li>
            <li>
              <Translated
                text={
                  "One server connection per exchange, shared by every visitor, instead of three per visitor."
                }
              />
            </li>
            <li>
              <Translated
                text={
                  "50 ms buffer on the client: dozens of messages per second, but a single React render per batch."
                }
              />
            </li>
            <li>
              <Translated
                text={
                  "One curve point every 500 ms with the last known price carried forward, so the six lines stay continuous despite very different event rates."
                }
              />
            </li>
            <li>
              <Translated
                text={
                  "Backpressure: a slow client loses trades, which are counted in the metrics, instead of filling the server's memory."
                }
              />
            </li>
          </ul>
        </div>
      </details>

      <p className="text-xs text-muted-foreground">
        <Translated
          text={
            "Public data, shown as a technical demonstration. This is not financial advice."
          }
        />
      </p>
    </section>
  );
}
