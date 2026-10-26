import { type NextRequest } from 'next/server';
import { connection } from 'next/server';
import { MarketHub, marketHub } from '@/lib/market/hub';
import type { Trade } from '@/lib/market/types';

// Maximum lifetime of one SSE connection on Vercel. The client reconnects on its
// own (EventSource), so a short value is fine and works on every plan.
export const maxDuration = 60;

const KEEPALIVE_MS = 15_000;
const STATS_MS = 1_000;

export async function GET(req: NextRequest) {
  await connection();

  // ?mode=replay: simulation private to this connection, no call to the exchanges.
  const replay = req.nextUrl.searchParams.get('mode') === 'replay';
  const encoder = new TextEncoder();

  let cleanup: () => void = () => {};

  const stream = new ReadableStream<Uint8Array>(
    {
      start(controller) {
        const hub = replay ? new MarketHub('replay') : marketHub;
        const timers: Array<ReturnType<typeof setInterval>> = [];
        let unsubscribe: (() => void) | null = null;
        let closed = false;
        let dropped = 0;

        const close = () => {
          if (closed) return;
          closed = true;

          req.signal.removeEventListener('abort', close);
          for (const timer of timers) clearInterval(timer);
          unsubscribe?.();
          if (replay) hub.dispose();

          try {
            controller.close();
          } catch {
            // The stream is already closed.
          }
        };
        cleanup = close;

        const write = (chunk: string, droppable: boolean) => {
          if (closed) return;

          // Backpressure: a slow client loses trades (they are counted), but never
          // the stats messages or the keep-alives.
          if (droppable && controller.desiredSize !== null && controller.desiredSize <= 0) {
            dropped += 1;
            return;
          }

          try {
            controller.enqueue(encoder.encode(chunk));
          } catch {
            close();
          }
        };

        const sendStats = () =>
          write(`event: stats\ndata: ${JSON.stringify(hub.getStats(dropped))}\n\n`, false);

        write('retry: 3000\n\n', false);
        unsubscribe = hub.subscribe((trade: Trade) =>
          write(`data: ${JSON.stringify(trade)}\n\n`, true)
        );
        sendStats();

        timers.push(
          setInterval(sendStats, STATS_MS),
          // SSE comment: keeps a proxy from closing an idle connection.
          setInterval(() => write(': ping\n\n', false), KEEPALIVE_MS)
        );

        req.signal.addEventListener('abort', close, { once: true });
        if (req.signal.aborted) close();
      },

      cancel() {
        cleanup();
      },
    },
    // Buffer of 1000 messages before backpressure applies.
    { highWaterMark: 1000 }
  );

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}
