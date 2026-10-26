import { afterEach, describe, expect, it } from 'vitest';
import { MarketHub } from './hub';
import type { Trade } from './types';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('MarketHub in replay mode', () => {
  let hub: MarketHub | null = null;

  afterEach(() => {
    hub?.dispose();
    hub = null;
  });

  it('broadcasts simulated trades with a USD-converted price', async () => {
    hub = new MarketHub('replay');
    const trades: Trade[] = [];
    hub.subscribe((trade) => trades.push(trade));

    await wait(2500);

    expect(trades.length).toBeGreaterThan(0);
    expect(trades.every((trade) => trade.simulated)).toBe(true);
    expect(trades.every((trade) => trade.usdPrice !== null)).toBe(true);

    const stats = hub.getStats();
    expect(stats.mode).toBe('simulated');
    expect(stats.subscribers).toBe(1);
    expect(stats.usdtUsd).not.toBeNull();
  });

  it('stops broadcasting after dispose', async () => {
    hub = new MarketHub('replay');
    const trades: Trade[] = [];
    hub.subscribe((trade) => trades.push(trade));
    await wait(500);

    hub.dispose();
    const count = trades.length;
    await wait(800);

    expect(trades.length).toBe(count);
  });

  it('no longer notifies an unsubscribed listener', async () => {
    hub = new MarketHub('replay');
    const kept: Trade[] = [];
    const dropped: Trade[] = [];
    hub.subscribe((trade) => kept.push(trade));
    const unsubscribe = hub.subscribe((trade) => dropped.push(trade));

    await wait(400);
    unsubscribe();
    const countAtUnsubscribe = dropped.length;
    await wait(800);

    expect(dropped.length).toBe(countAtUnsubscribe);
    expect(kept.length).toBeGreaterThan(countAtUnsubscribe);
  });
});
