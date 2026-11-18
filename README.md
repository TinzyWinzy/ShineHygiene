# Shine Hygiene Solutions — Quote PWA

Instant multi-vertical cleaning quote engine for commercial, residential, office, car detailing, and HygieneMart wholesale orders in Harare, Zimbabwe.

## Product and architecture direction

This SPA is the validated quote/lead bridge, not the target product. The full-stack rebuild is defined in:

- [`docs/PRD.md`](docs/PRD.md) — users, journeys, scope, requirements, permissions, metrics.
- [`docs/SAD.md`](docs/SAD.md) — Next.js architecture, data model, auth/RBAC, migration and cutover.
- [`docs/UX-DESIGN-BRIEF.md`](docs/UX-DESIGN-BRIEF.md) — brand direction, UX laws, flows and visual system.

Do not add new operational features to this SPA. New product work lands in the full-stack app after the cutover defined in the SAD.

## Stack

- **Vite 8** + **React 19** + **TypeScript 6** (strict)
- **Tailwind CSS v4** with custom brand tokens
- **vite-plugin-pwa** — service worker, manifest, offline asset cache
- **Vercel Function** (`api/leads.ts`) + **Neon Postgres** — server-side lead storage
- **Vitest** + **Testing Library** for unit/component tests
- **Playwright** + **axe-core** for browser and accessibility gates

## Features

- **5 Vertical Quote Engine** — Commercial, Residential, Office, Car, HygieneMart
- **Instant Pricing** — reactive calculations from a single typed state machine
- **Server-saved leads** — the API validates the request and recomputes the quote
- **WhatsApp Handoff** — the customer explicitly sends the pre-filled quote to sales
- **PDF Export** — print-to-PDF with a branded, escaped layout
- **Local backup** — a draft is written to `localStorage` before the network call
- **PWA** — installable shell and precached assets

## Submission behaviour

1. The form saves a draft on the device first.
2. If online, it `POST`s to `/api/leads`. The server validates every field, checks business bounds, recomputes the total from the parameters, and stores the lead in Postgres.
3. Only a confirmed `201`/`200` shows a reference such as `SH-20261117-A1B2C3D4`.
4. If the API fails or the device is offline, the UI says the request was not sent, keeps the draft, and offers **Try again** and **Send via WhatsApp**.
5. **Send via WhatsApp** is an explicit customer action and marks the draft as handed off. It is never automatic.

Do not describe a locally saved draft as a confirmed booking or a sent email.

## Database

The schema lives in `db/migrations/001_leads.sql`.

```bash
# Pull the Vercel project's environment variables into .env.local first.
vercel env pull .env.local
npm run db:migrate
```

Required environment variable: `DATABASE_URL` (pooled). The migration script prefers `DATABASE_URL_UNPOOLED` when present.

Local `.env.local` is gitignored. Never expose `DATABASE_URL` to the browser or prefix it with `VITE_`.

Leads are visible in the Neon resource attached to the Vercel project (`nexus-agronomics/shine-hygiene`). Example review query:

```sql
select reference, created_at, vertical, name, phone, total_cents, status
from leads
order by created_at desc
limit 50;
```

## Development

```bash
npm install
npm run dev
npm run db:migrate   # after vercel env pull
```

## Staff access (back office)

Neon Auth must be provisioned for the project (`NEON_AUTH_BASE_URL` must be a real URL, not `provisioning`). Then:

1. Create the first user through Neon Auth (email/password).
2. Insert a matching row in `staff_members` with that user's `auth_user_id` (uuid), email, name, and role (`owner`, `admin`, or `ops`).
3. Or run `node --env-file=.env.local scripts/bootstrap-staff.mjs <email> <password> "<name>" [role]` to create the user and staff row in one step.
4. Sign in via the "Back office" button using the same email/password.

Until a `staff_members` row exists for the authenticated user, login returns `staff_access_required`.

## Health check

`GET /api/health` reports database connectivity. Returns `200 { status: "ok", db: "ok" }` or `503` when degraded.

## Verification

```bash
npm run typecheck
npm run lint
npm test          # Vitest unit + component tests
npm run test:e2e  # Playwright desktop + mobile, includes axe checks
npm run build
```

CI (`.github/workflows/ci.yml`) runs all of the above on every push and pull request to `main`. CI does not run migrations or touch production data.

## Deploy

The Vercel project is linked to `TinzyWinzy/ShineHygiene` with production branch `main`. Pushing to `main` creates the production deployment. `vercel.json` handles cache headers; the SPA has no client-side router, so no catch-all rewrite is needed and `/api/*` stays a function route.

## Brand tokens

- Primary: `#118bce` (preserved brand colour)
- Accessible ink: `#0e6d9c` (WCAG AA with white: 5.7:1) — used for readable text and solid/gradient controls
- Dark: `#033f77`
- Light: `#e0f0ff`
- Background: `#fafbfc`
- Subtext: `#1f2937`

`#118bce` is kept for identity accents, icons, borders, and decorative gradients. Text and filled controls that must meet AA use `brand-ink`, because `#118bce` on white is 3.7:1.
