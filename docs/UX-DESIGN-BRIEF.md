# Shine Hygiene — UX and Visual Design Brief

| Field | Value |
|---|---|
| Status | Draft for review |
| Version | 0.1 |
| Date | 2026-11-17 |
| Related | `docs/PRD.md`, `docs/SAD.md` |
| Source evidence | Supplied Facebook posts, staff image, current site, brand tokens |

## 1. Design context

### 1.1 Who this is for

| User | Device and conditions | Primary decision | Error tolerance |
|---|---|---|---|
| Household customer | Android phone, WhatsApp, intermittent data, often multitasking | “Can I trust them, and is this price fair?” | Low; confusion loses the booking |
| Commercial buyer | Laptop and phone, comparing providers, needs a paper trail | “Will this be reliable and defensible?” | Low; vague scope loses the contract |
| Ops coordinator | Desktop, frequent interruptions, phone after hours | “What needs attention now?” | Medium; must recover quickly |
| Cleaner | Android, gloves, outdoors, poor signal | “Where do I go and what do I do next?” | Very low; one-handed, time-pressured |
| Owner | Phone-first, reviews cash and exceptions | “Is the business healthy?” | Medium; needs drill-down |

### 1.2 Conditions that shape the design

- Mobile-first, 360px minimum.
- Slow or intermittent data; no assumption of app-store access.
- WhatsApp is a primary communication channel.
- Customers may not know cleaning terminology; use plain language.
- Staff adoption depends on speed, not feature count.
- Real photography and real names are stronger trust signals than abstract illustrations.
- Sunday is a rest day; the booking system must reflect that without shaming the customer.

## 2. Brand direction

### 2.1 Evidence from the supplied material

- Deep navy and bright blue, white, and clean domestic/office spaces.
- Real staff in uniform, blue gloves, branded caps; “The Kings of Clean” on the uniform.
- Copy emphasises: deep cleaning, commercial cleaning, washroom supplies, installation/maintenance of hand dryers and soap dispensers, and Sunday rest.
- Tone: confident, local, human, practical. Not luxury, not corporate-cold.

### 2.2 Brand idea

**“A cleaner space, without the chasing.”**

Shine sells relief: the customer stops coordinating, remembers, and follows up. The interface should feel like a competent person has taken over — calm, specific, and accountable.

Supporting story:

- **For households:** “You have enough on your plate. We make the space shine.”
- **For businesses:** “Your washrooms and workspaces, handled.”
- **For the brand:** “The Kings of Clean” is confidence earned by showing up, not boasting.

Do not invent claims such as “Harare’s #1” or “100% satisfaction” unless the owner can evidence them.

### 2.3 Visual personality

| Attribute | Expression | Avoid |
|---|---|---|
| Trustworthy | Real staff, real numbers, clear next steps | Fake reviews, stock smiles, vague badges |
| Clean | Whitespace, strong grid, limited palette | Busy gradients, decorative blobs |
| Local | Harare references, local phone numbers, familiar language | Corporate global stock imagery |
| Capable | Specific inclusions, status timestamps, named assignee | “We’ll get back to you” with no window |
| Warm | Human photography, plain language, Sunday-rest story | Excessive formality or cold legal tone |

## 3. UX laws applied

| Law / principle | Concrete design decision |
|---|---|
| Hick’s law | Exactly five service choices at step one. No pricing options until a service is chosen. |
| Miller’s law | Four steps; each step has one decision theme. Persistent summary prevents memory load. |
| Progressive disclosure | Frequency, add-ons, access notes, and travel zone appear only when relevant. |
| Fitts’s law | 48px minimum targets; primary CTA full-width on mobile; sticky bottom action bar. |
| Jakob’s law | Familiar stepper, calendar, order summary, and confirmation reference. |
| Doherty threshold | Local totals update instantly; saving/submitting states are explicit; no spinner without text. |
| Tesler’s law | Pricing rules, discounts, and travel zones are absorbed by the system. |
| Von Restorff | One high-contrast primary action per screen; brand blue is action, not wallpaper. |
| Peak-end rule | Confirmation is the emotional peak: reference, what happens next, who to contact, track link. |
| Gestalt proximity | Price, inclusions, and schedule grouped in one summary card; unrelated fields separated. |
| Recognition over recall | Selections remain visible; back navigation preserves data; draft restores. |
| Error prevention | Sunday disabled, past dates blocked, phone normalized, double submit blocked. |
| Honest status | “Request received” is never styled as “Booked.” |
| Cognitive load | No account required; optional email; only ask what changes price or service. |

