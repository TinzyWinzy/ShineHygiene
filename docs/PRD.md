# Shine Hygiene Operations Platform — Product Requirements Document

| Field | Value |
|---|---|
| Status | Draft for review |
| Version | 0.1 |
| Date | 2026-11-17 |
| Owner | Tinotenda Brandon Duma |
| Product | Shine Hygiene customer booking + operations platform |
| Supersedes | Vite SPA + single lead endpoint as the target architecture |

## 1. Executive summary

Shine Hygiene already has a working instant-quote experience and a live lead endpoint backed by Neon. That proves demand capture, but it is not an operating system for the business. Customers can request a price; Shine staff cannot log in, triage leads, convert quotes, schedule work, assign cleaners, track job completion, manage supplies, or give customers a reliable status view.

This PRD defines a **proper full-stack product**: a server-rendered public site, an authenticated operations console, a customer tracking experience, and a field workflow for cleaners. The first release must replace manual WhatsApp/spreadsheet coordination for the core path:

**Enquiry → quote → confirmed booking → assigned job → completed job → follow-up.**

The existing Vite SPA remains live only as a bridge. It is not extended into the target product.

## 2. Problem and opportunity

### 2.1 Problem

Shine Hygiene’s commercial flow is fragmented across social posts, phone calls, WhatsApp, memory, and ad-hoc records. The current website can calculate a price and store a lead, but it cannot answer the questions that determine revenue and service quality:

- Which leads are new, contacted, quoted, or lost?
- Which quote became a booking?
- Who is cleaning which site, when, and with what instructions?
- Did the cleaner arrive, finish, and document the work?
- Which customer needs a follow-up, rebooking, or supply order?
- What is outstanding, what was collected, and what is recurring?

### 2.2 Opportunity

A focused operations platform can:

- Increase quote-to-booking conversion by responding while intent is high.
- Reduce missed and double-booked jobs.
- Reduce owner/coordinator admin time per booking.
- Create a reliable service record for disputes and repeat business.
- Turn one-off cleaning into recurring contracts and supply orders.
- Build a defensible local brand with real proof: response times, completed jobs, before/after evidence, reviews.

### 2.3 Evidence status

| Claim | Label | Basis |
|---|---|---|
| Shine offers residential, commercial, office, car cleaning, and hygiene supplies | VERIFIED FACT | Supplied Facebook copy and current quote verticals |
| Shine operates in Harare and is closed on Sundays | VERIFIED FACT | Current site copy and supplied post: “Sunday is not a cleaning day” |
| Customers can get an instant quote today | VERIFIED FACT | Live production app |
| Leads are persisted in Neon | VERIFIED FACT | `POST /api/leads`, production smoke test |
| Staff currently coordinate manually | HYPOTHESIS | No admin UI exists; operational process not observed |
| Most customers prefer WhatsApp and mobile | HYPOTHESIS | Zimbabwe market pattern; validate with analytics and call logs |
| Customers will book without speaking to a person | HYPOTHESIS | Current quote completion data is not yet instrumented |
| Typical job value, volume, and staff count | UNKNOWN | Requires owner input and historical records |

## 3. Goals and non-goals

### 3.1 Goals

1. Let a customer get an accurate quote and request a booking in under 90 seconds on a low-end Android phone.
2. Give Shine staff one place to manage every lead, quote, booking, job, and customer.
3. Prevent double booking and lost requests through explicit state and assignment.
4. Give customers a trustworthy status link without requiring an account.
5. Give cleaners a simple mobile job view with checklist and completion evidence.
6. Preserve a complete audit trail for price changes, status changes, and customer data access.
7. Establish a foundation for recurring contracts, supply orders, and payments without rebuilding.

### 3.2 Non-goals for the first release

- Full accounting, general ledger, payroll, or tax filing.
- Route optimization or fleet telematics.
- Multi-branch franchising.
- AI chat agents or automated pricing negotiation.
- A native iOS/Android app.
- Marketplace onboarding of third-party cleaners.
- Fully automated WhatsApp two-way conversations. MVP uses click-to-chat and email; Cloud API is a later phase.

## 4. Users and jobs to be done

### 4.1 Household customer — “Tariro”

