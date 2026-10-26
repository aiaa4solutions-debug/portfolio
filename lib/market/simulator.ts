import { SOURCES, type ParsedTrade, type Quote, type Source } from './types';

interface SimulatorHandlers {
  onTrade: (trade: ParsedTrade) => void;
  onUsdtRate: (rate: number) => void;
}

const START_PRICE_USD = 100_000;

// Rates and price offsets differ on purpose from one exchange to the next, so the
// spread moves in a readable way in the demo.
const PROFILES: Record<Source, { ratePerSecond: number; offset: number; quote: Quote }> = {
  BINANCE: { ratePerSecond: 8, offset: 0, quote: 'USDT' },
  COINBASE: { ratePerSecond: 3, offset: 14, quote: 'USD' },
  BITFINEX: { ratePerSecond: 1.2, offset: -9, quote: 'USD' },
};

const round2 = (value: number) => Math.round(value * 100) / 100;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Generates synthetic trades (a shared random walk plus a per-exchange offset). Used
 * as a fallback when the exchanges are unreachable, or as an offline demo mode.
 * Returns the stop function.
 */
export function startSimulator({ onTrade, onUsdtRate }: SimulatorHandlers): () => void {
  let stopped = false;
  let basePrice = START_PRICE_USD;
  let usdtRate = 0.9997;
  let sequence = 0;
  const timers = new Set<ReturnType<typeof setTimeout>>();

  const emitTrade = (source: Source) => {
    const profile = PROFILES[source];
    basePrice *= 1 + (Math.random() - 0.5) * 0.00006;

    const drift = 0.6 + 0.8 * Math.sin(Date.now() / 15_000);
    const usdPrice = basePrice + profile.offset * drift + (Math.random() - 0.5) * 6;
    const price = profile.quote === 'USDT' ? usdPrice / usdtRate : usdPrice;

    sequence += 1;
    onTrade({
      id: `${source}-SIM-${sequence}`,
      source,
      quote: profile.quote,
      ts: Date.now(),
      price: round2(price),
      quantity: Math.random() * 0.15 + 0.0005,
      side: Math.random() < 0.5 ? 'BUY' : 'SELL',
    });
  };

  // Poisson-like arrivals: exponential delays.
  const schedule = (source: Source) => {
    const delay = (-Math.log(1 - Math.random()) / PROFILES[source].ratePerSecond) * 1000;
    const timer = setTimeout(() => {
      timers.delete(timer);
      if (stopped) return;
      emitTrade(source);
      schedule(source);
    }, delay);
    timers.add(timer);
  };

  const rateTimer = setInterval(() => {
    usdtRate = clamp(usdtRate + (Math.random() - 0.5) * 0.0001, 0.998, 1.001);
    onUsdtRate(usdtRate);
  }, 2000);

  onUsdtRate(usdtRate);
  for (const source of SOURCES) schedule(source);

  return () => {
    stopped = true;
    for (const timer of timers) clearTimeout(timer);
    timers.clear();
    clearInterval(rateTimer);
  };
}