### 3.1 Information hierarchy

Public page:

1. Outcome and trust (what Shine does, where, proof).
2. Action (get a quote / WhatsApp).
3. How it works (three steps).
4. Services and inclusions.
5. Proof (real photos, reviews only if verifiable).
6. Coverage and contact.
7. Secondary: supplies, commercial enquiry.

Quote page:

1. Progress and current step.
2. The decision for this step.
3. Price impact (if any) and summary.
4. Primary action; secondary back.
5. Reassurance: no obligation, response time, privacy.

Ops page:

1. Exceptions and today.
2. Pipeline and scheduled work.
3. Detail and actions.
4. History and audit.

## 4. Visual system

### 4.1 Color

| Token | Value | Use |
|---|---|---|
| `navy-900` | `#072B5B` | Headings, dark surfaces, footer |
| `navy-800` | `#0B2F6B` | Hero overlays, primary text on light |
| `brand-500` | `#118BCE` | Brand accents, large graphics, focus rings, non-text UI |
| `brand-700` | `#0E6D9C` | Accessible primary button fill and links (white text passes AA) |
| `sky-100` | `#E8F5FC` | Section tint, selected cards, info backgrounds |
| `ink-900` | `#10233F` | Body text |
| `muted-600` | `#5B6B7F` | Secondary text (check contrast on tinted surfaces) |
| `line-200` | `#DCE3EA` | Borders and dividers |
| `surface` | `#FFFFFF` | Cards and page base |
| `success-700` | `#067647` | Completed/confirmed |
| `warning-700` | `#B45309` | Pending/attention |
| `danger-700` | `#B42318` | Errors/destructive |
| `whatsapp` | `#25D366` | WhatsApp action only; pair with dark text |

Rules:

- Do not use `#118BCE` as a background for small white text; use `#0E6D9C` or navy.
- Status always has text and icon, never color alone.
- No gradient-as-decoration. A subtle navy overlay on photography is allowed for legibility.
- Dark mode is not required for MVP; ops may add a high-contrast theme later.

### 4.2 Typography

- **Display:** `Archivo` 700/800, tight tracking, sentence case. Use for hero and section headings.
- **Body/UI:** `Public Sans` 400/500/600, 16px base, 1.5–1.6 line height.
- **Numerals:** tabular numerals for prices, times, and tables.
- **Scale:** 12 / 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64.
- **Weights:** 400, 600, 700/800 only. Avoid faux bold.
- **Labels:** 12–13px, 600, optional uppercase tracking only for small metadata, never long paragraphs.
- Self-host subset WOFF2; `font-display: swap`; preload only the display face used above the fold.

### 4.3 Spacing and layout

- 4px base; use 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Max content width 1200px; reading width 680–720px.
- Mobile: 16px side padding; 24px section gaps; 12px card gaps.
- Desktop: 12-column grid; quote summary in a 4-column sticky rail.
- Radius: 12px inputs, 16px cards, 24px feature panels, pill for status.
- Shadows: one soft elevation token; no glassmorphism, no multiple competing shadows.
- Borders: 1px `line-200`; selected state uses 2px brand border + sky fill.

### 4.4 Photography and illustration

- Hero: real Shine staff in uniform, natural light, working in a home/office. The supplied image is suitable as a starting art direction; confirm usage rights and crop.
- Show hands, equipment, before/after, and real spaces. Avoid posed stock.
- Use circular crops or a blue arc only if it supports the logo composition; do not repeat the arc as decoration everywhere.
- Illustrations: only for empty states and simple service icons; outline style, 2px, navy/brand.
- Alt text describes the service and context, not “image of cleaner.”

### 4.5 Motion

