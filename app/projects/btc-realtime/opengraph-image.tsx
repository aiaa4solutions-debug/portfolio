import { ImageResponse } from 'next/og';

export const alt = 'Real-Time BTC Multi-Exchange Feed';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: 80,
          background: '#020617',
          color: '#f8fafc',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, color: '#22d3ee' }}>
          Next.js, SSE, WebSocket, Recharts
        </div>
        <div style={{ display: 'flex', fontSize: 78, fontWeight: 700, marginTop: 24 }}>
          Real-Time BTC Feed
        </div>
        <div style={{ display: 'flex', fontSize: 34, color: '#94a3b8', marginTop: 24 }}>
          Binance, Coinbase and Bitfinex: spread, latency and automatic reconnection
        </div>
      </div>
    ),
    { ...size }
  );
}
