# Shine Hygiene Operations Platform — Product Requirements Document

| Field | Value |
|---|---|
| Status | Draft for review |
| Version | 0.2 |
| Date | 2026-11-18 |
| Owner | Tinotenda Brandon Duma |
| Product | Shine Hygiene customer booking + operations platform |
| Supersedes | Planned Next.js rebuild and the frozen SPA status. The Vite SPA and its Vercel functions are the promoted, supported product. See SAD ADR-006. |

## 1. Executive summary

Shine Hygiene already has a working instant-quote experience, a live lead endpoint backed by Neon, and a staff back office for quotes and bookings. That proves demand capture and early operations support, but it is not yet a complete operating system for the business. Customers can request a price and staff can confirm bookings. Shine staff still cannot fully triage leads, schedule work, assign cleaners, track job completion, manage supplies, or give customers a reliable status view.

This PRD now defines hardening and gap filling in the existing Vite application and its Vercel functions. It does not define a framework rebuild. The first release must strengthen the core path already in production:

Enquiry to quote to confirmed booking, with honest status and no invented capability.

The promoted Vite SPA and its Vercel functions are the supported product. They are extended in place. No Next.js rebuild is planned.

## 2. Problem and opportunity

### 2.1 Problem

Shine Hygiene’s commercial flow is fragmented across social posts, phone calls, WhatsApp, memory, and ad-hoc records. The current website can calculate a price and store a lead, and staff can review quotes and confirm bookings, but it cannot answer the questions that determine revenue and service quality:

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
- Reduce owner and coordinator admin time per booking.
- Create a reliable service record for disputes and repeat business.
- Turn one-off cleaning into recurring contracts and supply orders.
- Build a defensible local brand with real proof, response times, completed jobs, before and after evidence, reviews.

### 2.3 Evidence status

| Claim | Label | Basis |
|---|---|---|
| Shine offers residential, commercial, office, car cleaning, and hygiene supplies | VERIFIED FACT | Supplied Facebook copy and current quote verticals |
| Shine operates in Harare and is closed on Sundays | VERIFIED FACT | Current site copy and supplied post, “Sunday is not a cleaning day” |
| Customers can get an instant quote today | VERIFIED FACT | Live production app |
| Leads are persisted in Neon | VERIFIED FACT | `POST /api/leads`, production smoke test |
| Staff can sign in and manage quotes and bookings | VERIFIED FACT | `POST /api/staff-login`, `GET /api/staff-quotes`, `GET /api/staff-bookings`, production smoke test |
| Staff currently coordinate manually | HYPOTHESIS | Back office covers quotes and bookings. Lead triage, scheduling, and field work are still manual or unimplemented. |
| Most customers prefer WhatsApp and mobile | HYPOTHESIS | Zimbabwe market pattern. Validate with analytics and call logs. |
| Customers will book without speaking to a person | HYPOTHESIS | Current quote completion data is not yet instrumented. |
| Typical job value, volume, and staff count | UNKNOWN | Requires owner input and historical records. |

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
- A native iOS or Android app.
- Marketplace onboarding of third-party cleaners.
- Fully automated WhatsApp two-way conversations. MVP uses click-to-chat. Cloud API is a later phase.

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
- **Needs:** Recurring schedule, named supervisor, service record, quote and invoice documents, escalation path.

### 4.3 Operations coordinator — “Rudo”

- **Context:** Desktop during work hours, phone after hours. Manages multiple conversations and a changing schedule.
- **Job to be done:** “Turn enquiries into confirmed, staffed jobs without anything falling through.”
- **Decisions:** Who do I call first? What is this lead worth? Which cleaner is free? Does this quote need approval? Is the job complete? 
- **Needs:** Prioritised inbox, fast quote conversion, conflict-aware scheduling, assignment, reminders, exception flags.

### 4.4 Cleaner — “Blessing”

- **Context:** Android phone, gloves, moving between sites, low bandwidth, limited patience for forms.
- **Job to be done:** “Tell me where to go, what to do, and let me prove I finished.”
- **Decisions:** Where is the next job? What is included? What do I do if something is broken or missing? 
- **Needs:** Today view, one-tap call and navigate, checklist, photo capture, issue report, offline tolerance.

### 4.5 Owner — “Shine”