- **Context:** Mobile phone, often on WhatsApp, intermittent data, price-sensitive, may be booking on behalf of a family.
- **Job to be done:** “Help me understand what a proper clean costs and get someone trustworthy into my home without a long sales call.”
- **Decisions:** Which service? Is the price fair? Can they come when I am available? Can I trust them with my home?
- **Needs:** Clear inclusions, no hidden fees, fast response, a real person to contact, easy reschedule.

### 4.2 Commercial/office buyer — “Farai”

- **Context:** Office manager or SME owner, desktop and mobile, needs recurring service and an invoice trail.
- **Job to be done:** “Keep the office consistently clean without me chasing providers or justifying the spend.”
- **Decisions:** Can they cover our schedule? Are they insured and reliable? Who supervises? What does it cost per month?
- **Needs:** Recurring schedule, named supervisor, service record, quote/invoice documents, escalation path.

### 4.3 Operations coordinator — “Rudo”

- **Context:** Desktop during work hours, phone after hours; manages multiple conversations and a changing schedule.
- **Job to be done:** “Turn enquiries into confirmed, staffed jobs without anything falling through.”
- **Decisions:** Who do I call first? What is this lead worth? Which cleaner is free? Does this quote need approval? Is the job complete?
- **Needs:** Prioritised inbox, fast quote conversion, conflict-aware scheduling, assignment, reminders, exception flags.

### 4.4 Cleaner — “Blessing”

- **Context:** Android phone, gloves, moving between sites, low bandwidth, limited patience for forms.
- **Job to be done:** “Tell me where to go, what to do, and let me prove I finished.”
- **Decisions:** Where is the next job? What is included? What do I do if something is broken or missing?
- **Needs:** Today view, one-tap call/navigate, checklist, photo capture, issue report, offline tolerance.

### 4.5 Owner — “Shine”

- **Context:** Accountable for cash, quality, reputation, and pricing.
- **Job to be done:** “See what is selling, what is outstanding, and where the business is leaking.”
- **Decisions:** Are we pricing correctly? Which leads are ignored? Which staff/customers need attention? What is recurring revenue?
- **Needs:** Dashboard, exceptions, pricing control, audit, exports.

## 5. Product principles and UX theory

The interface must reduce cognitive load, not decorate it. These principles are requirements, not suggestions.

| Principle / law | Product application |
|---|---|
| Hick’s law | Five service choices maximum at the first step; advanced options hidden until needed. |
| Miller’s law | Quote is chunked into 4 short steps; a persistent summary carries context. |
| Progressive disclosure | Price-affecting detail appears only after service selection; operational complexity stays in the ops console. |
| Fitts’s law | Primary actions are full-width on mobile, at least 48px tall, in the thumb zone; sticky total/continue bar. |
| Jakob’s law | Use familiar booking patterns: stepper, calendar, summary, confirmation, reference number. |
| Doherty threshold | Local price updates under 100ms; server verification before submit; visible saving/submitting states. |
| Tesler’s law | The system absorbs pricing rules, travel zones, discounts, and availability complexity. The customer sees a simple number and a clear breakdown. |
| Von Restorff effect | One primary CTA per screen; brand blue reserved for action, not decoration. |
| Peak-end rule | The confirmation screen is calm, specific, and actionable: reference, what happens next, who to contact, track link. |
| Aesthetic-usability effect | Real staff photography, generous whitespace, consistent cards; no stock-photo gloss that undermines trust. |
| Gestalt proximity/common region | Price breakdown, inclusions, and schedule are grouped; unrelated fields never share a card. |
| Error prevention | Sundays disabled; phone normalized; dates constrained; double-submit blocked by idempotency; inline validation. |
| Recognition over recall | Saved draft, visible selections, back navigation without data loss. |
| Trust and honesty | No fake scarcity, no countdown timers, no “confirmed” before staff confirmation. Status language must match reality. |

## 6. Information architecture

### 6.1 Public

- `/` — positioning, service selector, proof, how it works, service area, contact.
- `/quote` — four-step quote and booking request.
- `/services/[slug]` — SEO pages for residential, commercial, office, car, supplies.
- `/hygienemart` — supply catalog and order request.
- `/track/[token]` — customer status, appointment details, reschedule/cancel request.
- `/about`, `/contact`, `/privacy`, `/terms`.

### 6.2 Customer account (Phase 2)

