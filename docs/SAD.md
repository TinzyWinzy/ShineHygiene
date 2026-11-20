# Shine Hygiene Operations Platform — Solution Architecture Document

| Field | Value |
|---|---|
| Status | Draft for review |
| Version | 0.2 |
| Date | 2026-11-18 |
| Related | `docs/PRD.md`, `docs/UX-DESIGN-BRIEF.md` |
| Current production | `https://www.shinehygiene.co.zw`. Health, leads, and staff APIs verified working. Last merge `1391f0c`. |

## 1. Context

The live product is a Vite 8 and React 19 single-page application with Vercel functions under `api/` and Neon Postgres. It is now the supported product, promoted from bridge status on owner confirmation. It already supports instant quotes, server-side lead persistence, staff sign-in, a quote inbox, and booking confirmation. It remains client-rendered and has no server-rendered surfaces, no ORM, no shared validation library, and no customer tracking flow yet. Gaps are filled in place rather than by replacing the framework.

## 2. Architecture decision

### 2.1 Decision

Promote the existing Vite SPA and its Vercel functions as the supported Shine Hygiene product. Harden and extend them in place. Do not rebuild in Next.js. Keep modular boundaries inside the current codebase. Use Neon Postgres with raw tagged SQL. Use Neon Auth for staff identity. See ADR-006.

### 2.2 Why the promotion

| Concern | Previous plan | Promoted architecture |
|---|---|---|
| Framework | Replace Vite with Next.js | Keep Vite 8 and React 19 |
| Delivery | Full-stack rebuild and cutover | Harden and gap-fill in place |
| Auth | Re-implement in Next.js | Keep Neon Auth and `staff_members` |
| Data | Drizzle ORM and new schema | Keep raw SQL and current migrations |
| Risk | Migration and parity risk | Reuse tested quote engine and production paths |
| SEO | Server rendering | Client rendering accepted for now, open decision |

### 2.3 Alternatives considered

| Alternative | Pros | Cons | Verdict |
|---|---|---|---|
| Next.js App Router rebuild | SSR, server actions, central policy | Discards a tested production app, real migration cost, no verified need | Not adopted |
| Stay on Vite and add a separate BFF (Express or Fastify) | Keeps existing frontend, clear API boundary | Two deployments, two auth systems, duplicate types, more ops work | Rejected |
| Remix or React Router framework | Strong server model, progressive enhancement | Smaller Vercel and Neon integration ecosystem, migration effort similar | Viable, not chosen |
| Laravel or Django plus React | Mature auth and admin ecosystem | Full rewrite of quote domain, splits TypeScript domain and tests, slower | Rejected for this product |
| Supabase (auth, DB, storage) | Fast start, integrated | Ties auth and storage to vendor, existing Neon investment, RLS complexity for ops workflows | Rejected. Retain Neon. |

### 2.4 Consequences

Positive:

- Reuse the quote engine, pricing tests, local draft backup, WhatsApp handoff, and PDF export.
- Keep production paths that are already verified.
- One language and type system across domain, server, and UI.
- Smaller delivery risk than a framework rebuild.

Negative:

- Public pages remain client-rendered. SEO and crawlability are weaker.
- Each operational feature must respect the Vercel function boundary.
- No shared validation library. Validators are hand-written in `api/_lib/lead.ts`.
- No ORM. SQL ownership stays with the team.

## 3. System overview

```text
                          ┌─────────────────────────────────────┐
                          │              Browser                │
                          │   Vite SPA (client-rendered)        │
                          └───────────────┬─────────────────────┘
                                          │ HTTPS
                          ┌───────────────▼─────────────────────┐
                          │        Vercel                       │
                          │  static assets + functions          │
                          │  /api/health, /api/leads            │
                          │  /api/staff-login                   │
                          │  /api/staff-quotes                  │
                          │  /api/staff-bookings                │
                          └───────┬───────────────┬─────────────┘
                                  │               │
                     ┌────────────▼──────┐  ┌─────▼──────────────┐
                     │ Domain + validation│  │ Auth / policy      │
                     │ api/_lib/lead.ts  │  │ Neon Auth + jose   │
                     │ pricing, states    │  │ staff_members      │
                     └────────────┬──────┘  └─────┬──────────────┘
                                  │               │
                     ┌────────────▼───────────────▼─────────────┐
                     │   Neon Postgres via tagged SQL           │
                     │  leads • staff_members • quotes • ...     │
                     └──────────────────────────────────────────┘
```

