# Mecatronix — Next.js

Company website for Mecatronix Software Development, built with [Next.js](https://nextjs.org) (App Router), TypeScript and Tailwind CSS v4.

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `bun run dev` — start the dev server
- `bun run build` — production build
- `bun run start` — run the production build
- `bun run lint` — lint the project
- `bun run typecheck` — type-check without emitting

## Project structure

```
src/
  app/                 Routes (App Router). Every page is statically generated.
    api/contact/       Project enquiry endpoint (validation, spam checks, delivery)
    api/meca/          MECA chat assistant endpoint (Anthropic API)
    og/                Dynamic Open Graph share images
  components/
    layout/            Header (nav, services dropdown, mobile menu) and footer
    home/              Homepage sections
    sections/          Shared page sections (page hero, CTA, FAQ)
    portfolio/         Project cards, covers and the filterable work grid
    visuals/           Illustrative interface mockups (decorative)
    ui/                Design-system primitives (buttons, headings, icons…)
  data/                All site content: services, projects, industries,
                       process, articles, company copy
  lib/                 SEO helpers, site config, contact schema, backend bridge
  app/globals.css      Design tokens (colors, type scale, motion) — Tailwind @theme
```

## Editing content

Content lives in `src/data/`; pages update automatically.

- **Projects** (`src/data/projects.ts`): add real screenshots to `public/work/<slug>/` and list them in `images` — the first becomes the cover. Fill in `challenge`, `solution` and (if measured) `results`; a case study is indexed by search engines once it has both a challenge and a solution. Only add verified facts.
- **Services**: names and summaries in `src/data/service-list.ts`, full page content in `src/data/services.ts`.
- **Articles** (`src/data/insights.ts`): use the real publication date.
- **Contact details and social links**: `src/config/envConfig.ts` / environment variables.

## Environment variables

See `.env.example`. The contact form needs at least one delivery channel in production:

- `RESEND_API_KEY` + `CONTACT_FROM_EMAIL` (+ optional `CONTACT_TO_EMAIL`) to email enquiries, and/or
- `MECA_API_BASE_URL` to forward them to the existing Mecatronix backend (`/enquiry/add`).

`ANTHROPIC_API_KEY` powers the MECA assistant. Client-exposed variables must be prefixed with `NEXT_PUBLIC_`; never put secrets in those.

## Redirects

Old routes permanently redirect to the new ones (`next.config.ts`): `/ourworld` → `/about`, `/portfolio` → `/work`, `/openline` → `/contact`.