- `/account` — upcoming and past bookings, quotes, supply orders, saved addresses.

### 6.3 Operations console

- `/ops` — today, exceptions, new leads, unassigned jobs.
- `/ops/leads` — inbox and lead detail.
- `/ops/quotes` — quote list, builder, revisions, acceptance.
- `/ops/bookings` — booking requests and confirmations.
- `/ops/schedule` — day/week capacity and assignments.
- `/ops/jobs` — job board and job detail.
- `/ops/customers` — customer timeline and addresses.
- `/ops/staff` — staff, skills, availability.
- `/ops/catalog` — services, add-ons, pricing rules, travel zones.
- `/ops/supplies` — HygieneMart orders and inventory.
- `/ops/reports` — conversion, revenue, utilisation, repeat rate.
- `/ops/settings` — hours, blackout dates, contact numbers, templates.

### 6.4 Field

- `/field` — today’s assigned jobs.
- `/field/jobs/[id]` — address, contact, checklist, photos, issue report, complete.

## 7. Core journeys

### Journey A — Anonymous quote to booking request

1. Customer lands from Facebook/WhatsApp on a mobile page.
2. Selects service (residential, commercial, office, car, supplies).
3. Answers only the questions that change the price.
4. Sees a live total with inclusions and a plain-language breakdown.
5. Chooses a preferred date/time. Sunday is unavailable.
6. Enters name, phone, optional email, address/service area.
7. Reviews and submits once.
8. Receives a reference and a track link; sees “Request received — we will confirm within business hours.”
9. Staff sees the lead immediately; customer status changes only when staff confirms.

**Failure handling:** network loss preserves the draft; retry uses the same idempotency key; duplicate submissions return the original reference; server rejection shows a correctable message, never a dead end.

### Journey B — Lead to completed job (operations)

1. Coordinator opens the inbox sorted by age and value.
2. Reviews lead, calls/WhatsApps, records outcome.
3. Converts to a quote with prefilled service and pricing.
4. Adjusts only permitted items; any override requires a reason.
5. Sends quote; customer accepts verbally or via link.
6. Coordinator confirms booking and picks a slot with capacity.
7. Assigns a cleaner/team; conflict check blocks double booking.
8. Cleaner sees the job, checks in, completes checklist, uploads photos, notes issues.
9. Coordinator verifies completion and closes the job.
10. Customer receives completion/follow-up; rebooking prompt is created.

### Journey C — Commercial recurring enquiry

1. Buyer requests recurring cleaning for an office.
2. Coordinator captures frequency, area, access constraints, and decision-maker.
3. Quote shows per-visit and monthly equivalent; terms are explicit.
4. On acceptance, a recurring booking creates future jobs.
5. Each visit is tracked separately; monthly summary is available.

### Journey D — Supply order

1. Customer selects HygieneMart items.
2. Order request captures quantity, delivery area, and contact.
3. Staff confirms stock and delivery cost before commitment.
4. Order status is visible; inventory is decremented only on fulfilment.

### Journey E — Reschedule or cancel

1. Customer opens the track link.
2. Requests a new date/time or cancellation with a reason.
3. Request enters an ops queue; the original slot is not silently released until staff acts.
4. Customer sees “requested,” then “confirmed” or “declined” with an alternative.

### Journey F — Cleaner’s day

1. Cleaner opens `/field` on mobile.
2. Sees today’s jobs in time order with location and status.
3. Taps navigate/call; checks in on arrival.
4. Works through a short checklist; captures before/after photos.
5. Reports an issue (missing supply, damage, access failure).
6. Marks complete; coordinator is notified.
7. If offline, actions queue locally and sync with conflict detection.

## 8. User stories and acceptance criteria

Priority: **P0** = first release, **P1** = next, **P2** = later.

### Customer stories

