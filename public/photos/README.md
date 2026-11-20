# Photography slots

The landing page expects approved Shine photography at these paths. Until a file
exists, `PhotoSlot` shows a neutral placeholder and the layout stays intact — no
stock images and no invented people.

| File | Where it appears | Direction (UX brief §4.4) |
|---|---|---|
| `hero.jpg` | Dark navy hero, right side | Real Shine staff in uniform, natural light, working in a home or office |
| `home.jpg` | "Homes" row | Hands, equipment or a clean room in a real home |
| `office.jpg` | "Offices" row | Reception or washroom work in a real office |
| `supplies.jpg` | "HygieneMart" row | Bulk supplies, dispensers or PPE laid out |
| `about.jpg` | About section | The crew together, in uniform, in a real space |
| `car.jpg` | Optional row | Detailing in progress, interior or exterior |

Guidance:

- Square or 4:3 crops, at least 1200px wide, JPEG or WebP under ~250KB.
- Do not reuse `theme.jpg` or the supplied Facebook photos unless the owner
  confirms usage rights.
- Alt text describes the service and context, not "image of cleaner".
- Ready-to-use generation prompts: `docs/IMAGE-PROMPTS.md`.
- The hero photo sits under a navy overlay. Keep the subject on the right half
  so the headline on the left stays legible.