- **Context:** Accountable for cash, quality, reputation, and pricing.
- **Job to be done:** “See what is selling, what is outstanding, and where the business is leaking.”
- **Decisions:** Are we pricing correctly? Which leads are ignored? Which staff and customers need attention? What is recurring revenue? 
- **Needs:** Dashboard, exceptions, pricing control, audit, exports.

## 5. Product principles and UX theory

The interface must reduce cognitive load, not decorate it. These principles are requirements, not suggestions.

| Principle or law | Product application |
|---|---|
| Hick’s law | Five service choices maximum at the first step. Advanced options hidden until needed. |
| Miller’s law | Quote is chunked into 4 short steps. A persistent summary carries context. |
| Progressive disclosure | Price-affecting detail appears only after service selection. Operational complexity stays in the ops console. |
| Fitts’s law | Primary actions are full-width on mobile, at least 48px tall, in the thumb zone. Sticky total and continue bar. |
| Jakob’s law | Use familiar booking patterns, stepper, calendar, summary, confirmation, reference number. |
| Doherty threshold | Local price updates under 100ms. Server verification before submit. Visible saving and submitting states. |
| Tesler’s law | The system absorbs pricing rules, travel zones, discounts, and availability complexity. The customer sees a simple number and a clear breakdown. |
| Von Restorff effect | One primary CTA per screen. Brand blue reserved for action, not decoration. |
| Peak-end rule | The confirmation screen is calm, specific, and actionable, reference, what happens next, who to contact, track link. |
| Aesthetic-usability effect | Real staff photography, generous whitespace, consistent cards. No stock-photo gloss that undermines trust. |
| Gestalt proximity and common region | Price breakdown, inclusions, and schedule are grouped. Unrelated fields never share a card. |
| Error prevention | Sundays disabled. Phone normalized. Dates constrained. Double-submit blocked by idempotency. Inline validation. |
| Recognition over recall | Saved draft, visible selections, back navigation without data loss. |
| Trust and honesty | No fake scarcity, no countdown timers, no “confirmed” before staff confirmation. Status language must match reality. |

## 6. Information architecture

### 6.1 Public

- `/` — positioning, service selector, proof, how it works, service area, contact.
- `/quote` — four-step quote and booking request.
- `/services/[slug]` — SEO pages for residential, commercial, office, car, supplies. These routes are not yet implemented in the promoted app.
- `/hygienemart` — supply catalog and order request. Not yet implemented as a separate route.
- `/track/[token]` — customer status, appointment details, reschedule and cancel request. Not yet implemented.
- `/about`, `/contact`, `/privacy`, `/terms`. Some are not yet implemented.

### 6.2 Customer account (Phase 2)

- `/account` — upcoming and past bookings, quotes, supply orders, saved addresses. Not yet implemented.

### 6.3 Operations console

- `/ops` style staff console — currently a back-office panel inside the SPA, not a separate route. Lead inbox, quote conversion, and booking confirmation exist.
- `/ops/leads`, `/ops/quotes`, `/ops/bookings`, `/ops/schedule`, `/ops/jobs`, `/ops/customers`, `/ops/staff`, `/ops/catalog`, `/ops/supplies`, `/ops/reports`, `/ops/settings` — planned, not implemented.

### 6.4 Field

- `/field` and `/field/jobs/[id]` — planned, not implemented.

## 7. Core journeys

### Journey A — Anonymous quote to booking request

1. Customer lands from Facebook or WhatsApp on a mobile page.
2. Selects service (residential, commercial, office, car, supplies).
3. Answers only the questions that change the price.
4. Sees a live total with inclusions and a plain-language breakdown.
5. Chooses a preferred date and time. Sunday is unavailable.
6. Enters name, phone, optional email, address or service area.
7. Reviews and submits once.
8. Receives a reference and sees “Request received — we will confirm within business hours.”
9. Staff sees the lead immediately. Customer status changes only when staff confirms.

**Failure handling:** network loss preserves the draft. Retry uses the same idempotency key where implemented. Duplicate submissions return the original reference where implemented. Server rejection shows a correctable message, never a dead end.

Note. Email confirmation and a signed track link are not yet implemented. WhatsApp click-to-chat is the current handoff.

### Journey B — Lead to completed job (operations)

