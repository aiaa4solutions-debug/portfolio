export function SocialCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 72,
        background: "#080d18",
        color: "#f8fafc",
        borderBottom: "12px solid #22d3ee",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "#22d3ee" }}>
        heri.dev / portfolio
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 68,
          fontWeight: 700,
          letterSpacing: -2,
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 30,
          color: "#94a3b8",
          lineHeight: 1.4,
        }}
      >
        {subtitle}
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#818cf8" }}>
        herimalala.netlify.app
      </div>
    </div>
  );
}