| ID | Story | Priority | Acceptance criteria |
|---|---|---|---|
| US-01 | As a customer, I want an instant quote without creating an account so I can decide quickly. | P0 | Quote completes on a 360px viewport; no login; total visible before contact details; draft survives refresh. |
| US-02 | As a customer, I want to understand what the price includes so I can trust it. | P0 | Itemised breakdown, inclusions, frequency discount, travel fee (if any), and “no obligation” statement are visible before submit. |
| US-03 | As a customer, I want to request a date and time that suits me. | P0 | Date/time selection; Sundays blocked; past dates blocked; request is explicitly “pending confirmation,” not “booked.” |
| US-04 | As a customer, I want confirmation I can keep. | P0 | On success: reference, summary, track link, contact numbers, and next-step expectation. |
| US-05 | As a customer, I want to check progress without an account. | P0 | Signed track link shows status timeline and appointment details; expired/invalid token gives a safe recovery path. |
| US-06 | As a customer, I want to reschedule or cancel without a phone argument. | P1 | Request form creates an ops task; customer sees requested/confirmed/declined; no silent cancellation. |
| US-07 | As a customer, I want to order supplies and know if they are in stock. | P1 | Catalog shows price and availability status; order request is confirmed by staff before payment/fulfilment. |
| US-08 | As a customer, I want to rebook a previous service. | P1 | Track/account page offers “book again” with prior selections prefilled. |
| US-09 | As a customer, I want to use WhatsApp when that is easier. | P0 | WhatsApp click-to-chat includes the reference and a prefilled message; number is correct for the brand. |

### Operations stories

| ID | Story | Priority | Acceptance criteria |
|---|---|---|---|
| US-10 | As a coordinator, I want a prioritised lead inbox so no enquiry is missed. | P0 | Leads show age, service, value, source, status, assignee; filters and sorting; uncontacted leads highlighted. |
| US-11 | As a coordinator, I want to record contact attempts and outcomes. | P0 | Notes, call/WhatsApp outcome, next follow-up date; timeline is immutable and attributed. |
| US-12 | As a coordinator, I want to convert a lead into a quote without re-entering data. | P0 | One action creates a draft quote with prefilled customer/service/pricing; source lead is linked. |
| US-13 | As a coordinator, I want to adjust a quote safely. | P0 | Only permitted fields editable; discounts/overrides require reason; totals recomputed server-side; revision is auditable. |
| US-14 | As a coordinator, I want to confirm a booking and assign staff without double booking. | P0 | Slot capacity enforced in a transaction; assignment conflict blocks save with a clear message; confirmation notifies customer. |
| US-15 | As a coordinator, I want to see today’s exceptions. | P0 | Dashboard shows unassigned jobs, late starts, incomplete jobs, uncontacted leads, and pending reschedules. |
| US-16 | As a coordinator, I want customer history in one place. | P0 | Customer record shows leads, quotes, bookings, jobs, notes, contact preferences, and lifetime value. |
| US-17 | As an owner, I want to control pricing and discounts. | P0 | Pricing rules are owner-only; changes are versioned; quotes retain the pricing version used. |
| US-18 | As an owner, I want to see conversion and utilisation. | P1 | Report shows lead→quote→booking conversion, average job value, staff utilisation, repeat rate, and date filters. |
| US-19 | As an owner, I want to export customer and job data. | P1 | Export is permissioned, logged, and excludes secrets; CSV download expires. |
| US-20 | As an owner, I want to manage business hours and blackout dates. | P0 | Sunday closed by default; holidays/blackouts block new requests; changes are audited. |

### Field stories

| ID | Story | Priority | Acceptance criteria |
|---|---|---|---|
| US-21 | As a cleaner, I want my day’s jobs on my phone. | P0 | Mobile-first list; today’s jobs in time order; works on slow connection; no desktop-only controls. |
| US-22 | As a cleaner, I want to check in and out. | P0 | Check-in records timestamp/location (with consent); check-out requires checklist completion or an explicit reason. |
| US-23 | As a cleaner, I want to document work. | P0 | Before/after photos upload with retry; size/type limits; private storage; signed access only. |
| US-24 | As a cleaner, I want to report a problem. | P0 | Issue types (access, supply, damage, safety, other); photo/note; coordinator notified; job can be blocked without losing data. |
| US-25 | As a cleaner, I want to work through intermittent connectivity. | P1 | Queued actions sync idempotently; conflicts surfaced; no duplicate completion or photo records. |

### Platform stories

