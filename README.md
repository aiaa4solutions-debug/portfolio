# Herimalala Ranaivoarisoa — Portfolio

Personal portfolio built with Next.js 15 (App Router), TypeScript, Tailwind CSS,
shadcn/ui, Framer Motion and next-themes.

## Stack

- **Next.js 15** — App Router, `next/font`, metadata API
- **TypeScript** — strict mode
- **Tailwind CSS** — custom Slate / Indigo / Cyan design tokens
- **shadcn/ui** — Button, Card, Badge, Separator primitives
- **Framer Motion** — scroll and load animations
- **lucide-react** — icons
- **next-themes** — dark/light mode with system preference

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  layout.tsx        Root layout, fonts, SEO metadata, JSON-LD
  page.tsx           Home page — composes all sections
  globals.css         Design tokens (light + dark)
  sitemap.ts / robots.ts
components/
  navbar.tsx, footer.tsx, theme-toggle.tsx, theme-provider.tsx
  sections/           Hero, About, Skills, Experience, Projects, Technologies, Contact
  ui/                 shadcn-style primitives (Button, Card, Badge, Separator)
data/
  experience.ts, projects.ts, skills.ts   Content, kept separate from markup
lib/
  utils.ts            `cn` class-merging helper
```

## Editing content

All copy for skills, experience and projects lives in `data/*.ts` — update
those files rather than the components to change content.

## Deployment

Ready to deploy on [Vercel](https://vercel.com): push to a Git repository and
import the project, or run `vercel` from the project root.

Before going live, update the `SITE_URL` constant in `app/layout.tsx` and the
URLs in `app/sitemap.ts` / `app/robots.ts` to match the production domain.
# portfolio
