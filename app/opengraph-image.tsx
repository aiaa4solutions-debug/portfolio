import { ImageResponse } from "next/og";
import { SocialCard } from "@/components/seo/social-card";
export const alt = "Herimalala Ranaivoarisoa — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <SocialCard
      title="Herimalala Ranaivoarisoa"
      subtitle="Full Stack Developer · Next.js · Python · AI & Automation"
    />,
    size,
  );
}