| ID | Story | Priority | Acceptance criteria |
|---|---|---|---|
| US-26 | As a staff member, I want secure sign-in and role-appropriate access. | P0 | Invite-only accounts; password + TOTP for owner/admin; server-side RBAC; session revocation; failed-login rate limit. |
| US-27 | As an auditor, I want to know who changed what. | P0 | Audit entries for price, status, assignment, permission, export, and deletion; actor, timestamp, before/after. |
| US-28 | As a data subject, I want my data handled lawfully. | P0 | Privacy notice at collection; purpose/retention stated; deletion request workflow; no PII in logs or URLs. |
| US-29 | As the business, I want spam and abuse controlled. | P0 | Rate limits on quote/lead/track/login; honeypot or equivalent; idempotency; alerts on abuse spikes. |
| US-30 | As the business, I want the public site to rank and load fast. | P0 | Server-rendered content, metadata, sitemap, structured data; LCP <2.5s on mobile 4G; indexable service pages. |

## 9. Scope

### 9.1 MVP (P0)

- Next.js full-stack application with server-rendered marketing and quote.
- Four-step quote + booking request with server-verified pricing.
- Lead persistence, idempotency, reference, signed track link.
- Staff auth, RBAC, invite flow, audit log.
- Ops dashboard, lead inbox, lead detail, quote conversion, booking confirmation, job scheduling, staff assignment.
- Customer status page and reschedule/cancel request.
- Email confirmation and internal notification; WhatsApp click-to-chat.
- Service catalog and pricing rules with versioning.
- Business hours/blackouts; Sunday closed.
- Basic reports: pipeline, today, conversion.
- Privacy page, retention policy, rate limits, backups.

### 9.2 Phase 2 (P1)

- Customer accounts (magic link), saved addresses, rebooking.
- Real-time availability and self-serve reschedule.
- Cleaner field PWA with offline queue, checklists, photos, issues.
- HygieneMart catalog, order requests, stock movements.
- Recurring bookings and commercial contracts.
- WhatsApp Business Cloud API templates and delivery status.
- Invoice/receipt documents and payment status (manual first).
- Advanced reports and exports.

### 9.3 Phase 3 (P2)

- Online deposits/payments (EcoCash/Paynow/card as available).
- Route optimization, teams, equipment tracking.
- Review collection and referral tracking.
- Multi-branch, franchise, or multi-tenant operation.
- Accounting integration.

### 9.4 Explicitly out

- Payroll, full ledger, tax filing, procurement ERP.
- Native mobile apps.
- Automated price negotiation or AI dispatcher.
- Third-party cleaner marketplace.

## 10. Data model summary

Full schema is in the SAD. Core entities:

- **User** — staff/customer identity, role, status, MFA.
- **Customer** — person or company, billing details, consent, owner.
- **Address** — service location, access notes, geo, zone.
- **Lead** — enquiry, source, status, assignee, value, conversion links.
- **Service / ServiceVariant / AddOn / PricingRule / TravelZone** — sellable catalog and deterministic pricing.
- **Quote / QuoteRevision** — immutable pricing snapshot, totals, status, acceptance.
- **Booking** — confirmed commercial commitment, slot, customer, quote.
- **Job / JobAssignment / JobStatusEvent / ChecklistItem / JobPhoto** — execution and evidence.
- **SupplyOrder / SupplyOrderItem / CatalogItem / InventoryMovement** — HygieneMart.
- **Notification / OutboxEvent** — reliable delivery with retries.
- **AuditLog** — actor, action, entity, before/after, request ID.
- **BusinessSettings / BusinessHours / BlackoutDate** — operating rules.
- **IdempotencyKey** — safe retries.

Money is stored as integer minor units (cents), never floating point. Currency is explicit. Quote totals are always recomputed server-side from the pricing version; client totals are display-only until verified.

## 11. Permission model

| Capability | Owner | Ops | Cleaner | Customer | Anonymous |
|---|---|---|---|---|---|
| View public catalog | Yes | Yes | Yes | Yes | Yes |
| Create lead/quote request | Yes | Yes | No | Yes | Yes |
| View all leads | Yes | Yes | No | No | No |
| Convert lead to quote | Yes | Yes | No | No | No |
| Override price/discount | Yes | Approval only | No | No | No |
| Change pricing rules | Yes | No | No | No | No |
| Confirm booking | Yes | Yes | No | No | No |
| Assign staff | Yes | Yes | No | No | No |
| View assigned job | Yes | Yes | Own only | Own only | No |
| Complete checklist/photos | Yes | Yes | Assigned only | No | No |
| View customer PII | Yes | Yes | Job-relevant only | Own only | No |
| Export data | Yes | No | No | Own only | No |
| Manage users/roles | Yes | No | No | No | No |
| View audit log | Yes | Limited | No | No | No |

