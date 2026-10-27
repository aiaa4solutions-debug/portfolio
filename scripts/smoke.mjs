// Read-only smoke test; never opens upstream exchange connections.
const base = new URL(process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000");
if (!["http:", "https:"].includes(base.protocol))
  throw new Error("Expected HTTP(S) URL");
for (const path of ["/", "/projects/btc-realtime", "/api/health"]) {
  const response = await fetch(new URL(path, base), {
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  if (path === "/api/health") {
    if ((await response.json()).status !== "ok")
      throw new Error("Unexpected health response");
  } else {
    const html = await response.text();
    const expected =
      path === "/" ? "https://calendly.com/aiaa4solutions" : "Real-Time BTC";
    if (!html.includes(expected))
      throw new Error(`${path}: missing expected content`);
  }
  console.log(`PASS ${path}`);
}
