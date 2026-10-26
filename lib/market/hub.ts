/**
 * Server hub: a single WebSocket connection per exchange, shared by every visitor
 * (instead of three connections per visitor). Import from server code only.
 *
 * - reconnection with exponential backoff and jitter
 * - starts on the first subscriber, stops after an idle period
 * - USDT/USD rate read from Coinbase to convert Binance prices to dollars
 * - automatic fallback to simulated data when no exchange answers
 */
import {
  parseBinanceTrade,
  parseBitfinexMessage,
  parseCoinbaseMessage,
  toUsdPrice,
} from './parsers';
import { startSimulator } from './simulator';
import {
  SOURCES,
  type MarketMode,
  type ParsedTrade,
  type Source,
  type SourceStats,
  type SourceStatus,
  type StatsMessage,
  type Trade,
} from './types';

const UPSTREAM_URLS: Record<Source, string> = {
  BINANCE: process.env.BINANCE_WS_URL ?? 'wss://stream.binance.com:9443/ws/btcusdt@trade',
  COINBASE: 'wss://ws-feed.exchange.coinbase.com',
  BITFINEX: 'wss://api-pub.bitfinex.com/ws/2',
};

const MAX_BACKOFF_MS = 30_000;
const IDLE_STOP_MS = 15_000;
const FALLBACK_AFTER_MS = 10_000;
const LATENCY_SAMPLES = 50;

type Listener = (trade: Trade) => void;

interface Upstream {
  status: SourceStatus;
  reconnects: number;
  attempt: number;
  counter: number;
  eventsPerSecond: number;
  latencies: number[];
  ws: WebSocket | null;
  timer: ReturnType<typeof setTimeout> | null;
}

const createUpstream = (): Upstream => ({
  status: 'offline',
  reconnects: 0,
  attempt: 0,
  counter: 0,
  eventsPerSecond: 0,
  latencies: [],
  ws: null,
  timer: null,
});

const average = (values: number[]): number | null =>
  values.length === 0
    ? null
    : Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);

function readConfiguredMode(): MarketMode {
  const raw = process.env.MARKET_MODE;
  return raw === 'live' || raw === 'replay' ? raw : 'auto';
}

export class MarketHub {
  private readonly listeners = new Set<Listener>();
  private readonly upstreams: Record<Source, Upstream> = {
    BINANCE: createUpstream(),
    COINBASE: createUpstream(),
    BITFINEX: createUpstream(),
  };
  private readonly mode: MarketMode;

  private usdtUsd: number | null = null;
  private running = false;
  private startedAt = 0;
  private lastRealTradeAt = 0;
  private bitfinexChannel: number | null = null;
  private stopSimulator: (() => void) | null = null;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private statsTimer: ReturnType<typeof setInterval> | null = null;
  private fallbackTimer: ReturnType<typeof setInterval> | null = null;

  constructor(mode: MarketMode = readConfiguredMode()) {
    this.mode = mode;
  }

