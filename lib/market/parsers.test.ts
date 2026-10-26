import { describe, expect, it } from 'vitest';
import {
  parseBinanceTrade,
  parseBitfinexMessage,
  parseCoinbaseMessage,
  toUsdPrice,
} from './parsers';

describe('parseBinanceTrade', () => {
  const message = { e: 'trade', E: 1_700_000_000_000, t: 42, p: '65000.10', q: '0.0100', m: false };

  it('converts a valid trade', () => {
    expect(parseBinanceTrade(message)).toEqual({
      id: 'BINANCE-42',
      source: 'BINANCE',
      quote: 'USDT',
      ts: 1_700_000_000_000,
      price: 65000.1,
      quantity: 0.01,
      side: 'BUY',
    });
  });

  it('m = true: the buyer is the maker, so the aggressor is the seller', () => {
    expect(parseBinanceTrade({ ...message, m: true })?.side).toBe('SELL');
  });

  it('ignores other message types', () => {
    expect(parseBinanceTrade({ e: 'aggTrade' })).toBeNull();
    expect(parseBinanceTrade('trade')).toBeNull();
    expect(parseBinanceTrade(null)).toBeNull();
  });

  it('rejects an invalid price or timestamp', () => {
    expect(parseBinanceTrade({ ...message, p: 'abc' })).toBeNull();
    expect(parseBinanceTrade({ ...message, E: undefined })).toBeNull();
  });
});

describe('parseCoinbaseMessage', () => {
  const match = {
    type: 'match',
    product_id: 'BTC-USD',
    trade_id: 7,
    time: '2026-01-01T00:00:00.000Z',
    price: '65010.00',
    size: '0.5',
    side: 'sell',
  };

  it('selling maker: the aggressor buys', () => {
    expect(parseCoinbaseMessage(match)).toEqual({
      kind: 'trade',
      trade: {
        id: 'COINBASE-7',
        source: 'COINBASE',
        quote: 'USD',
        ts: Date.parse('2026-01-01T00:00:00.000Z'),
        price: 65010,
        quantity: 0.5,
        side: 'BUY',
      },
    });
  });

  it('buying maker: the aggressor sells', () => {
    const parsed = parseCoinbaseMessage({ ...match, side: 'buy' });
    expect(parsed?.kind === 'trade' && parsed.trade.side).toBe('SELL');
  });

  it('reads the USDT/USD rate', () => {
    expect(
      parseCoinbaseMessage({ type: 'match', product_id: 'USDT-USD', price: '0.9997' })
    ).toEqual({ kind: 'usdt-rate', rate: 0.9997 });
  });

  it('uses last_match to know the rate as soon as it subscribes', () => {
    expect(
      parseCoinbaseMessage({ type: 'last_match', product_id: 'USDT-USD', price: '1.0001' })
    ).toEqual({ kind: 'usdt-rate', rate: 1.0001 });
  });

  it('does not treat a BTC-USD last_match as a trade', () => {
    expect(parseCoinbaseMessage({ ...match, type: 'last_match' })).toBeNull();
  });

  it('rejects an absurd rate and unsupported message types', () => {
    expect(
      parseCoinbaseMessage({ type: 'match', product_id: 'USDT-USD', price: '5' })
    ).toBeNull();
    expect(parseCoinbaseMessage({ type: 'subscriptions' })).toBeNull();
  });
});

describe('parseBitfinexMessage', () => {
  const subscribed = { event: 'subscribed', channel: 'trades', chanId: 123, symbol: 'tBTCUSD' };

  it('remembers the channel after subscribing', () => {
    expect(parseBitfinexMessage(subscribed, null)).toEqual({ channelId: 123, trade: null });
  });

  it('converts a positive "te" execution into a buy', () => {
    const result = parseBitfinexMessage([123, 'te', [99, 1_700_000_000_000, 0.25, 65020]], 123);
    expect(result.trade).toEqual({
      id: 'BITFINEX-99',
      source: 'BITFINEX',
      quote: 'USD',
      ts: 1_700_000_000_000,
      price: 65020,
      quantity: 0.25,
      side: 'BUY',
    });
  });

  it('converts a negative amount into a sell with a positive quantity', () => {
    const result = parseBitfinexMessage([123, 'te', [100, 1_700_000_000_000, -0.5, 65020]], 123);
    expect(result.trade?.side).toBe('SELL');
    expect(result.trade?.quantity).toBe(0.5);
  });

  it('ignores another channel, heartbeats and messages before subscription', () => {
    const trade = [99, 1_700_000_000_000, 0.25, 65020];
    expect(parseBitfinexMessage([999, 'te', trade], 123).trade).toBeNull();
    expect(parseBitfinexMessage([123, 'hb'], 123).trade).toBeNull();
    expect(parseBitfinexMessage([123, 'te', trade], null).trade).toBeNull();
  });

  it('keeps the current channel on an unrelated message', () => {
    expect(parseBitfinexMessage({ event: 'info', version: 2 }, 123).channelId).toBe(123);
  });
});

describe('toUsdPrice', () => {
  it('leaves USD prices unchanged', () => {
    expect(toUsdPrice(65000, 'USD', null)).toBe(65000);
  });

  it('converts USDT prices with the known rate', () => {
    expect(toUsdPrice(65000, 'USDT', 0.9995)).toBeCloseTo(64967.5, 6);
  });

  it('returns null while the rate is unknown', () => {
    expect(toUsdPrice(65000, 'USDT', null)).toBeNull();
  });
});