1. Coordinator opens the inbox sorted by age and value.
2. Reviews lead, calls or WhatsApps, records outcome.
3. Converts to a quote with prefilled service and pricing.
4. Adjusts only permitted items. Any override requires a reason.
5. Sends quote. Customer accepts verbally or via link.
6. Coordinator confirms booking and picks a slot with capacity.
7. Assigns a cleaner or team. Conflict check blocks double booking.
8. Cleaner sees the job, checks in, completes checklist, uploads photos, notes issues.
9. Coordinator verifies completion and closes the job.
10. Customer receives completion and follow-up. A rebooking prompt is created.

Current implementation covers steps 1 to 6 in part through the quote inbox and booking confirmation. Steps 7 to 10 are not yet implemented.

### Journey C — Commercial recurring enquiry

1. Buyer requests recurring cleaning for an office.
2. Coordinator captures frequency, area, access constraints, and decision-maker.
3. Quote shows per-visit and monthly equivalent. Terms are explicit.
4. On acceptance, a recurring booking creates future jobs.
5. Each visit is tracked separately. Monthly summary is available.

Not yet implemented beyond per-quote frequency pricing.

### Journey D — Supply order

1. Customer selects HygieneMart items.
2. Order request captures quantity, delivery area, and contact.
3. Staff confirms stock and delivery cost before commitment.
4. Order status is visible. Inventory is decremented only on fulfilment.

HygieneMart quoting exists. Order requests, stock, and fulfilment are not yet implemented.

### Journey E — Reschedule or cancel

1. Customer opens the track link.
2. Requests a new date or time or cancellation with a reason.
3. Request enters an ops queue. The original slot is not silently released until staff acts.
4. Customer sees “requested,” then “confirmed” or “declined” with an alternative.

Not yet implemented. No track link exists yet.

### Journey F — Cleaner’s day

1. Cleaner opens the field view on mobile.
2. Sees today’s jobs in time order with location and status.
3. Taps navigate or call. Checks in on arrival.
4. Works through a short checklist. Captures before and after photos.
5. Reports an issue (missing supply, damage, access failure).
6. Marks complete. Coordinator is notified.
7. If offline, actions queue locally and sync with conflict detection.

Not yet implemented.

## 8. User stories and acceptance criteria

Priority. **P0** = first release, **P1** = next, **P2** = later.

### Customer stories

| ID | Story | Priority | Acceptance criteria |
|---|---|---|---|
| US-01 | As a customer, I want an instant quote without creating an account so I can decide quickly. | P0 | Quote completes on a 360px viewport. No login. Total visible before contact details. Draft survives refresh. |
| US-02 | As a customer, I want to understand what the price includes so I can trust it. | P0 | Itemised breakdown, inclusions, frequency discount, travel fee if any, and “no obligation” statement are visible before submit. |
| US-03 | As a customer, I want to request a date and time that suits me. | P0 | Date and time selection. Sundays blocked. Past dates blocked. Request is explicitly “pending confirmation,” not “booked.” |
| US-04 | As a customer, I want confirmation I can keep. | P0 | On success, reference, summary, track link, contact numbers, and next-step expectation. Track link is not yet implemented. |
| US-05 | As a customer, I want to check progress without an account. | P0 | Signed track link shows status timeline and appointment details. Expired or invalid token gives a safe recovery path. Not yet implemented. |
| US-06 | As a customer, I want to reschedule or cancel without a phone argument. | P1 | Request form creates an ops task. Customer sees requested, confirmed, or declined. No silent cancellation. Not yet implemented. |
| US-07 | As a customer, I want to order supplies and know if they are in stock. | P1 | Catalog shows price and availability status. Order request is confirmed by staff before payment or fulfilment. Not yet implemented. |
| US-08 | As a customer, I want to rebook a previous service. | P1 | Track or account page offers “book again” with prior selections prefilled. Not yet implemented. |
| US-09 | As a customer, I want to use WhatsApp when that is easier. | P0 | WhatsApp click-to-chat includes the reference and a prefilled message. Number is correct for the brand. |

### Operations stories