## 4. Technology choices

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Vite 8 + React 19, client-rendered SPA | Existing production app. Proven quote and lead flows. |
| Language | TypeScript 6 strict | Shared domain types and safer refactors. |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` | Existing design tokens and brand system. |
| Animation | `motion` | Used in the existing UI. |
| PWA | `vite-plugin-pwa` | Installable shell and precached assets. |
| Data | Neon Postgres | Existing investment. Serverless-friendly. |
| Data access | `@neondatabase/serverless` with raw tagged SQL | No ORM. Explicit SQL. |
| Auth | Neon Auth | Managed email and password identity. EdDSA JWTs verified with `jose`. Role and status in `staff_members`. |
| Validation | Hand-written validators in `api/_lib/lead.ts` | No Zod library. Server is authoritative. |
| Email | Not adopted | No email provider is in the app. |
| Files | Not adopted | No private blob storage yet. |
| Rate limit | Not adopted | No distributed rate limiter yet. |
| Errors | Not adopted | No error tracking service yet. Structured logs only. |
| Tests | Vitest, Testing Library, Playwright, axe-core | Unit, component, e2e, accessibility. |
| CI | GitHub Actions | Typecheck, lint, tests, build. |
| Runtime | Node.js 20.19 or newer on Vercel functions | Postgres and auth compatibility. |

Not adopted, recorded rather than removed from consideration:

- **Drizzle ORM and drizzle-kit.** Not used. SQL is written directly against Neon.
- **Better Auth.** Not used. Neon Auth is the adopted identity provider.
- **Resend and React Email.** Not used. No transactional email is sent by the app.
- **Upstash Redis and `@upstash/ratelimit`.** Not used. No distributed rate limiter is in place.
- **Sentry.** Not used. No error tracking service is in place.
- **Radix primitives.** Not used. Components are hand-built.
- **React Hook Form.** Not used. Forms use React state.

## 5. Module boundaries

```text
shinehygiene/
  api/
    _lib/
      lead.ts              server-side lead validation and canonical pricing
      neon-auth.ts          Neon Auth JWT verification and staff lookup
    health.ts              liveness and readiness
    leads.ts               lead submission
    staff-login.ts         staff sign-in
    staff-quotes.ts        quote inbox
    staff-bookings.ts      booking confirmation
  src/
    components/            React UI, including quote verticals and AdminDashboard
    components/quotes/     vertical quote forms
    domain/                quote state and lead submission types
    hooks/                 quote engine, draft backup, online status
    utils/                 pricing, API, PDF, WhatsApp, IDs
    config/                contact details
    types/                 shared types
  db/
    migrations/            001_leads.sql, 002_operations.sql
  scripts/
    migrate.mjs            migration runner
    bootstrap-staff.mjs    owner bootstrap
  tests/                   unit, component, e2e, a11y
