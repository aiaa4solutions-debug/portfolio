'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  computeSpread,
  pairDiffs,
  type HistoryPoint,
  type PriceMap,
  type SeriesKey,
  type SpreadInfo,
} from '@/lib/market/analytics';
import type { Source, SourceStatus, StatsMessage, Trade } from '@/lib/market/types';

export type ConnectionState = SourceStatus;
export type KeyedTrade = Trade & { key: number };
export type SpreadRecord = SpreadInfo & { t: number };

const MAX_TABLE_ROWS = 40;
const MAX_BUFFER = 200;
const MAX_HISTORY = 1200; // 10 minutes at 2 points per second
const FLUSH_MS = 50;
const SAMPLE_MS = 500;
const OUTAGE_MS = 5000;
const MAX_RETRY_MS = 30_000;

const emptyLatest = (): Record<Source, Trade | null> => ({
  BINANCE: null,
  COINBASE: null,
  BITFINEX: null,
});

/**
 * Price used to compare exchanges: in USD. A Binance price whose USDT/USD rate is not
 * known yet is skipped, so the ~0.03% conversion gap does not distort the spread.
 */
const comparablePrice = (trade: Trade): number | null =>
  trade.usdPrice ?? (trade.quote === 'USD' ? trade.price : null);

/**
 * Consumes the /api/metrics SSE stream. Messages are collected in a buffer flushed
 * every 50 ms (one React render per batch), and a history point is sampled every
 * 500 ms for the curves.
 */
export function useMarketStream(replay: boolean) {
  const [connection, setConnection] = useState<ConnectionState>('connecting');
  const [trades, setTrades] = useState<KeyedTrade[]>([]);
  const [latest, setLatest] = useState<Record<Source, Trade | null>>(emptyLatest);
  const [stats, setStats] = useState<StatsMessage | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [spreadNow, setSpreadNow] = useState<SpreadInfo | null>(null);
  const [sessionMax, setSessionMax] = useState<SpreadRecord | null>(null);
  const [paused, setPaused] = useState(false);
  const [outage, setOutage] = useState(false);
  const [nonce, setNonce] = useState(0);
  const [clientReconnects, setClientReconnects] = useState(0);

  const bufferRef = useRef<KeyedTrade[]>([]);
  const seqRef = useRef(0);
  const totalRef = useRef(0);
  const dirtyRef = useRef(false);
  const latestTradeRef = useRef<Record<Source, Trade | null>>(emptyLatest());
  const sourcePricesRef = useRef<PriceMap>({});
  const sidePricesRef = useRef<Partial<Record<SeriesKey, number>>>({});
  const historyRef = useRef<HistoryPoint[]>([]);
  const sessionMaxRef = useRef<SpreadRecord | null>(null);
  const pausedRef = useRef(false);
  const connectionRef = useRef<ConnectionState>('connecting');
  const esRef = useRef<EventSource | null>(null);
  const outageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateConnection = useCallback((next: ConnectionState) => {
    connectionRef.current = next;
    setConnection(next);
  }, []);

  // SSE connection. `nonce` forces a new connection (retry, end of a simulated outage).
  useEffect(() => {
    const es = new EventSource(replay ? '/api/metrics?mode=replay' : '/api/metrics');
    esRef.current = es;

    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let attempt = 0;

    es.onopen = () => {
      attempt = 0;
      updateConnection('live');
    };

    es.onmessage = (event: MessageEvent<string>) => {
      try {
        const trade = JSON.parse(event.data) as Trade;

        bufferRef.current.push({ ...trade, key: seqRef.current++ });
        // A background tab throttles setInterval: cap the buffer.
        if (bufferRef.current.length > MAX_BUFFER) {
          bufferRef.current = bufferRef.current.slice(-MAX_BUFFER);
        }
        totalRef.current += 1;
        latestTradeRef.current[trade.source] = trade;

        const price = comparablePrice(trade);
        if (price !== null) {
          sourcePricesRef.current[trade.source] = price;
          sidePricesRef.current[`${trade.source}_${trade.side}` as SeriesKey] = price;
        }
        dirtyRef.current = true;
      } catch (error) {
        console.error('Invalid SSE message:', error);
      }
    };

    es.addEventListener('stats', (event) => {
      try {
        setStats(JSON.parse((event as MessageEvent<string>).data) as StatsMessage);
      } catch (error) {
        console.error('Invalid SSE stats:', error);
      }
    });

    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) {
        // The browser gave up (invalid response): retry ourselves with a growing delay.
        updateConnection('offline');
        const delay = Math.min(MAX_RETRY_MS, 1000 * 2 ** attempt);
        attempt += 1;
        retryTimer = setTimeout(() => {
          updateConnection('connecting');
          setNonce((value) => value + 1);
        }, delay);
      } else {
        // EventSource is reconnecting natively.
        updateConnection('reconnecting');
        setClientReconnects((value) => value + 1);
      }
    };

    return () => {
      es.close();
      if (esRef.current === es) esRef.current = null;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [replay, nonce, updateConnection]);

  // Buffer flush (50 ms) and history sampling (500 ms).
  useEffect(() => {
    const flush = setInterval(() => {
      if (!dirtyRef.current) return;
      dirtyRef.current = false;

      const items = bufferRef.current;
      bufferRef.current = [];

      if (items.length > 0) {
        setTrades((previous) => [...previous, ...items].slice(-MAX_TABLE_ROWS));
      }
      setLatest({ ...latestTradeRef.current });
      setTotalCount(totalRef.current);
    }, FLUSH_MS);

    const sample = setInterval(() => {
      if (connectionRef.current !== 'live') return;

      const sides = sidePricesRef.current;
      if (Object.keys(sides).length === 0) return;

      const now = Date.now();
      const prices = sourcePricesRef.current;
      const info = computeSpread(prices);

      const point: HistoryPoint = {
        t: now,
        ...sides,
        ...pairDiffs(prices),
        ...(info ? { spread: info.spread } : {}),
      };

      historyRef.current = [...historyRef.current, point].slice(-MAX_HISTORY);
      if (!pausedRef.current) setHistory(historyRef.current);
      setSpreadNow(info);

      const best = sessionMaxRef.current;
      if (info && (best === null || info.spread > best.spread)) {
        sessionMaxRef.current = { ...info, t: now };
        setSessionMax(sessionMaxRef.current);
      }
    }, SAMPLE_MS);

    return () => {
      clearInterval(flush);
      clearInterval(sample);
    };
  }, []);

  useEffect(
    () => () => {
      if (outageTimerRef.current) clearTimeout(outageTimerRef.current);
    },
    []
  );

  const togglePause = useCallback(() => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    // On resume, catch up with the points collected during the pause.
    if (!next) setHistory(historyRef.current);
  }, []);

  /**
   * Client-side outage only: closes the SSE connection, then reopens it. It affects
   * neither other visitors nor the server's connections to the exchanges.
   */
  const simulateOutage = useCallback(() => {
    if (outageTimerRef.current) return;

    esRef.current?.close();
    esRef.current = null;
    updateConnection('offline');
    setOutage(true);

    outageTimerRef.current = setTimeout(() => {
      outageTimerRef.current = null;
      setOutage(false);
      updateConnection('connecting');
      setNonce((value) => value + 1);
    }, OUTAGE_MS);
  }, [updateConnection]);

  const getFullHistory = useCallback(() => historyRef.current, []);

  return {
    connection,
    trades,
    latest,
    stats,
    totalCount,
    history,
    spreadNow,
    sessionMax,
    paused,
    outage,
    clientReconnects,
    togglePause,
    simulateOutage,
    getFullHistory,
  };
}