  /** Subscribes a listener and returns the unsubscribe function. */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);

    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    if (!this.running) this.start();

    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0 && !this.idleTimer) {
        this.idleTimer = setTimeout(() => {
          this.idleTimer = null;
          if (this.listeners.size === 0) this.stop();
        }, IDLE_STOP_MS);
      }
    };
  }

  getStats(dropped = 0): StatsMessage {
    const simulated = this.stopSimulator !== null;
    const sources = {} as Record<Source, SourceStats>;

    for (const source of SOURCES) {
      const upstream = this.upstreams[source];
      sources[source] = {
        status: upstream.status,
        eventsPerSecond: upstream.eventsPerSecond,
        latencyMs: simulated ? null : average(upstream.latencies),
        reconnects: upstream.reconnects,
      };
    }

    return {
      mode: simulated ? 'simulated' : 'live',
      sources,
      usdtUsd: this.usdtUsd,
      subscribers: this.listeners.size,
      dropped,
      serverTime: Date.now(),
    };
  }

  /** Immediate stop (used by the per-connection hubs of the simulation mode). */
  dispose(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    this.listeners.clear();
    this.stop();
  }

  private start(): void {
    this.running = true;
    this.startedAt = Date.now();
    this.lastRealTradeAt = 0;
    this.statsTimer = setInterval(() => this.tickStats(), 1000);

    if (this.mode === 'replay') {
      this.beginSimulation();
      return;
    }

    for (const source of SOURCES) this.connect(source);

    if (this.mode === 'auto') {
      this.fallbackTimer = setInterval(() => {
        const reference = this.lastRealTradeAt || this.startedAt;
        if (!this.stopSimulator && Date.now() - reference > FALLBACK_AFTER_MS) {
          this.beginSimulation();
        }
      }, 2000);
    }
  }

  private stop(): void {
    this.running = false;

    if (this.statsTimer) clearInterval(this.statsTimer);
    if (this.fallbackTimer) clearInterval(this.fallbackTimer);
    this.statsTimer = null;
    this.fallbackTimer = null;

    this.endSimulation();

    for (const source of SOURCES) {
      const upstream = this.upstreams[source];
      if (upstream.timer) clearTimeout(upstream.timer);
      upstream.timer = null;

      if (upstream.ws) this.detach(upstream.ws);
      upstream.ws = null;

      upstream.status = 'offline';
      upstream.attempt = 0;
      upstream.counter = 0;
      upstream.eventsPerSecond = 0;
      upstream.latencies = [];
    }
    this.bitfinexChannel = null;
  }

  private detach(ws: WebSocket): void {
    ws.onopen = null;
    ws.onmessage = null;
    ws.onerror = null;
    ws.onclose = null;

    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  }

  private connect(source: Source): void {
    if (!this.running) return;

    const upstream = this.upstreams[source];
    upstream.status =
      upstream.reconnects === 0 && upstream.attempt === 0 ? 'connecting' : 'reconnecting';

    try {
      const ws = new WebSocket(UPSTREAM_URLS[source]);
      upstream.ws = ws;

      ws.onopen = () => {
        upstream.status = 'live';
        upstream.attempt = 0;
        this.subscribeUpstream(source, ws);
      };

      ws.onmessage = (event) => {
        try {
          this.handleMessage(source, JSON.parse(String(event.data)));
        } catch (error) {
          console.error(`[hub:${source}] invalid message`, error);
        }
      };

      // An error is always followed by a `close`: the reconnection is scheduled there.
      ws.onerror = (event) => {
        console.error(`[hub:${source}] WebSocket error`, event);
      };

      ws.onclose = () => {
        if (upstream.ws === ws) upstream.ws = null;
        this.scheduleReconnect(source);
      };
    } catch (error) {
      console.error(`[hub:${source}] connection failed`, error);
      this.scheduleReconnect(source);
    }
  }

  private scheduleReconnect(source: Source): void {
    const upstream = this.upstreams[source];

    if (!this.running) {
      upstream.status = 'offline';
      return;
    }
    if (upstream.timer) return;

    upstream.status = 'reconnecting';
    upstream.reconnects += 1;
    // The Bitfinex chanId changes on every connection.
    if (source === 'BITFINEX') this.bitfinexChannel = null;

    const delay = Math.min(MAX_BACKOFF_MS, 1000 * 2 ** upstream.attempt) + Math.random() * 500;
    upstream.attempt += 1;

    upstream.timer = setTimeout(() => {
      upstream.timer = null;
      this.connect(source);
    }, delay);
  }

  private subscribeUpstream(source: Source, ws: WebSocket): void {
    if (source === 'COINBASE') {
      ws.send(
        JSON.stringify({
          type: 'subscribe',
          // USDT-USD only serves to convert Binance prices to dollars.
          product_ids: ['BTC-USD', 'USDT-USD'],
          channels: ['matches'],
        })
      );
    } else if (source === 'BITFINEX') {
      ws.send(JSON.stringify({ event: 'subscribe', channel: 'trades', symbol: 'tBTCUSD' }));
    }
  }

  private handleMessage(source: Source, data: unknown): void {
    switch (source) {
      case 'BINANCE': {
        const trade = parseBinanceTrade(data);
        if (trade) this.handleRealTrade(trade);
        return;
      }
      case 'COINBASE': {
        const parsed = parseCoinbaseMessage(data);
        if (!parsed) return;
        if (parsed.kind === 'usdt-rate') {
          // During a simulation, the simulated rate is the reference.
          if (!this.stopSimulator) this.usdtUsd = parsed.rate;
          return;
        }
        this.handleRealTrade(parsed.trade);
        return;
      }
      case 'BITFINEX': {
        const parsed = parseBitfinexMessage(data, this.bitfinexChannel);
        this.bitfinexChannel = parsed.channelId;
        if (parsed.trade) this.handleRealTrade(parsed.trade);
        return;
      }
    }
  }

  private handleRealTrade(trade: ParsedTrade): void {
    this.lastRealTradeAt = Date.now();
    // Live data is back: drop the fallback simulation.
    if (this.stopSimulator && this.mode === 'auto') this.endSimulation();
    this.emit(trade, false);
  }

  private beginSimulation(): void {
    if (this.stopSimulator) return;
    for (const source of SOURCES) this.upstreams[source].latencies = [];

    this.stopSimulator = startSimulator({
      onTrade: (trade) => this.emit(trade, true),
      onUsdtRate: (rate) => {
        this.usdtUsd = rate;
      },
    });
  }

  private endSimulation(): void {
    this.stopSimulator?.();
    this.stopSimulator = null;
    this.usdtUsd = null;
  }

  private emit(parsed: ParsedTrade, simulated: boolean): void {
    const upstream = this.upstreams[parsed.source];
    upstream.counter += 1;

    if (!simulated) {
      upstream.latencies.push(Math.max(0, Date.now() - parsed.ts));
      if (upstream.latencies.length > LATENCY_SAMPLES) upstream.latencies.shift();
    }

    const trade: Trade = {
      ...parsed,
      usdPrice: toUsdPrice(parsed.price, parsed.quote, this.usdtUsd),
      simulated,
    };

    for (const listener of this.listeners) {
      try {
        listener(trade);
      } catch (error) {
        console.error('[hub] listener failed', error);
      }
    }
  }

  private tickStats(): void {
    for (const source of SOURCES) {
      const upstream = this.upstreams[source];
      upstream.eventsPerSecond = upstream.counter;
      upstream.counter = 0;
    }
  }
}

// Singleton kept across hot reloads in development.
const globalForHub = globalThis as unknown as { __marketHub?: MarketHub };
export const marketHub: MarketHub = (globalForHub.__marketHub ??= new MarketHub());