Separation of duties:

- Pricing changes and refunds are owner-only.
- Ops can apply an approved discount within a threshold; anything above threshold requires owner approval recorded in the audit log.
- Cleaners cannot alter price, assignment, or customer records beyond job notes/photos.
- Customer data access is scoped in server repositories, not only hidden in the UI.

## 12. Non-functional requirements

### 12.1 Performance and resilience

- LCP < 2.5s, INP < 200ms, CLS < 0.1 on a mid-range Android over 4G.
- Initial client JS < 200KB gzip for public quote route; no heavy animation library.
- Quote total recalculates locally in <100ms; server verification <300ms p95.
- Public pages render without client JavaScript for core content.
- Draft survives refresh, tab close, and network loss.
- Submission is idempotent; retries never create duplicate leads/bookings.
- Graceful degradation: if email/WhatsApp provider is down, the lead is still stored and visible in ops.

### 12.2 Security

- OWASP ASVS-aligned controls; server-side authorization on every mutation.
- Zod validation at every trust boundary; parameterized SQL via ORM.
- HttpOnly, Secure, SameSite cookies; session rotation; MFA for privileged roles.
- Rate limits on public quote, lead, track, login, and password reset.
- CSP, HSTS, frame denial, referrer policy, no secrets in client bundles.
- Signed, expiring URLs for job photos and exports.
- PII excluded from logs, analytics, URLs, and error reports.
- Dependency and secret scanning in CI.

### 12.3 Privacy and compliance

- Zimbabwe Cyber and Data Protection Act 2021 principles: lawful purpose, minimization, consent, security, retention, subject access/deletion.
- Privacy notice at the point of collection, not buried in the footer.
- Retention: leads/quotes not converted — 24 months; customer/job records — 7 years where financial/legal need exists; marketing consent separate. Final values require owner/legal confirmation.
- Deletion request workflow with legal-hold exception and audit.
- Data processing locations and providers documented.

### 12.4 Accessibility

- WCAG 2.2 AA.
- Keyboard-complete quote and ops flows.
- Visible focus, labelled inputs, error summaries, 4.5:1 text contrast.
- No color-only status; status text + icon.
- Respect `prefers-reduced-motion`.
- Screen-reader tested on quote, confirmation, track, and job completion.

### 12.5 Observability

- Structured logs with request ID, route, actor ID (not PII), latency, outcome.
- Error tracking with release and trace IDs.
- Audit log for privileged actions.
- Uptime checks for `/`, `/quote`, `/api/health`, `/ops`.
- Alerts: 5xx spike, lead submission failure, outbox backlog, DB connection saturation, cron failure.
- Neon backup/PITR enabled; restore drill documented.

## 13. Success metrics

Targets are hypotheses until a baseline is measured.

| Metric | Target | Instrumentation |
|---|---|---|
| Quote completion rate | ≥55% of started quotes | Funnel events |
| Median time to quote | <90s | Client + server timestamps |
| Lead response time (business hours) | <15 min | Lead contact timestamp |
| Quote→booking conversion | ≥30% | Quote/booking states |
| Double bookings | 0 | Constraint violations + audit |
| Ops admin time per booking | <5 min | Task timestamps (manual baseline first) |
| Job completion with evidence | ≥95% | Checklist/photo records |
| No-show/cancellation | <10% | Booking status |
| Repeat/recurring share | Increase quarterly | Customer history |
| Public LCP (mobile) | <2.5s p75 | RUM |
| Critical/serious a11y issues | 0 | Automated + manual audit |
| Lead persistence success | ≥99.5% | API/outbox metrics |