| ID | Story | Priority | Acceptance criteria |
|---|---|---|---|
| US-10 | As a coordinator, I want a prioritised lead inbox so no enquiry is missed. | P0 | Leads show age, service, value, source, status, assignee. Filters and sorting. Uncontacted leads highlighted. Partially implemented through quote inbox. |
| US-11 | As a coordinator, I want to record contact attempts and outcomes. | P0 | Notes, call or WhatsApp outcome, next follow-up date. Timeline is immutable and attributed. Not yet implemented. |
| US-12 | As a coordinator, I want to convert a lead into a quote without re-entering data. | P0 | One action creates a draft quote with prefilled customer, service, and pricing. Source lead is linked. Partially implemented. |
| US-13 | As a coordinator, I want to adjust a quote safely. | P0 | Only permitted fields editable. Discounts or overrides require reason. Totals recomputed server-side. Revision is auditable. Not yet implemented. |
| US-14 | As a coordinator, I want to confirm a booking and assign staff without double booking. | P0 | Slot capacity enforced in a transaction. Assignment conflict blocks save with a clear message. Confirmation notifies customer. Partially implemented. No transaction or conflict check yet. |
| US-15 | As a coordinator, I want to see today’s exceptions. | P0 | Dashboard shows unassigned jobs, late starts, incomplete jobs, uncontacted leads, and pending reschedules. Not yet implemented. |
| US-16 | As a coordinator, I want customer history in one place. | P0 | Customer record shows leads, quotes, bookings, jobs, notes, contact preferences, and lifetime value. Not yet implemented. |
| US-17 | As an owner, I want to control pricing and discounts. | P0 | Pricing rules are owner-only. Changes are versioned. Quotes retain the pricing version used. Not yet implemented. Pricing lives in code. |
| US-18 | As an owner, I want to see conversion and utilisation. | P1 | Report shows lead to quote to booking conversion, average job value, staff utilisation, repeat rate, and date filters. Not yet implemented. |
| US-19 | As an owner, I want to export customer and job data. | P1 | Export is permissioned, logged, and excludes secrets. CSV download expires. Not yet implemented. |
| US-20 | As an owner, I want to manage business hours and blackout dates. | P0 | Sunday closed by default. Holidays and blackouts block new requests. Changes are audited. Sunday blocking exists in the quote UI. Server enforcement and blackout dates are not yet implemented. |

### Field stories

| ID | Story | Priority | Acceptance criteria |
|---|---|---|---|
| US-21 | As a cleaner, I want my day’s jobs on my phone. | P0 | Mobile-first list. Today’s jobs in time order. Works on slow connection. No desktop-only controls. Not yet implemented. |
| US-22 | As a cleaner, I want to check in and out. | P0 | Check-in records timestamp and location with consent. Check-out requires checklist completion or an explicit reason. Not yet implemented. |
| US-23 | As a cleaner, I want to document work. | P0 | Before and after photos upload with retry. Size and type limits. Private storage. Signed access only. Not yet implemented. |
| US-24 | As a cleaner, I want to report a problem. | P0 | Issue types (access, supply, damage, safety, other). Photo and note. Coordinator notified. Job can be blocked without losing data. Not yet implemented. |
| US-25 | As a cleaner, I want to work through intermittent connectivity. | P1 | Queued actions sync idempotently. Conflicts surfaced. No duplicate completion or photo records. Not yet implemented. |

### Platform stories

| ID | Story | Priority | Acceptance criteria |
|---|---|---|---|
| US-26 | As a staff member, I want secure sign-in and role-appropriate access. | P0 | Neon Auth email and password. JWT verified on every staff request. Role from `staff_members`. Failed-login rate limit. TOTP is not in this release. Rate limiting is not yet implemented. |
| US-27 | As an auditor, I want to know who changed what. | P0 | Audit entries for price, status, assignment, permission, export, and deletion. Actor, timestamp, before and after. Partially implemented through `audit_events` on booking confirmation. |
| US-28 | As a data subject, I want my data handled lawfully. | P0 | Privacy notice at collection. Purpose and retention stated. Deletion request workflow. No PII in logs or URLs. Not yet implemented. |
| US-29 | As the business, I want spam and abuse controlled. | P0 | Rate limits on quote, lead, track, and login. Honeypot or equivalent. Idempotency. Alerts on abuse spikes. Not yet implemented. |
| US-30 | As the business, I want the public site to rank and load fast. | P0 | Client-rendered public site. Metadata, sitemap, and structured data are not yet implemented. LCP under 2.5s on mobile 4G. Server rendering is not part of the promoted architecture and remains an open decision. |

## 9. Scope

### 9.1 MVP (P0) — hardening and gap filling in the current app