- 150–250ms ease-out for state changes; no parallax; no auto-playing carousels.
- Respect `prefers-reduced-motion`.
- Loading uses skeletons for lists and inline text for actions (“Saving…”, “Sending…”).
- Confirmation may use a single subtle check animation; no confetti.

## 5. Page and flow design

### 5.1 Home

```text
┌──────────────────────────────────────────────┐
│ Logo        Services  How it works  Contact  │
│                                  [Get a quote]│
├──────────────────────────────────────────────┤
│ Eyebrow: Harare • Residential & commercial    │
│ H1: A cleaner space, without the chasing.     │
│ Sub: Instant quote. Real people. Sunday rest. │
│ [Get my quote]  [WhatsApp us]                 │
│ Trust row: insured • supplies • 2 numbers     │
│                         [real staff photo]    │
├──────────────────────────────────────────────┤
│ What needs cleaning?                          │
│ [Home] [Office] [Commercial] [Car] [Supplies] │
├──────────────────────────────────────────────┤
│ How it works: 1 Quote  2 Confirm  3 Shine     │
├──────────────────────────────────────────────┤
│ Proof: real job photos / verified reviews     │
├──────────────────────────────────────────────┤
│ Coverage + hours + contact                    │
│ Final CTA                                     │
└──────────────────────────────────────────────┘
```

Rules:

- H1 is an outcome, not “Welcome to Shine Hygiene.”
- The quote CTA appears above the fold and again after proof.
- Service cards are links, not a dropdown.
- WhatsApp is secondary but visible; do not let it compete with the primary quote CTA.
- No fake urgency or “only 2 slots left.”

### 5.2 Quote wizard

Four steps:

1. **Service** — five large cards, short descriptions, starting price only if true.
2. **Details** — dynamic fields by vertical; show price impact inline.
3. **Schedule and location** — preferred date/time, address/suburb, access notes; Sunday disabled with explanation.
4. **Contact and review** — name, phone, optional email, summary, inclusions, consent, submit.

Persistent elements:

- Step indicator with text labels, not just dots.
- Summary card: service, key details, estimated total, “no obligation.”
- Mobile sticky bottom bar: total + primary action; safe-area padding.
- Desktop right rail summary; sticky within viewport.
- Back preserves all state; refresh restores draft.

Microcopy examples:

- “This is an estimate, not a final invoice. We confirm before any work.”
- “We’re closed on Sundays. Choose another day and we’ll confirm.”
- “No account needed. We’ll send a reference and a link to track your request.”
- “Prefer WhatsApp? Send your reference to +263 …”

Error behavior:

- Inline error beneath the field; summary at top on submit.
- Never clear the form on error.
- Network failure: “We couldn’t send that. Your details are saved. Try again.”
- Duplicate: show the original reference, not “already exists.”
- Price changed: show the new total and require review.

### 5.3 Confirmation

```text
Request received
Reference SH-20261117-XXXXXXXX
We’ll confirm within business hours.

[summary card]
[Track your request] [WhatsApp us]

What happens next:
1. We check availability.
2. We confirm by phone/WhatsApp/email.
3. We arrive at the agreed time.
```

The confirmation must not imply a confirmed booking. It should state the response window and the exact contact channel.

### 5.4 Track page

- Status timeline: Requested → Confirmed → Scheduled → In progress → Completed.
- Current status prominent; timestamps; who will contact you.
- Appointment details, address, inclusions.
- Actions: request reschedule, request cancellation, WhatsApp, call.
- If invalid/expired token: “This link has expired. Send us your reference or contact us.” No data leak.
- No login required for MVP.

### 5.5 Ops console

Layout:

- Left nav: Today, Leads, Quotes, Bookings, Schedule, Jobs, Customers, Supplies, Reports, Settings.
- Top bar: search, business date, notifications, user menu.
- Today: exception-first cards (uncontacted leads, unassigned jobs, late starts, incomplete jobs), then timeline.
- Lead detail: contact header, status, next action, timeline, quote conversion panel.
- Quote builder: line items, price impact, revision history, send/accept.
- Schedule: week grid with capacity; assignment drawer; conflict messages.
- Job detail: customer, address, checklist, photos, status history, assignment.
- Density: compact rows, 36–40px controls, keyboard shortcuts; mobile read-only for most ops pages except lead call/notes.

