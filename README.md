# Shine Hygiene Solutions — PWA

Instant multi-vertical cleaning quote engine for commercial, residential, office, car detailing, and HygieneMart wholesale orders in Harare, Zimbabwe.

## Stack

- **Vite 8** + **React 19** + **TypeScript 6**
- **Tailwind CSS v4** with custom brand tokens
- **vite-plugin-pwa** — service worker, manifest, offline cache
- **Vercel** — edge deployment with SPA rewrites

## Features

- **5 Vertical Quote Engine** — Commercial, Residential, Office, Car, HygieneMart
- **Instant Pricing** — Sub-50ms reactive calculations
- **WhatsApp Deep Linking** — Pre-filled lead messages to sales
- **PDF Export** — Print-to-PDF with branded layout
- **Offline Queue** — localStorage persistence with auto-flush on reconnect
- **PWA** — Installable, offline-capable, auto-updating service worker

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Connect the repo to Vercel. The `vercel.json` handles SPA routing and SW caching headers.

## Brand

- Primary: `#118bce`
- Dark: `#033f77`
- Background: `#ffffff`
- Subtext: `#000000`