- Harden the existing Vite client and Vercel functions in place.
- Four-step quote and booking request with server-verified pricing, already live. Add idempotency and retry hardening.
- Lead persistence, reference, and status, already live. Add lead detail and status workflow.
- Staff auth through Neon Auth, role and status in `staff_members`, already live. Add rate limits and audit coverage.
- Quote inbox and booking confirmation, already live. Extend with scheduling, assignment, and conflict checks.
- Customer status page and reschedule or cancel request. Not yet implemented.
- Email confirmation and internal notification. Not yet implemented. Current handoff is honest WhatsApp click-to-chat.
- Service catalog and pricing rules. Currently in code. Versioning and owner-only control are not yet implemented.
- Business hours and blackouts. Sunday closed is enforced in the quote UI. Server enforcement and blackout dates are not yet implemented.
- Basic reports. Not yet implemented.
- Privacy page, retention policy, rate limits, backups. Not yet implemented or partial.

### 9.2 Phase 2 (P1)

- Customer accounts (magic link), saved addresses, rebooking.
- Real-time availability and self-serve reschedule.
- Cleaner field PWA with offline queue, checklists, photos, issues.
- HygieneMart catalog, order requests, stock movements.
- Recurring bookings and commercial contracts.
- WhatsApp Business Cloud API templates and delivery status.
- Invoice and receipt documents and payment status (manual first).
- Advanced reports and exports.

### 9.3 Phase 3 (P2)

- Online deposits and payments (EcoCash, Paynow, card as available).
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

- **User** — staff identity, role, status. Neon Auth owns identity. No local sessions table.
- **Customer** — person or company, billing details, consent, owner.
- **Address** — service location, access notes, geo, zone.
- **Lead** — enquiry, source, status, assignee, value, conversion links.
- **Service / ServiceVariant / AddOn / PricingRule / TravelZone** — sellable catalog and deterministic pricing.
- **Quote / QuoteRevision** — immutable pricing snapshot, totals, status, acceptance.
- **Booking** — confirmed commercial commitment, slot, customer, quote.
- **Job / JobAssignment / JobStatusEvent / ChecklistItem / JobPhoto** — execution and evidence.
- **SupplyOrder / SupplyOrderItem / CatalogItem / InventoryMovement** — HygieneMart.
- **Notification / OutboxEvent** — reliable delivery with retries.
- **AuditLog** — actor, action, entity, before and after, request ID.
- **BusinessSettings / BusinessHours / BlackoutDate** — operating rules.
- **IdempotencyKey** — safe retries.

Current implemented tables are `leads`, `staff_members`, `quotes`, `bookings`, and `audit_events`. The remaining entities are planned and not yet implemented.

Money is stored as integer minor units (cents), never floating point. Currency is explicit. Quote totals are always recomputed server-side from the pricing version. Client totals are display-only until verified.

## 11. Permission model

| Capability | Owner | Ops | Cleaner | Customer | Anonymous |
|---|---|---|---|---|---|
| View public catalog | Yes | Yes | Yes | Yes | Yes |
| Create lead or quote request | Yes | Yes | No | Yes | Yes |
| View all leads | Yes | Yes | No | No | No |
| Convert lead to quote | Yes | Yes | No | No | No |
| Override price or discount | Yes | Approval only | No | No | No |
| Change pricing rules | Yes | No | No | No | No |
| Confirm booking | Yes | Yes | No | No | No |
| Assign staff | Yes | Yes | No | No | No |
| View assigned job | Yes | Yes | Own only | Own only | No |
| Complete checklist or photos | Yes | Yes | Assigned only | No | No |
| View customer PII | Yes | Yes | Job-relevant only | Own only | No |
| Export data | Yes | No | No | Own only | No |
| Manage users or roles | Yes | No | No | No | No |
| View audit log | Yes | Limited | No | No | No |

Separation of duties:

- Pricing changes and refunds are owner-only.
- Ops can apply an approved discount within a threshold. Anything above threshold requires owner approval recorded in the audit log.
- Cleaners cannot alter price, assignment, or customer records beyond job notes and photos.
- Customer data access is scoped in server repositories, not only hidden in the UI.

Note. Role enforcement beyond the staff allow-list is not yet implemented.

## 12. Non-functional requirements

### 12.1 Performance and resilience