## 14. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Scope expands into a full ERP | Delay, unfinished core | Enforce MVP boundary; phase gates; owner sign-off for additions |
| Pricing rules diverge between client and server | Wrong quotes, disputes | Single domain module; parity/property tests; server verification; versioned snapshots |
| Double booking or lost reschedule | Reputational damage | DB constraints, transactions, explicit state machine, ops queue |
| Staff do not adopt the console | Fallback to WhatsApp | Mobile-first ops, fast lead actions, training, measure time saved |
| WhatsApp API approval/delay | Notification gap | Email + click-to-chat fallback; provider abstraction |
| Stale PWA/service worker serves old SPA | Broken migration | Versioned cache, self-destructing worker, cutover test |
| PII breach or unlawful retention | Legal/reputational harm | Minimization, RBAC, audit, retention job, privacy review |
| Free-tier limits or cost spikes | Outage | Usage alerts, budget, Neon/Vercel plan review before launch |
| Payment integration uncertainty | Delayed revenue collection | Manual payment status in MVP; gateway in Phase 3 |
| Phone/contact data conflict | Customer confusion | Central settings; verify numbers with owner before launch |

## 15. Delivery sequence

Indicative for one experienced full-stack developer; validate after a technical spike.

| Stage | Scope | Exit criteria |
|---|---|---|
| 0. Decisions | PRD, SAD, design brief, open decisions | Owner approves scope and architecture |
| 1. Foundation | Next.js scaffold, design tokens, domain port, Drizzle schema, auth, CI | Staging deploy; quote parity tests; auth/RBAC tests |
| 2. Public + capture | SSR marketing, quote, booking request, track link, notifications, rate limits | Production-ready public flow; e2e and a11y pass |
| 3. Ops MVP | Leads, quotes, bookings, schedule, assignments, customers, audit | Staff can run a real week without spreadsheets |
| 4. Field + supply | Field PWA, checklists, photos, supply requests/inventory | Completed job evidence end-to-end |
| 5. Scale | Recurring, payments, WhatsApp API, reporting, customer accounts | Measured conversion/utilisation; owner sign-off |

## 16. Acceptance criteria for MVP

- **AC-01:** A first-time customer can complete a quote and booking request on a 360×640 viewport in under 90 seconds without an account.
- **AC-02:** Sunday and past dates cannot be selected; the UI explains why.
- **AC-03:** The server rejects tampered totals, invalid service states, and malformed contact data.
- **AC-04:** Duplicate submission with the same idempotency key returns the original reference and creates exactly one lead.
- **AC-05:** Confirmation shows a reference, summary, next step, track link, and correct contact channel.
- **AC-06:** A signed track link shows the true status; invalid/expired links do not leak data.
- **AC-07:** Staff can sign in, see a new lead, convert it to a quote, confirm a booking, assign a cleaner, and complete the job.
- **AC-08:** A conflicting staff assignment is blocked by the database, not only the UI.
- **AC-09:** Price/discount overrides require a reason and appear in the audit log.
- **AC-10:** Cleaner sees only assigned jobs and can complete a checklist with photo evidence.
- **AC-11:** Customer PII is absent from logs and unauthorised API responses.
- **AC-12:** Rate limits block abusive quote/lead/login bursts without blocking normal users.
- **AC-13:** Public pages are server-rendered, indexable, and pass Core Web Vitals budgets on mobile.
- **AC-14:** WCAG 2.2 AA checks pass for quote, confirmation, track, ops lead detail, and field job.
- **AC-15:** Backup restore and migration rollback are demonstrated, not merely documented.

## 17. Open decisions

1. **WhatsApp number:** Existing app uses `+263 771 962 330`; supplied image shows `+263 7 844 13100`. Which is primary for bookings, and which for supplies?
2. **Currency and tax:** Confirm USD pricing, whether VAT applies, and whether quotes must show tax separately.
3. **Service area:** Which Harare suburbs/zones are covered, and what travel fees apply?
4. **Booking model:** Are requests confirmed manually at launch, or is real-time capacity required immediately?
5. **Deposits/cancellation:** Is a deposit required? What is the cancellation/reschedule policy?
6. **Staff roles:** Who is owner/admin, ops, and cleaner? Who approves discounts?
7. **Retention:** Confirm retention periods with legal/accounting advice.
8. **Email/WhatsApp providers:** Resend vs alternative; WhatsApp Cloud API timing.
9. **Data residency:** Any requirement to keep data in a specific region?
10. **Brand assets:** Confirm logo files, typeface licence, and permission to use staff/customer photos.

Until these are answered, assumptions are labelled and must not be presented to customers as policy.
