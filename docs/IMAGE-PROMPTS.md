# Shine Hygiene — image generation prompts

For Nano Banana (Google Gemini image model). Five images, one per photo slot in
`public/photos/`. Prompts are written for the UX brief (§2, §4.4) and the live
home page layout.

## Before you generate

1. **Generate, review, then approve.** These are stand-ins so the layout is real.
   Swap in approved photography when the owner has it.
2. **Do not fake the uniform or logo.** The brief describes real staff in blue
   gloves and branded caps with "The Kings of Clean". AI will invent text that
   looks wrong. Keep uniforms plain navy, omit logos, and, once approved, retouch
   the real logo and wordmark onto the caps or chest in a photo editor.
3. **This is Zimbabwe.** Ask for Black African adults and Harare-typical
   interiors (tiled floors, burglar-bar windows, ceiling fans, fibre-cement or
   painted walls). If a face reads wrong or uncanny, prefer tighter crops:
   hands, equipment, a made bed. Hands, surfaces and equipment age far better
   than faces.
4. **Attach 1–3 reference images.** Reference 1: your logo or brand colours
   (navy `#072B5B`, blue `#118BCE`, white, sky `#E8F5FC`). Reference 2: a real
   Shine staff photo for uniform colour and style. Reference 3 (facts agent only):
   the product photo.
5. **No text in the image.** Say so explicitly. Add the approved logo or wordmark
   afterwards.
6. **Aspect ratio matters.** The hero is shown 4:3 on desktop with the subject on
   the right and the headline on the left. The rows are 4:3, the About image 4:3.

---

## 1. Hero — `hero.jpg`

Shown under the navy hero, right half of the screen on desktop, below the text on
mobile, with a 25% navy overlay on top.

**Aspect ratio:** 4:3 (or 5:4). Export 1600×1200.

**Main prompt**

> Editorial photograph, natural daylight, of two professional cleaners in plain
> dark navy polo shirts and light blue nitrile gloves deep-cleaning a bright
> modern open-plan office in Harare, Zimbabwe. One person, a Black African woman
> in her early thirties, wipes the underside of a white reception desk with a
> microfibre cloth; the second person, a Black African man, vacuums a light grey
> carpet in the mid-ground. The office has large windows with soft daylight, a
> potted plant, pale walls and a clean, calm atmosphere. Shot on a 35mm lens at
> eye level, f/2.8, with shallow depth of field on the person in the foreground.
> The main subject is on the right side of the frame and the left third is
> uncluttered wall or window, because website text sits over the left side.
> Documentary and unposed, like a real working crew, not a stock photo. Muted
> natural colour, clean whites, navy and blue only as accents. No text, no logos,
> no watermarks, no signage.

**Variation if faces look uncanny: hands-first**

> Same scene, but framed without faces: a close, low-angle editorial shot of
> gloved hands in light blue nitrile cleaning the brushed-metal handle and lower
> edge of a white office desk with a microfibre cloth, a container of cleaning
> supplies slightly out of focus in the background. Soft window light rakes
> across the surface. Subject on the right half of the frame, left third clean.
> Photorealistic, 35mm, f/4. No text, no logos.

**Alt text in the app:** "Shine Hygiene staff in uniform deep cleaning a bright Harare office"

---

## 2. Homes row — `home.jpg`

Paired with "A deep clean that reaches the parts a quick wipe misses".

**Aspect ratio:** 4:3. Export 1600×1200.

**Main prompt**

> Warm editorial photograph, natural daylight, of a professional cleaner's gloved
> hands using a white microfibre cloth to wipe the inside rim of a kitchen sink
> and its polished chrome tap in a modest, well-kept Harare home. Visible
> context: light wood or melamine cabinets, a clean countertop, a window with
> burglar bars and soft daylight, perhaps a dish rack. The person wears a plain
> navy top and light blue nitrile gloves. Shot close and slightly above at a
> 50mm lens, f/2.8, shallow depth of field, focus on the hands and tap. Clean,
> calm, trustworthy, real home rather than a showroom. No text, no logos.

**Alt text in the app:** "Kitchen worktops and cabinets being deep cleaned in a Harare home"
(Best paired with a kitchen close-up. If you generate the sink shot, change the
alt text to match, e.g. "Sink and tap being deep cleaned in a Harare home.")

---

