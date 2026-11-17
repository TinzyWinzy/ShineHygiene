# Shine Hygiene Solutions — Quote PWA

Instant multi-vertical cleaning quote engine for commercial, residential, office, car detailing, and HygieneMart wholesale orders in Harare, Zimbabwe.

## Stack

- **Vite 8** + **React 19** + **TypeScript 6** (strict)
- **Tailwind CSS v4** with custom brand tokens
- **vite-plugin-pwa** — service worker, manifest, offline asset cache
- **Vitest** + **Testing Library** for unit/component tests
- **Playwright** + **axe-core** for browser and accessibility gates
- **Vercel** — static deployment with SPA rewrites

## Features

- **5 Vertical Quote Engine** — Commercial, Residential, Office, Car, HygieneMart
- **Instant Pricing** — reactive calculations from a single typed state machine
- **WhatsApp Handoff** — the customer explicitly sends the pre-filled quote to sales
- **PDF Export** — print-to-PDF with a branded, escaped layout
- **Local Drafts** — quotes are saved on the device (`localStorage`) until the customer sends or deletes them
- **PWA** — installable shell and precached assets

## Honest submission behaviour

Submitting the booking form does **not** transmit data to a server. It saves a draft on the device and shows the quote. The customer then chooses **Send via WhatsApp** or **Download PDF**. Do not describe this as a confirmed booking, a sent email, or a queued upload.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run typecheck
npm run lint
npm test          # Vitest unit + component tests
npm run test:e2e  # Playwright desktop + mobile, includes axe checks
npm run build
```

CI (`.github/workflows/ci.yml`) runs all of the above on every push and pull request to `main`.

## Deploy

Connect the repo to Vercel. `vercel.json` handles SPA routing, the generated `sw.js` cache header, and immutable asset caching.

## Brand tokens

- Primary: `#118bce` (preserved brand colour)
- Accessible ink: `#0e6d9c` (WCAG AA with white: 5.7:1) — used for readable text and solid/gradient controls
- Dark: `#033f77`
- Light: `#e0f0ff`
- Background: `#fafbfc`
- Subtext: `#1f2937`

`#118bce` is kept for identity accents, icons, borders, and decorative gradients. Text and filled controls that must meet AA use `brand-ink`, because `#118bce` on white is 3.7:1.