```

Rules:

- `src/domain/` has no database, network, React, or environment access. It is deterministic and portable.
- `api/_lib/` holds server-only validation and auth helpers. Vercel deploys `api/` as plain Node ESM, so imports must resolve as Node ESM.
- Client components never import server secrets.
- Public functions validate input and recompute totals. Client totals are display-only.
- Repositories and scoping are not yet separated into a server layer. That is a hardening task.

## 6. Data model

### 6.1 Conventions

- Primary keys, UUID generated by Postgres `gen_random_uuid()`.
- Money, `integer` cents plus `currency`. No floats.
- Timestamps, `timestamptz`, stored UTC. Display in `Africa/Harare`.
- Soft delete only where audit or legal requires it. Otherwise explicit status.
- PII columns are explicitly classified and excluded from logs.
- Migrations are additive, reviewed, and applied by `scripts/migrate.mjs` before code that depends on them.

### 6.2 Implemented tables

| Table | Key fields | Notes |
|---|---|---|
| `leads` | id, client_request_id, reference, vertical, name, phone, preferred_date, preferred_time, params, quote, total_cents, status, source, created_at | Implemented in `001_leads.sql`. |
| `staff_members` | auth_user_id, email, name, role, status, created_at, updated_at | Implemented in `002_operations.sql`. Roles owner, admin, ops, cleaner. |
| `quotes` | id, reference, lead_id, customer_name, customer_phone, vertical, params, quote, total_cents, status, currency, source, created_at, updated_at | Implemented in `002_operations.sql`. Backfilled from leads. |
| `bookings` | id, quote_id, reference, customer_name, customer_phone, vertical, scheduled_date, scheduled_time, status, assigned_staff_auth_user_id, notes, created_at, updated_at | Implemented in `002_operations.sql`. |
| `audit_events` | id, actor_id, action, entity_type, entity_id, payload, created_at | Implemented in `002_operations.sql`. |

### 6.3 Planned entities

The following are described in the PRD and SAD for future work. They are not implemented.

- Customer, Address, LeadNote, Service, ServiceVariant, AddOn, PricingRule, TravelZone.
- QuoteRevision, Job, JobAssignment, JobStatusEvent, ChecklistItem, JobPhoto.
- SupplyOrder, SupplyOrderItem, CatalogItem, InventoryMovement.
- BusinessSettings, BusinessHours, BlackoutDate, OutboxEvent, Notification.
- IdempotencyKey, ReferenceCounter, AuditLog expansion beyond `audit_events`.

### 6.4 Constraints and integrity

- `leads.client_request_id` is unique.
- `leads.reference`, `quotes.reference`, and `bookings.reference` are unique.
- `leads.total_cents`, `quotes.total_cents` are non-negative.
- `leads.vertical` and `quotes.vertical` are restricted to known verticals.
- `leads.status` and `quotes.status` are restricted to known states.
- `bookings.assigned_staff_auth_user_id` references `staff_members(auth_user_id)`.

## 7. Authentication and authorization

### 7.1 Staff authentication

- Email and password accounts provisioned in Neon Auth. The first owner is bootstrapped with `scripts/bootstrap-staff.mjs`.
- A matching `staff_members` row keyed by the Neon Auth user id holds `role` and `status`. Login is denied until that row exists and is active.
- `POST /api/staff-login` exchanges credentials for a Neon Auth JWT. The server-to-server sign-in call sends the Neon Auth base URL as Origin, because the app domain is not a trusted Neon Auth origin.
- Every staff endpoint verifies the JWT with `jose` against the Neon JWKS using EdDSA. Issuer and audience are the Neon Auth origin. The staff row is reloaded on each request.
- No local password hashing and no staff session table. Neon Auth owns the session cookie.
- TOTP and self-service reset are not in the current implementation and must not be described as live.
- No shared staff accounts.
- Failed-login rate limiting is not yet implemented.

### 7.2 Customer authentication

MVP:

- No account required.
- A signed, expiring tracking token is planned but not implemented.
- `/track/[token]` is planned but not implemented.
- Reschedule and cancel requests are planned but not implemented.

Phase 2:

- Magic-link customer accounts remain open. An email provider decision is required.

### 7.3 RBAC

Roles, `owner`, `admin`, `ops`, `cleaner`, `customer`.

Current enforcement:

- `getStaffFromNeonToken` allows only `owner`, `admin`, and `ops` roles.
- Every staff endpoint checks the bearer token and reloads the staff row.
- Cleaner and customer roles are not yet used in the app.

Planned policy module:

- `can(actor, action, resource)` style checks.
- Scope by role in repositories.
- Separation of duties for pricing and refunds.

## 8. State machines

### 8.1 Lead

```text
new -> contacted -> qualified -> quoted -> won
  |        |           |         |
  +--------+-----------+---------+-> lost
```

Current implementation stores `new`, `contacted`, `quoted`, `won`, and `lost`. Transitions are not yet enforced in code.

### 8.2 Quote

```text
draft -> sent -> accepted
  |       |  +-> declined
  |       +-> expired
  +-> cancelled
