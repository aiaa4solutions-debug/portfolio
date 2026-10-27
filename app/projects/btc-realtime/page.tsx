import type { Metadata } from "next";
import { BtcProjectDetails } from "@/components/projects/btc-project-details";

export const metadata: Metadata = {
  title: "Real-Time BTC Multi-Exchange Feed",
  description:
    "Live Bitcoin trades from Binance, Coinbase and Bitfinex over WebSocket, relayed by a shared server hub over SSE, with price curves and the spread between exchanges.",
  alternates: { canonical: "/projects/btc-realtime" },
  openGraph: {
    title: "Real-Time BTC Multi-Exchange Feed",
    description:
      "Shared WebSocket hub, SSE route with backpressure, Recharts curves and spread between exchanges.",
    url: "/projects/btc-realtime",
    type: "website",
  },
};

export default function BtcRealtimePage() {
  return <BtcProjectDetails />;
}