## 3. Offices row — `office.jpg`

Paired with "Washrooms and workspaces handled, so nobody has to chase".

**Aspect ratio:** 4:3. Export 1600×1200.

**Main prompt**

> Editorial photograph, bright natural light, of a professional cleaner, a Black
> African man in his late twenties wearing a plain dark navy polo shirt and light
> blue nitrile gloves, cleaning and polishing a white ceramic washroom basin and
> chrome tap in a clean modern office washroom in Harare. A stainless-steel soap
> dispenser and a hand dryer are mounted on the white-tiled wall. He stands to
> one side, working, not looking at the camera. Clean tiled floor, brushed
> chrome, cool daylight, spotless and calm. 35mm lens, f/2.8, environmental
> portrait distance. Unposed documentary feel. No text, no logos, no signage.

**Alternate if you want no faces:** the same washroom framed as a still life,
freshly cleaned basin with a folded cloth and spray bottle on the counter, no
person, soft daylight.

**Alt text in the app:** "Washroom basins and dispensers being cleaned in a Harare office"

---

## 4. HygieneMart row — `supplies.jpg`

Paired with "Bulk supplies and washroom equipment, delivered". The only prompt
where accuracy matters more than mood.

**Aspect ratio:** 4:3. Export 1600×1200.

**Main prompt**

> Clean product photograph in natural daylight of bulk commercial washroom and
> cleaning supplies arranged on a light grey surface: stacked white and grey
> plastic bottles of liquid soap, surface sanitiser and disinfectant with blank
> plain labels, white nitrile gloves in a box, folded blue microfibre cloths, a
> stainless-steel wall-mounted soap dispenser, and a white plastic hand dryer.
> Simple, tidy arrangement that implies wholesale quantities. A few items in soft
> focus behind. Bright, even light, light background, subtle shadows, catalogue
> style, high detail on the bottle surfaces and dispenser chrome. No text, no
> readable labels, no logos, no branding, no watermarks.

**Danger fact:** if a reference product image is attached, add: "match the shape,
cap and colour of the attached product exactly; keep labels blank."

**Alt text in the app:** "Cleaning supplies, sanitisers and dispensers stacked for delivery"

---

## 5. About section — `about.jpg`

Paired with "A Harare team that treats your space like it is theirs". This is the
most brand-loaded image.

**Aspect ratio:** 4:3. Export 1600×1200.

**Main prompt**

> Editorial group photograph, natural afternoon light, of a small professional
> cleaning crew of three Black African colleagues standing together in a bright,
> empty office lobby in Harare. They wear matching plain dark navy polo shirts
> and light blue gloves tucked into their waistbands; one holds a bucket of
> cleaning supplies and a mop, another holds a folded microfibre cloth. Relaxed,
> confident, friendly expressions, arms not all crossed, standing naturally
> rather than posed for a stock shoot. Clean pale walls, a potted plant, tiled
> floor, daylight from a large window. 50mm lens, f/4, sharp focus on the group.
> Nods to a real local team, no corporate imagery. Plain caps are fine but no
> text, no logos, no watermarks.

**Alt text in the app:** "Shine Hygiene crew in branded uniform and gloves ready for a job"

---

## 6. Optional sixth slot — `car.jpg` (vehicle detailing)

You have no car image slot on the page yet. If you add a Cars row, use this.

> Editorial photograph of gloved hands in light blue nitrile gloves using a soft
> microfibre cloth to wipe down the dashboard and centre console of a clean
> modern SUV, bright daylight through the windscreen, shallow depth of field,
> warm interior tones, no visible brand badges on the steering wheel or parts.
> No text, no logos.

---

## After generation: checklist

- [ ] No invented or garbled text, logos or badges anywhere in the frame
- [ ] Colours sit with navy `#072B5B` and blue `#118BCE`, not a competing palette
- [ ] Hands have five fingers and natural proportions; check close crops
- [ ] Faces are consistent and not uncanny. If not, switch to a hands or
      equipment crop rather than shipping a strange one
- [ ] Subjects land on the right of frame for `hero.jpg`, so the left stays legible
      under headline text
- [ ] Export JPEG or WebP, 1600px wide, quality ~80, under 250KB
- [ ] Save as `public/photos/<slot>.jpg` matching the table in
      `public/photos/README.md`
- [ ] Owner has approved each image for public use before launch