```

Current implementation stores `new`, `contacted`, `confirmed`, `declined`, and `expired`. The quote inbox treats a quote as confirmable until it is confirmed.

### 8.3 Booking

```text
requested -> confirmed -> completed
      |          |  +-> cancelled
      |          +-> no_show
      +-> declined
```

Current implementation stores `pending`, `confirmed`, `completed`, `cancelled`, and `no_show`. The booking API creates bookings as `confirmed`.

### 8.4 Job

```text
unassigned -> assigned -> accepted -> en_route -> checked_in -> in_progress -> completed -> verified
      |          |           |           |            |             |
      +----------+-----------+-----------+------------+-------------+-> blocked or cancelled
```

Not implemented. No job table exists yet.

### 8.5 Supply order

```text
requested -> confirmed -> preparing -> fulfilled
      |           |           +-> cancelled
      +-> declined
```

Not implemented. No supply order tables exist yet.

## 9. Key flows

### 9.1 Quote pricing and submission

1. The client wizard calculates the quote locally from `src/utils/pricing.ts`.
2. On submit, the client posts the quote state to `POST /api/leads`.
3. `api/_lib/lead.ts` validates every field, checks bounds, recomputes the total from the parameters, and stores the lead in Postgres.
4. The server returns a reference such as `SH-20261117-A1B2C3D4`.
5. If the API fails or the device is offline, the UI keeps the draft and offers retry and WhatsApp handoff.
6. WhatsApp handoff is an explicit customer action. It is never automatic.

The client and server pricing formulas are kept in sync by parity tests.

### 9.2 Lead to booking

1. Staff signs in through `POST /api/staff-login`.
2. Staff loads quotes through `GET /api/staff-quotes`.
3. Staff confirms a booking through `POST /api/staff-bookings`.
4. The API creates a booking, updates the quote status, updates the lead status, and writes an audit event.
5. Staff loads bookings through `GET /api/staff-bookings`.

### 9.3 Assignment conflict prevention

Not yet implemented. The `bookings` table has an optional `assigned_staff_auth_user_id` column, but no exclusion constraint or conflict check exists.

### 9.4 Outbox and notifications

Not implemented. No outbox table or notification worker exists. Email is not sent by the app.

### 9.5 Track link

Not implemented. No tracking token or customer status route exists.

## 10. API and contracts

### 10.1 Implemented route handlers

| Method | Route | Purpose | Protections |
|---|---|---|---|
| GET | `/api/health` | Liveness and readiness | No PII. Minimal detail. |
| POST | `/api/leads` | Validate and store a lead | Server-side validation. Size limit. |
| POST | `/api/staff-login` | Staff sign-in | Credential check. Neon Auth. |
| GET | `/api/staff-quotes` | Quote inbox | Bearer JWT. Staff role. |
| GET | `/api/staff-bookings` | Booking list | Bearer JWT. Staff role. |
| POST | `/api/staff-bookings` | Confirm a booking | Bearer JWT. Staff role. Validation. |

### 10.2 Planned route handlers

These are not implemented. They remain in the PRD and SAD as target contracts.

- `POST /api/public/quotes/price`
- `POST /api/public/bookings`
- `GET /api/public/track/[token]`
- `POST /api/public/track/[token]/requests`
- `POST /api/public/supply-orders`
- `GET /api/webhooks/[provider]`
- `POST /api/cron/outbox`
- `POST /api/cron/retention`

### 10.3 Authenticated mutations

Current mutations are HTTP handlers, not Server Actions. Planned mutations include lead notes, quote conversion, scheduling, assignment, job transitions, pricing changes, staff management, and exports. None of these are implemented beyond booking confirmation.

### 10.4 Response contract

Implemented responses are simple JSON objects with `data` or `error` fields. The typed `Ok` and `Err` envelope from the earlier design is not implemented.

## 11. Validation, idempotency, and money

- Validation lives in `api/_lib/lead.ts`. It checks name, phone, date, time, vertical, params, and bounds.
- The quote state is a discriminated union in TypeScript. Invalid combinations fail before pricing.
- Phone numbers are stored as submitted after basic normalization. E.164 normalization is not implemented.
- Dates are validated against format and a one-year window. Business hours and blackout dates are not enforced server-side.
- Idempotency is not implemented. `client_request_id` is stored but not used to deduplicate.
- All money is integer cents. Domain functions accept and return cents. Formatting is a presentation concern.
- Quote totals are recomputed server-side from the parameters. The client total is never trusted.
- Tax is not implemented. No tax fields exist in the current schema.

## 12. Availability and scheduling

MVP:

- Customer chooses a preferred slot. The request is stored, not confirmed.
- Staff confirms manually through the booking API.
- Business hours and blackout dates are not enforced server-side.
- Capacity rules are not implemented.

Phase 2:

- Real-time availability endpoint.
- Holds that expire.
- Self-serve reschedule.

No route optimization in MVP. Travel zones affect price and scheduling buffers, not sequencing.

## 13. Security and privacy

### 13.1 Threat model highlights

- Spam and abuse of public quote and lead endpoints.
- Enumeration of tracking tokens or customer records.
- Privilege escalation through client-trusted role fields.
- Price tampering or replay.
- IDOR on job photos, exports, and customer records.
- PII leakage through logs, error trackers, URLs, or emails.
- Staff account takeover.
- Malicious file upload.
- Webhook forgery.

### 13.2 Controls

- TLS everywhere. HSTS. Secure cookies where applicable.
- CSP, HSTS, frame denial, referrer policy, no secrets in client bundles.
- Server-side validation and output projection. Database rows are not spread into responses.
- Parameterized queries via `@neondatabase/serverless` tagged templates. No string-built SQL.
- JWT verification and staff role check on every staff endpoint.
- Rate limits are not yet implemented.
- Idempotency is not yet implemented.
- Signed, short-lived URLs for private blobs are not yet implemented.
- Webhook signature verification is not yet implemented.
- Audit log append-only through `audit_events`.
- Secrets in Vercel and Neon only. No `VITE_` secrets. Secret scanning in CI.
- Dependency updates and vulnerability alerts.

### 13.3 Privacy lifecycle

- Collect only what is needed to quote, schedule, and perform the service.
- Consent for marketing is not yet captured separately.
- Privacy notice is not yet linked at the point of collection.
- Retention job is not implemented.
- Subject access and deletion requests are not implemented.
- Providers in use are Vercel and Neon. Email, cache, error tracking, and blob providers are not adopted.
- No customer photos in public marketing without explicit consent.

## 14. Performance and low-bandwidth design

- Public routes are client-rendered. Core content requires JavaScript.
- Client bundle budget, under 200KB gzip initial JS on `/quote`. Enforce in CI.
- No heavy UI or animation libraries beyond `motion`. CSS transitions. Respect reduced motion.
- Quote wizard is a client app. Ops pages are the same client app.
- Draft autosave to `localStorage`. Submission queue only with idempotency in a later phase.
- Service worker caches static shell and assets. It must not cache PII responses.
- Database queries are indexed for inbox and lead paths. Avoid N+1.
- Neon pooled connections. No per-request connection storms.

Budgets:

| Metric | Budget |
|---|---|
| LCP (mobile p75) | Under 2.5s |
| INP (p75) | Under 200ms |
| CLS | Under 0.1 |
| Quote route initial JS | Under 200KB gzip |
| Price endpoint p95 | Under 300ms |
| Ops list p95 | Under 1s |

## 15. Observability and operations

- Structured logs with request ID, route, actor ID, role, latency, status, and error code. No PII.
- Error tracking is not adopted.
- Audit log for privileged actions through `audit_events`. Separate from application logs.
- Metrics, quote funnel, lead submission success, DB latency, 5xx rate. Most are not yet instrumented.
- Alerts are not yet configured.
- Runbooks, rollback, restore, provider outage, compromised account. Not yet written.
- Neon PITR enabled. Restore drill not yet demonstrated.
- Health endpoint checks DB connectivity without exposing secrets.

## 16. Testing and verification

### 16.1 Test layers

| Layer | Scope | Tooling |
|---|---|---|
| Unit | Pricing, quote state, lead submission, phone and date normalization, draft backup | Vitest |
| Component | Quote verticals, summary, errors, admin dashboard | Testing Library |
| E2E | Quote submission, staff login, quote inbox, booking confirmation | Playwright |
| Accessibility | Quote, confirmation, admin flows | axe and manual keyboard and screen reader |
| Performance | Bundle size, API latency | size-limit, Lighthouse |
| Security | Authz matrix, IDOR, rate limits, file upload, webhook signatures | Integration and targeted tests. Mostly planned. |
| Migration | Schema application, backfill counts | Scripted staging rehearsal. Not yet demonstrated. |

Current verified counts, 53 unit tests and 10 e2e tests passing.

### 16.2 Release gates

- Typecheck, lint, unit, e2e, a11y, and build all pass.
- No critical or high dependency vulnerabilities.
- Migration applied and reversible or forward-fix documented.
- Production smoke, `/`, `/quote`, `/api/health`, staff login, quote inbox, booking confirmation.
- Backup restore verified for the release window. Not yet demonstrated.
- Rollback deployment identified.

## 17. In-place hardening and operations

### 17.1 Principles

- No framework rebuild. The Vite SPA and Vercel functions are the product.
- Additive schema changes first. Deploy code that can tolerate both old and new shapes.
- Keep the current production deployment available until a change passes production smoke.
- Preserve SEO and customer links. Redirect old paths if routes are added.
- Keep a rollback window.

### 17.2 Sequence

1. **Baseline:** tag current `main`. Record production deployment and DB schema.
2. **Hardening:** rate limits, idempotency, auth audit, input validation parity, backup and restore drill.
3. **Ops gap filling:** lead detail, status workflow, scheduling, assignment, audit coverage.
4. **Customer status:** signed track link, reschedule and cancel request, honest status language.
5. **Field and supply:** field PWA, checklists, photos, supply requests and inventory.
6. **Scale:** recurring, payments, WhatsApp API, reporting, customer accounts.

### 17.3 Data notes

- Existing `leads` rows are preserved. Map legacy columns to new fields without destructive rewrites.
- Backfill `reference`, `status`, `source`, and timestamps. Do not invent customer accounts.
- Unknown or legacy values go to a quarantine report, not silently dropped.
- Test lead `SH-20261117-0C797B06` and any real leads must be preserved. No cleanup script runs against production without explicit approval.
- `client_request_id` remains unique. Legacy nulls need deterministic backfill or nullable handling.

### 17.4 Rollback

- Keep previous Vercel deployment and database backup or PITR point.
- New schema must be backward-compatible for the rollback window, or rollback includes a forward-fix.
- Rollback triggers, lead submission failure, auth outage, data corruption, conversion drop beyond agreed threshold.
- Document the exact rollback command and owner approval.

## 18. Environments and CI/CD

| Environment | App | Database | Purpose |
|---|---|---|---|
| Local | `vite dev` | Neon dev branch | Development |
| Preview | Vercel preview | Neon preview branch | PR verification |
| Production | Vercel production | Neon production | Live |

- Env vars, `DATABASE_URL` (pooled), `DATABASE_URL_UNPOOLED` (migrations), `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL` (optional).
- No email, cache, blob, or error-tracking secrets are used. None are adopted yet.
- No secret is exposed with `VITE_`.
- CI, install, typecheck, lint, unit, e2e, a11y, build.
- Migrations run as a separate deploy step with the unpooled URL through `scripts/migrate.mjs`. Never from a request handler.
- Node version pinned to 20.19 or newer. Vercel project runtime documented.
- Feature flags for risky flows are not yet implemented.

## 19. Architecture decisions

### ADR-001 — Adopt Next.js App Router as the full-stack target

Status, superseded by ADR-006.

- **Context:** The SPA could not support auth, ops, SEO, and shared server logic without accumulating ad-hoc functions.
- **Alternatives:** stay Vite plus BFF, Remix, Laravel or Django, Supabase.
- **Decision:** Next.js App Router on Vercel, one deployable.
- **Consequences:** framework coupling and server and client discipline. Faster delivery and central policy.
- **Evidence:** current API duplication and missing auth and ops surfaces. Production smoke confirms current scope only.
- **Superseded by:** ADR-006. The Vite SPA and its Vercel functions are the supported product.

### ADR-002 — Use Neon Postgres with Drizzle ORM

Status, not adopted.

- **Context:** Neon is already provisioned and connected. The domain is relational and transactional.
- **Alternatives:** Prisma, raw SQL, Supabase Postgres.
- **Decision:** Drizzle plus explicit SQL migrations. Pooled runtime connection. Unpooled migrations.
- **Consequences:** More SQL ownership. Strong typing and portable Postgres.
- **Not adopted:** The app uses `@neondatabase/serverless` with raw tagged SQL. No ORM is in place.

### ADR-003 — Neon Auth for staff, guest tracking tokens for customers

Status, adopted.

- **Context:** Staff need secure roles. Customers need low-friction status without another password. Neon Auth is provisioned and working in production.
- **Alternatives:** self-hosted Better Auth, Clerk or Auth0, customer passwords, SMS OTP.
- **Decision:** Neon Auth for staff email and password identity. Roles and status held in `staff_members`. EdDSA JWTs verified with `jose` against the Neon JWKS. Signed expiring tracking tokens for guests. Magic-link accounts in Phase 2.
- **Consequences:** Identity is managed by Neon. Server-to-server sign-in must send the Neon Auth origin. Token lifecycle and abuse controls must be tested. No local session table for staff.

### ADR-004 — Transactional outbox for notifications

Status, planned, not implemented.

- **Context:** Email and WhatsApp providers can fail. Losing a confirmation is unacceptable.
- **Alternatives:** send inline, fire-and-forget queue.
- **Decision:** Outbox row in the business transaction. Cron worker with retries and dead letter.
- **Consequences:** Eventual delivery and operational monitoring. No lost confirmations on provider outage.
- **Not implemented:** No outbox table or worker exists. No email is sent by the app.

### ADR-005 — Manual booking confirmation at launch

Status, adopted.

- **Context:** Real-time availability requires trustworthy capacity and staff data that do not yet exist.
- **Alternatives:** instant confirmation, hold and expire.
- **Decision:** Capture preferred slot. Confirm manually. Enforce conflicts at confirmation.
- **Consequences:** Honest customer expectation. Lower technical risk. Ops must respond within SLA.

### ADR-006 — Promote the Vite SPA and its Vercel functions as the supported product

Status, adopted. Supersedes ADR-001.

- **Context:** The Vite SPA, its Vercel functions, and Neon integration are live and verified in production. The quote engine, pricing tests, local draft backup, honest WhatsApp handoff, and PDF export pass 53 unit tests and 10 e2e tests. A Next.js rebuild would discard tested production paths for no verified need.
- **Alternatives:** Next.js App Router rebuild. Stay on Vite plus a separate BFF. Remix. Laravel or Django plus React. Supabase.
- **Decision:** Promote the Vite SPA and its Vercel functions as the supported product. Harden and gap-fill in place. Do not rebuild in Next.js. Record Drizzle, Better Auth, Resend, Upstash, and Sentry as not adopted.
- **Consequences:** Reuse of tested paths and lower delivery risk. Public pages remain client-rendered. SEO and crawlability are weaker. Operational features must respect the Vercel function boundary. No ORM and no shared validation library.

## 20. Open technical questions

1. Exact Neon region and latency to Harare. Confirm with a production-like query test.
2. Whether Vercel Node runtime and Neon pooled connections meet the price endpoint p95 target.
3. WhatsApp Cloud API provider path and template approval timeline.
4. Payment gateway choice and reconciliation model.
5. Whether customer accounts are required at launch by the owner.
6. Final retention periods and legal basis.
7. Staff device mix and field connectivity. Validate the offline queue design.
8. Preserve the current `api/leads` contract. Resolved for now, it is the live contract. Changes require migration planning.
9. Client-rendered SEO. Resolved by promotion as the current architecture. Remains open if the owner requires server rendering.
10. Email provider. No email provider is adopted. Required for magic-link accounts and notifications.
11. Rate limiting and abuse control. No rate limiter is adopted. Confirm approach and thresholds.
12. Private file storage. No blob provider is adopted. Required for job photos and exports.
13. Error tracking. No service is adopted. Confirm need and provider.
