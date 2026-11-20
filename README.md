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

### Work details, screenshots, videos and MECA robot board

All content management lives in the separate **mec-admin** app (`Meca AdminUi/Meca-Adminui`).

- **Works** and **Projects** manage names, descriptions, clients, publication and case-study sections.
- **Work details & media** (`/mec-admin/project-media`) includes existing website projects as well as backend projects. Use **Edit work details** to create or edit a case study, upload screenshots or videos, then **Save media**. The first screenshot becomes the cover; descriptions, order, removals and video preview images are editable.
- **MECA robot board** (`/mec-admin/meca-board`) manages visibility, message, highlighted phrase, destination and repeat interval, with a message preview.

This website has no admin UI or admin authentication proxy. `/admin` returns 404 unless
`ADMIN_PANEL_URL` redirects legacy links to the separate admin app. The public
`GET /api/portfolio` endpoint supplies its project catalog to mec-admin without credentials.

Set mec-admin's `VITE_API_CUSTOMER_BASE_URL` to this website's origin (locally,
`http://localhost:3000`) so existing website projects appear in its library. Set its
`VITE_API_BASE_URL` to the backend's `/mec-api` URL or use its development proxy.

Images support JPEG, PNG, WebP and GIF up to 10 MB (30 per project). Videos support
MP4 and WebM up to 100 MB (10 per project). Media records stay in PostgreSQL and
files stay in the existing Cloudflare R2 bucket. Removing media removes it from
the public gallery after saving; storage files are retained for existing links.

The companion backend already includes project-media endpoints and the
`1793500000000-ProjectMedia` migration. Run `bun run migration:run:prod` when
deploying that feature for the first time. Its `API_URL` must be browser-accessible,
and `ADMIN_URL` must allow the separate admin app's origin for login and uploads.
Set this website's `MECA_API_BASE_URL` to the backend's public `/mec-api` URL.

Configure the backend's `SITE_REVALIDATE_URL` and `SITE_REVALIDATE_SECRET` to match
this website's `/api/revalidate` and `REVALIDATE_SECRET` for immediate updates.
Without the webhook, saved website content refreshes within 60 seconds.

Admin accounts are managed by the existing backend. To create the owner account,
configure its server-only `SUPERADMIN_EMAIL` and `SUPERADMIN_PASSWORD`, then run
`bun run seed:superadmin` there. Credentials are never included in this website's
source code or browser bundle.

See `.env.example`. The contact form needs at least one delivery channel in production:

- `RESEND_API_KEY` + `CONTACT_FROM_EMAIL` (+ optional `CONTACT_TO_EMAIL`) to email enquiries, and/or
- `MECA_API_BASE_URL` to forward them to the existing Mecatronix backend (`/enquiry/add`).

`ANTHROPIC_API_KEY` powers the MECA assistant. Client-exposed variables must be prefixed with `NEXT_PUBLIC_`; never put secrets in those.

## Redirects

Old routes permanently redirect to the new ones (`next.config.ts`): `/ourworld` → `/about`, `/portfolio` → `/work`, `/openline` → `/contact`.
