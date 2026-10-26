import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Github } from 'lucide-react';

import { CaseStudy } from '@/components/market/CaseStudy';
import RealTimeDashboard from '@/components/market/RealTimeDashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const SOURCE_URL =
  'https://github.com/aiaa4solutions-debug/portfolio/tree/main/lib/market';

const TECH = ['Next.js', 'TypeScript', 'WebSocket', 'SSE', 'Recharts', 'Tailwind CSS'];

export const metadata: Metadata = {
  title: 'Real-Time BTC Multi-Exchange Feed',
  description:
    'Live Bitcoin trades from Binance, Coinbase and Bitfinex over WebSocket, relayed by a shared server hub over SSE, with price curves and the spread between exchanges.',
  alternates: { canonical: '/projects/btc-realtime' },
  openGraph: {
    title: 'Real-Time BTC Multi-Exchange Feed',
    description:
      'Shared WebSocket hub, SSE route with backpressure, Recharts curves and spread between exchanges.',
    url: '/projects/btc-realtime',
    type: 'website',
  },
};

export default function BtcRealtimePage() {
  return (
    <div className="container pb-24 pt-28">
      <Button variant="ghost" size="sm" className="-ml-3" asChild>
        <Link href="/#projects">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to projects
        </Link>
      </Button>

      <header className="mt-6 max-w-3xl">
        <p className="font-mono text-sm text-accent">{'// live demo'}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Real-Time BTC Multi-Exchange Feed
        </h1>
        <p className="mt-4 text-muted-foreground">
          Trades from Binance, Coinbase and Bitfinex arrive over WebSocket on the server,
          are relayed to this page over SSE, and are compared in dollars: live prices,
          buy and sell curves, and the spread between exchanges.
        </p>

        <ul className="mt-5 flex flex-wrap items-center gap-2">
          {TECH.map((tech) => (
            <li key={tech}>
              <Badge variant="indigo">{tech}</Badge>
            </li>
          ))}
        </ul>

        <Button variant="outline" size="sm" className="mt-5" asChild>
          <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
            <Github className="h-4 w-4" aria-hidden="true" />
            View the source
          </a>
        </Button>
      </header>

      <RealTimeDashboard className="mt-10" />
      <CaseStudy />
    </div>
  );
}
