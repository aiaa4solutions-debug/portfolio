import type { ParsedTrade, Quote } from './types';

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export function toNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/** Binance: `btcusdt@trade` stream. */
export function parseBinanceTrade(data: unknown): ParsedTrade | null {
  if (!isRecord(data) || data.e !== 'trade') return null;

  const price = toNumber(data.p);
  const ts = toNumber(data.E);
  if (price === null || ts === null) return null;

  return {
    id: `BINANCE-${String(data.t ?? ts)}`,
    source: 'BINANCE',
    quote: 'USDT',
    ts,
    price,
    quantity: toNumber(data.q) ?? 0,
    // m = true: the buyer is the maker, so the aggressor is the seller.
    side: data.m === true ? 'SELL' : 'BUY',
  };
}

export type CoinbaseParsed =
  | { kind: 'trade'; trade: ParsedTrade }
  | { kind: 'usdt-rate'; rate: number };

/**
 * Coinbase: `matches` channel for BTC-USD (trades) and USDT-USD (exchange rate).
 * The `last_match` message sent on subscription gives the rate right away.
 */
export function parseCoinbaseMessage(data: unknown): CoinbaseParsed | null {
  if (!isRecord(data)) return null;

  const isMatch = data.type === 'match';
  const isSnapshot = data.type === 'last_match';
  if (!isMatch && !isSnapshot) return null;

  const price = toNumber(data.price);
  if (price === null) return null;

  if (data.product_id === 'USDT-USD') {
    // Sanity check: a stablecoin does not drift 50% away from the dollar.
    return price > 0.5 && price < 1.5 ? { kind: 'usdt-rate', rate: price } : null;
  }

  if (data.product_id !== 'BTC-USD' || !isMatch) return null;

  const time = typeof data.time === 'string' ? Date.parse(data.time) : Number.NaN;
  const ts = Number.isFinite(time) ? time : Date.now();

  return {
    kind: 'trade',
    trade: {
      id: `COINBASE-${String(data.trade_id ?? ts)}`,
      source: 'COINBASE',
      quote: 'USD',
      ts,
      price,
      quantity: toNumber(data.size) ?? 0,
      // `side` is the maker's side: a selling maker means the aggressor buys.
      side: data.side === 'sell' ? 'BUY' : 'SELL',
    },
  };
}

export interface BitfinexParsed {
  channelId: number | null;
  trade: ParsedTrade | null;
}

/** Bitfinex: `trades` channel for tBTCUSD. The `chanId` changes on every connection. */
export function parseBitfinexMessage(
  data: unknown,
  channelId: number | null
): BitfinexParsed {
  if (isRecord(data)) {
    if (data.event === 'subscribed' && data.channel === 'trades') {
      return { channelId: toNumber(data.chanId), trade: null };
    }
    return { channelId, trade: null };
  }

  if (!Array.isArray(data) || channelId === null || data[0] !== channelId) {
    return { channelId, trade: null };
  }

  // "te" = trade execution ("tu" follows later with the final id).
  if (data[1] !== 'te' || !Array.isArray(data[2])) {
    return { channelId, trade: null };
  }

  const [id, mts, amount, price] = data[2] as unknown[];
  const ts = toNumber(mts);
  const signedAmount = toNumber(amount);
  const px = toNumber(price);
  if (ts === null || signedAmount === null || px === null) {
    return { channelId, trade: null };
  }

  return {
    channelId,
    trade: {
      id: `BITFINEX-${String(id ?? ts)}`,
      source: 'BITFINEX',
      quote: 'USD',
      ts,
      price: px,
      quantity: Math.abs(signedAmount),
      side: signedAmount < 0 ? 'SELL' : 'BUY',
    },
  };
}

export function toUsdPrice(
  price: number,
  quote: Quote,
  usdtUsd: number | null
): number | null {
  if (quote === 'USD') return price;
  return usdtUsd === null ? null : price * usdtUsd;
}
