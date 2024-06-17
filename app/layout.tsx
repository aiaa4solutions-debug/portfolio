import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://herimalala.dev";
const SITE_NAME = "Herimalala Ranaivoarisoa Rivomanana — Full Stack Developer";
const SITE_DESCRIPTION =
  "Full Stack Developer specialized in JavaScript, TypeScript and Python, building modern web applications and AI-integrated automation with Next.js, Node.js and the OpenAI API.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | Herimalala Ranaivoarisoa",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript",
    "Python",
    "AI Integration",
    "OpenAI API",
    "Workflow Automation",
    "Madagascar",
  ],
  authors: [{ name: "Herimalala Ranaivoarisoa Rivomanana" }],
  creator: "Herimalala Ranaivoarisoa Rivomanana",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Herimalala Ranaivoarisoa Rivomanana",
  jobTitle: "Full Stack Developer",
  url: SITE_URL,
  email: "mailto:ranaivoarisoa@gmx.fr",
  telephone: "+261349403247",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Antsirabe",
    addressCountry: "MG",
  },
  sameAs: ["https://linkedin.com/in/ranaivoarisoa"],
  knowsAbout: [
    "JavaScript",
    "TypeScript",
    "Python",
    "React",
    "Next.js",
    "Node.js",
    "OpenAI API",
    "Workflow Automation",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
