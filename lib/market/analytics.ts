import { SOURCES, type Side, type Source } from './types';

export type SeriesKey = `${Source}_${Side}`;

export const PAIRS = [
  { key: 'BINANCE_COINBASE', a: 'BINANCE', b: 'COINBASE', label: 'Binance − Coinbase' },
  { key: 'BINANCE_BITFINEX', a: 'BINANCE', b: 'BITFINEX', label: 'Binance − Bitfinex' },
  { key: 'COINBASE_BITFINEX', a: 'COINBASE', b: 'BITFINEX', label: 'Coinbase − Bitfinex' },
] as const;

export type PairKey = (typeof PAIRS)[number]['key'];

/** One history point: price per series (buy/sell) and spreads, sampled together. */
export type HistoryPoint = { t: number; spread?: number } & Partial<
  Record<SeriesKey | PairKey, number>
>;

export type PriceMap = Partial<Record<Source, number>>;

export interface SpreadInfo {
  /** Gap between the most and least expensive exchange (USD). */
  spread: number;
  /** Same gap as a percentage of the lowest price. */
  pct: number;
  high: Source;
  low: Source;
}

export function computeSpread(prices: PriceMap): SpreadInfo | null {
  const entries = SOURCES.flatMap((source) => {
    const price = prices[source];
    return price === undefined ? [] : [{ source, price }];
  });
  if (entries.length < 2) return null;

  entries.sort((x, y) => x.price - y.price);
  const low = entries[0];
  const high = entries[entries.length - 1];
  if (!low || !high) return null;

  const spread = high.price - low.price;
  return { spread, pct: (spread / low.price) * 100, high: high.source, low: low.source };
}

/** Signed gap (a − b) for every pair of exchanges that has both prices. */
export function pairDiffs(prices: PriceMap): Partial<Record<PairKey, number>> {
  const result: Partial<Record<PairKey, number>> = {};
  for (const { key, a, b } of PAIRS) {
    const priceA = prices[a];
    const priceB = prices[b];
    if (priceA !== undefined && priceB !== undefined) result[key] = priceA - priceB;
  }
  return result;
}

/**
 * Keeps the points of the time window (ending at the last point) and caps their
 * number. Downsampling uses absolute time buckets: the retained points do not
 * change as the window slides, so the curve does not flicker.
 */
export function selectWindow<T extends { t: number }>(
  points: T[],
  windowMs: number,
  maxPoints = 300
): T[] {
  const last = points[points.length - 1];
  if (!last) return points;

  const start = last.t - windowMs;
  const inWindow = points.filter((point) => point.t >= start);
  if (inWindow.length <= maxPoints) return inWindow;

  const bucketMs = windowMs / maxPoints;
  const result: T[] = [];
  let lastBucket = Number.NaN;

  for (const point of inWindow) {
    const bucket = Math.floor(point.t / bucketMs);
    if (bucket === lastBucket) result[result.length - 1] = point;
    else result.push(point);
    lastBucket = bucket;
  }
  return result;
}

const CSV_COLUMNS: string[] = [
  ...SOURCES.flatMap((source) => [`${source}_BUY`, `${source}_SELL`]),
  ...PAIRS.map((pair) => pair.key),
  'spread',
];

export function toCsv(points: HistoryPoint[]): string {
  const header = ['timestamp', ...CSV_COLUMNS].join(',');
  const rows = points.map((point) => {
    const record = point as unknown as Record<string, number | undefined>;
    const cells = CSV_COLUMNS.map((column) => {
      const value = record[column];
      return value === undefined ? '' : String(value);
    });
    return [new Date(point.t).toISOString(), ...cells].join(',');
  });
  return `${[header, ...rows].join('\n')}\n`;
}
