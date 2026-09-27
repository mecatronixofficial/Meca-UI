# Mecatronix — Next.js

This project is built with [Next.js](https://nextjs.org) (App Router) and Tailwind CSS v4.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint the project
- `npm run typecheck` — type-check without emitting

## Environment variables

Client-exposed environment variables must be prefixed with `NEXT_PUBLIC_` (see `src/config/envConfig.ts` and `src/api/api.ts` for the variables read at runtime).