- LCP under 2.5s, INP under 200ms, CLS under 0.1 on a mid-range Android over 4G.
- Initial client JS under 200KB gzip for the public quote route. No heavy animation library.
- Quote total recalculates locally in under 100ms. Server verification under 300ms p95.
- Public pages are client-rendered in the promoted architecture. The earlier server-rendered requirement is withdrawn and remains open if SEO demands it.
- Draft survives refresh, tab close, and network loss.
- Submission is idempotent where implemented. Retries must never create duplicate leads or bookings.
- Graceful degradation, if email or WhatsApp provider is down, the lead is still stored and visible in ops.

### 12.2 Security

- OWASP ASVS-aligned controls. Server-side authorization on every mutation.
- Server-side validation in `api/_lib/lead.ts` and the Vercel functions. Parameterized SQL via `@neondatabase/serverless` tagged templates. No Zod library and no ORM are used.
- Neon Auth owns identity. Every staff endpoint verifies the JWT server side. MFA is not in this release.
- Rate limits on public quote, lead, track, login, and password reset. Not yet implemented.
- CSP, HSTS, frame denial, referrer policy, no secrets in client bundles.
- Signed, expiring URLs for job photos and exports. Not yet implemented.
- PII excluded from logs, analytics, URLs, and error reports.
- Dependency and secret scanning in CI.

### 12.3 Privacy and compliance

- Zimbabwe Cyber and Data Protection Act 2021 principles, lawful purpose, minimization, consent, security, retention, subject access and deletion.
- Privacy notice at the point of collection, not buried in the footer. Not yet implemented.
- Retention. Leads and quotes not converted — 24 months. Customer and job records — 7 years where financial or legal need exists. Marketing consent separate. Final values require owner and legal confirmation.
- Deletion request workflow with legal-hold exception and audit. Not yet implemented.
- Data processing locations and providers documented.

### 12.4 Accessibility

- WCAG 2.2 AA.
- Keyboard-complete quote and ops flows.
- Visible focus, labelled inputs, error summaries, 4.5:1 text contrast.
- No color-only status. Status text plus icon.
- Respect `prefers-reduced-motion`.
- Screen-reader tested on quote, confirmation, track, and job completion. Track and job completion are not yet implemented.

### 12.5 Observability

- Structured logs with request ID, route, actor ID (not PII), latency, outcome.
- Error tracking is not yet adopted. Structured logs and uptime checks are the current baseline.
- Audit log for privileged actions.
- Uptime checks for `/`, `/quote`, `/api/health`, and the staff console.
- Alerts, 5xx spike, lead submission failure, outbox backlog, DB connection saturation, cron failure. Most are not yet implemented.
- Neon backup and PITR enabled. Restore drill documented. Not yet demonstrated.

## 13. Success metrics

Targets are hypotheses until a baseline is measured.

| Metric | Target | Instrumentation |
|---|---|---|
| Quote completion rate | At least 55% of started quotes | Funnel events |
| Median time to quote | Under 90s | Client and server timestamps |
| Lead response time (business hours) | Under 15 min | Lead contact timestamp |
| Quote to booking conversion | At least 30% | Quote and booking states |
| Double bookings | 0 | Constraint violations and audit |
| Ops admin time per booking | Under 5 min | Task timestamps (manual baseline first) |
| Job completion with evidence | At least 95% | Checklist and photo records |
| No-show or cancellation | Under 10% | Booking status |
| Repeat or recurring share | Increase quarterly | Customer history |
| Public LCP (mobile) | Under 2.5s p75 | RUM |
| Critical or serious a11y issues | 0 | Automated and manual audit |
| Lead persistence success | At least 99.5% | API metrics |

## 14. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Scope expands into a full ERP | Delay, unfinished core | Enforce MVP boundary. Phase gates. Owner sign-off for additions. |
| Pricing rules diverge between client and server | Wrong quotes, disputes | Single domain module. Parity and property tests. Server verification. Versioned snapshots. |
| Double booking or lost reschedule | Reputational damage | DB constraints, transactions, explicit state machine, ops queue. |
| Staff do not adopt the console | Fallback to WhatsApp | Mobile-first ops, fast lead actions, training, measure time saved. |
| WhatsApp API approval or delay | Notification gap | Email and click-to-chat fallback. Provider abstraction. |
| Stale PWA or service worker serves old SPA | Broken migration | Versioned cache, self-destructing worker, cutover test. |
| PII breach or unlawful retention | Legal or reputational harm | Minimization, RBAC, audit, retention job, privacy review. |
| Free-tier limits or cost spikes | Outage | Usage alerts, budget, Neon and Vercel plan review before launch. |
| Payment integration uncertainty | Delayed revenue collection | Manual payment status in MVP. Gateway in Phase 3. |
| Phone or contact data conflict | Customer confusion | Central settings. Verify numbers with owner before launch. |
| Client-rendered SEO limits | Lower discoverability | Accept for now or fund a later server-rendered surface. Owner decision. |

