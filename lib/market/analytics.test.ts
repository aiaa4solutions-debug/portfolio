import { describe, expect, it } from 'vitest';
import { computeSpread, pairDiffs, selectWindow, toCsv, type HistoryPoint } from './analytics';

describe('computeSpread', () => {
  it('returns the gap between the most and least expensive exchange', () => {
    const result = computeSpread({ BINANCE: 100, COINBASE: 110, BITFINEX: 105 });
    expect(result).toMatchObject({ spread: 10, high: 'COINBASE', low: 'BINANCE' });
    expect(result?.pct).toBeCloseTo(10, 6);
  });

  it('returns null with fewer than two exchanges', () => {
    expect(computeSpread({})).toBeNull();
    expect(computeSpread({ BINANCE: 100 })).toBeNull();
  });

  it('handles identical prices', () => {
    expect(computeSpread({ BINANCE: 100, COINBASE: 100 })).toMatchObject({ spread: 0, pct: 0 });
  });
});

describe('pairDiffs', () => {
  it('computes the signed gap of every available pair', () => {
    expect(pairDiffs({ BINANCE: 105, COINBASE: 100, BITFINEX: 90 })).toEqual({
      BINANCE_COINBASE: 5,
      BINANCE_BITFINEX: 15,
      COINBASE_BITFINEX: 10,
    });
  });

  it('skips pairs when an exchange is missing', () => {
    expect(pairDiffs({ BINANCE: 105, COINBASE: 100 })).toEqual({ BINANCE_COINBASE: 5 });
  });
});

describe('selectWindow', () => {
  const points = Array.from({ length: 1200 }, (_, index) => ({ t: index * 500 }));
  const last = points[points.length - 1];

  it('keeps only the requested window', () => {
    expect(selectWindow(points, 30_000)).toHaveLength(61);
  });

  it('caps the number of points and keeps the last one', () => {
    const result = selectWindow(points, 600_000, 300);
    expect(result.length).toBeLessThanOrEqual(300);
    expect(result[result.length - 1]).toBe(last);
  });

  it('keeps the same points when the window slides', () => {
    const before = selectWindow(points.slice(0, 1100), 600_000, 300);
    const after = selectWindow(points.slice(0, 1104), 600_000, 300);
    const shared = before.filter((point) => after.includes(point));
    // Only the last (incomplete) bucket may change.
    expect(shared.length).toBeGreaterThanOrEqual(before.length - 2);
  });

  it('handles an empty history', () => {
    expect(selectWindow([], 30_000)).toEqual([]);
  });
});

describe('toCsv', () => {
  it('writes a header and leaves missing values empty', () => {
    const points: HistoryPoint[] = [
      { t: 0, BINANCE_BUY: 100, BINANCE_SELL: 99.5, BINANCE_COINBASE: -1, spread: 1 },
    ];
    const [header, row] = toCsv(points).split('\n');

    expect(header?.startsWith('timestamp,BINANCE_BUY,BINANCE_SELL')).toBe(true);
    expect(row?.startsWith('1970-01-01T00:00:00.000Z,100,99.5,')).toBe(true);
    expect(row?.endsWith(',1')).toBe(true);
    expect(row?.split(',')).toHaveLength(header?.split(',').length ?? -1);
  });
});