Ops visual rules:

- Status chips use text + icon.
- Destructive actions require confirmation and reason.
- Unsaved changes warn before navigation.
- Tables support empty, loading, error, and no-results states.
- Never hide critical exceptions below the fold.
- Use real timestamps, not “2 days ago” alone.

### 5.6 Field

- One job per card; time, customer first name, suburb, status.
- Primary action changes by state: Navigate → Check in → Start → Complete.
- Large 56px controls; high contrast outdoors.
- Checklist uses checkboxes with notes; progress “3 of 7.”
- Photo capture front/back; upload queue with retry; “Saved on phone” state.
- Offline banner: “Offline. Your updates will sync.”
- Issue report reachable in two taps; never blocks completion without explanation.

## 6. Content and tone

### 6.1 Voice

- Plain, specific, calm.
- Short sentences. Active voice.
- Local context without caricature.
- Confident, not boastful.
- No jargon: “deep clean,” “move-out clean,” “office clean,” “supplies.”

### 6.2 Copy blocks

Hero options:

1. “A cleaner space, without the chasing.”
2. “Your home, handled. Your office, handled.”
3. “Get a real cleaning quote in seconds.”

Subhead:

“Residential, commercial and office cleaning across Harare. Instant quote, real people, no obligation.”

Trust row:

“Insured · Vetted staff · Supplies and dispensers · Monday–Saturday”

Sunday note:

“We rest on Sundays. Choose another day and we’ll confirm.”

Commercial CTA:

“Get a commercial cleaning quote”
“Recurring schedules, named supervisor, clear scope.”

Supplies CTA:

“Need washroom supplies?”
“Dispensers, hand dryers, soap, and refills — supplied and installed.”

### 6.3 Claims discipline

- Do not say “insured” unless confirmed and current.
- Do not say “vetted” unless a process exists.
- Do not publish response times the team cannot meet.
- Do not use “best,” “#1,” or “guaranteed” without evidence.
- Reviews must be real, attributable, and permissioned.

## 7. Accessibility and performance

- WCAG 2.2 AA; 4.5:1 body text, 3:1 large text/UI.
- Keyboard: logical order, visible focus, no traps; dialogs restore focus.
- Forms: explicit labels, `autocomplete`, `inputmode`, error association, no placeholder-only labels.
- Touch: 48px minimum; 8px spacing between targets.
- Screen reader: step changes announced; status updates via polite live region; price changes not announced on every keystroke.
- Motion: reduced-motion support; no flashing.
- Zoom: usable at 200%; no horizontal scroll at 320px.
- Performance: LCP <2.5s on mid-range Android/4G; initial JS <200KB gzip; images optimized; fonts subset.
- Low bandwidth: core content server-rendered; no blocking third-party scripts; WhatsApp link works without JS.

## 8. Design verification protocol

No visual completion claim without inspection.

1. Build the page/flow.
2. Screenshot at 360×640, 390×844, 768×1024, 1024×768, 1440×900.
3. Test with keyboard only: tab order, focus, dialogs, form errors.
4. Run axe on quote, confirmation, track, ops lead, field job; fix critical/serious.
5. Test slow 3G + CPU throttle; check LCP/INP.
6. Test offline quote draft and failed submit.
7. Test long names, long addresses, 0/1/many line items, and error states.
8. Verify contrast with a contrast checker, not by eye.
9. Check reduced motion and 200% zoom.
10. Record screenshots and results in the PR or verification log.

## 9. What not to do

- Do not make the site look like a generic SaaS dashboard.
- Do not use stock photos of cleansers in labs or smiling models in suits.
- Do not use a dark hero with tiny white text.
- Do not hide the price until after contact details if the price is already computable.
- Do not call a request “confirmed.”
- Do not use confetti, countdowns, or fake scarcity.
- Do not add a chat widget that competes with WhatsApp and the quote CTA.
- Do not put operational density on the customer flow.
- Do not use color alone for status.
- Do not auto-rotate testimonials or carousels.
- Do not make the cleaner app a shrunken desktop table.