## 15. Delivery sequence

Indicative for one experienced full-stack developer. Validate after each stage.

| Stage | Scope | Exit criteria |
|---|---|---|
| 0. Decisions | PRD and SAD updates, promotion sign-off, open decisions | Owner approves scope and architecture |
| 1. Hardening | Rate limits, idempotency, auth audit, input validation parity, backup and restore drill | Production smoke. Quote parity tests. Auth and RBAC tests. |
| 2. Ops gap filling | Lead detail, status workflow, scheduling, assignment, audit coverage | Staff can run a real week without spreadsheets. |
| 3. Customer status | Signed track link, reschedule and cancel request, honest status language | Track link works. Invalid tokens do not leak data. |
| 4. Field and supply | Field PWA, checklists, photos, supply requests and inventory | Completed job evidence end to end. |
| 5. Scale | Recurring, payments, WhatsApp API, reporting, customer accounts | Measured conversion and utilisation. Owner sign-off. |

## 16. Acceptance criteria for MVP

- **AC-01:** A first-time customer can complete a quote and booking request on a 360 by 640 viewport in under 90 seconds without an account.
- **AC-02:** Sunday and past dates cannot be selected. The UI explains why.
- **AC-03:** The server rejects tampered totals, invalid service states, and malformed contact data.
- **AC-04:** Duplicate submission with the same idempotency key returns the original reference and creates exactly one lead.
- **AC-05:** Confirmation shows a reference, summary, next step, track link, and correct contact channel. Track link not yet implemented.
- **AC-06:** A signed track link shows the true status. Invalid or expired links do not leak data. Not yet implemented.
- **AC-07:** Staff can sign in, see a new lead, convert it to a quote, confirm a booking, assign a cleaner, and complete the job. Assignment and completion not yet implemented.
- **AC-08:** A conflicting staff assignment is blocked by the database, not only the UI. Not yet implemented.
- **AC-09:** Price and discount overrides require a reason and appear in the audit log. Not yet implemented.
- **AC-10:** Cleaner sees only assigned jobs and can complete a checklist with photo evidence. Not yet implemented.
- **AC-11:** Customer PII is absent from logs and unauthorised API responses.
- **AC-12:** Rate limits block abusive quote, lead, and login bursts without blocking normal users. Not yet implemented.
- **AC-13:** Public pages are client-rendered and must still meet Core Web Vitals budgets on mobile. Server rendering is not part of the promoted architecture. Open if the owner requires SSR.
- **AC-14:** WCAG 2.2 AA checks pass for quote, confirmation, track, ops lead detail, and field job. Track, ops lead detail, and field job not yet implemented.
- **AC-15:** Backup restore and migration rollback are demonstrated, not merely documented. Not yet demonstrated.

## 17. Open decisions

1. **WhatsApp number:** Existing app uses `+263 771 962 330`. Supplied image shows `+263 7 844 13100`. Which is primary for bookings, and which for supplies? 
2. **Currency and tax:** Confirm USD pricing, whether VAT applies, and whether quotes must show tax separately.
3. **Service area:** Which Harare suburbs or zones are covered, and what travel fees apply? 
4. **Booking model:** Are requests confirmed manually at launch, or is real-time capacity required immediately? 
5. **Deposits and cancellation:** Is a deposit required? What is the cancellation and reschedule policy? 
6. **Staff roles:** Who is owner, admin, ops, and cleaner? Who approves discounts? 
7. **Retention:** Confirm retention periods with legal and accounting advice.
8. **Email and WhatsApp providers:** No email provider is adopted. WhatsApp Cloud API timing is open.
9. **Data residency:** Any requirement to keep data in a specific region? 
10. **Brand assets:** Confirm logo files, typeface licence, and permission to use staff and customer photos.
11. **Client-rendered SEO:** Accept the current Vite SPA SEO limits, or fund a later server-rendered surface.
12. **Rate limiting and abuse control:** No rate limiter is adopted. Confirm approach and thresholds.

Until these are answered, assumptions are labelled and must not be presented to customers as policy.
