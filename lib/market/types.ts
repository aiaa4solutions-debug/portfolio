export const SOURCES = ['BINANCE', 'COINBASE', 'BITFINEX'] as const;

export type Source = (typeof SOURCES)[number];
export type Side = 'BUY' | 'SELL';
export type Quote = 'USDT' | 'USD';
export type SourceStatus = 'connecting' | 'live' | 'reconnecting' | 'offline';

/**
 * auto   : live data, with an automatic fallback to simulated data when no
 *          exchange answers (default).
 * live   : live data only, no fallback.
 * replay : simulated data only, no call to the exchanges.
 */
export type MarketMode = 'auto' | 'live' | 'replay';

export interface Trade {
  id: string;
  source: Source;
  quote: Quote;
  /** Trade time reported by the exchange (ms since epoch). */
  ts: number;
  /** Native price: USDT for Binance, USD for the others. */
  price: number;
  /** Price converted to USD, or null while the USDT/USD rate is unknown. */
  usdPrice: number | null;
  quantity: number;
  /** Side of the aggressor (the order that takes liquidity from the book). */
  side: Side;
  simulated: boolean;
}

/** A trade as read from an exchange, before the hub enriches it. */
export type ParsedTrade = Omit<Trade, 'usdPrice' | 'simulated'>;

export interface SourceStats {
  status: SourceStatus;
  eventsPerSecond: number;
  /** Average exchange-to-server latency (sensitive to clock skew). */
  latencyMs: number | null;
  reconnects: number;
}

export interface StatsMessage {
  mode: 'live' | 'simulated';
  sources: Record<Source, SourceStats>;
  usdtUsd: number | null;
  subscribers: number;
  /** Messages dropped on this connection (slow client). */
  dropped: number;
  serverTime: number;
}
