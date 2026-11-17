import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const VERTICAL_HEADINGS = [
  { tab: /commercial/i, heading: 'Commercial Deep Cleaning' },
  { tab: /residential/i, heading: 'Residential Deep Cleaning' },
  { tab: /office/i, heading: 'Office Cleaning' },
  { tab: /^cars/i, heading: 'Vehicle Detailing' },
  { tab: /hygienemart/i, heading: 'HygieneMart' },
] as const

test('every vertical renders without a crash and shows a total', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', error => pageErrors.push(error.message))

  await page.goto('/')
  await page.getByRole('button', { name: /calculate your instant quote/i }).click()

  await expect(page.getByRole('heading', { name: 'Configure Your Quote' })).toBeVisible()

  for (const { tab, heading } of VERTICAL_HEADINGS) {
    await page.getByRole('button', { name: tab }).click()
    await expect(page.getByRole('heading', { name: heading })).toBeVisible()
    await expect(page.getByText('Estimated Total')).toBeVisible()
  }

  expect(pageErrors).toEqual([])
})

test('submission is honest: saved locally, nothing sent, WhatsApp is the handoff', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /calculate your instant quote/i }).click()
  await page.getByRole('button', { name: /residential/i }).click()
  await expect(page.getByRole('heading', { name: 'Residential Deep Cleaning' })).toBeVisible()

  await page.getByLabel('Full Name').fill('Rudo Test')
  await page.getByLabel('Phone Number').fill('0771234567')
  await page.getByRole('button', { name: 'Get My Quote' }).click()

  await expect(page.getByRole('heading', { name: 'Your quote is ready' })).toBeVisible()
  await expect(page.getByText('Nothing has been sent yet')).toBeVisible()
  await expect(page.getByText(/confirmation.*sent/i)).toHaveCount(0)

  const whatsapp = page.getByRole('link', { name: /send via whatsapp/i })
  await expect(whatsapp).toHaveAttribute('href', /^https:\/\/wa\.me\/263771962330\?text=/)
  await expect(whatsapp).toHaveAttribute('href', /Rudo%20Test/)

  await page.reload()
  await expect(page.getByText(/1 saved quote on this device/)).toBeVisible()
})

test('offline submission keeps the draft instead of pretending to send it', async ({ page, context }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /calculate your instant quote/i }).click()
  await expect(page.getByRole('slider', { name: 'Floor Area' })).toBeVisible()

  await context.setOffline(true)
  await page.getByLabel('Full Name').fill('Offline User')
  await page.getByLabel('Phone Number').fill('0779999999')
  await page.getByRole('button', { name: 'Get My Quote' }).click()

  await expect(page.getByText(/You are offline/)).toBeVisible()
  await expect(page.getByText('Nothing has been sent yet')).toBeVisible()

  await context.setOffline(false)
  await page.reload()
  await expect(page.getByText(/1 saved quote on this device/)).toBeVisible()
})

test('has no critical or serious accessibility violations', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(800)

  const landing = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const landingBlocking = landing.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')

  await page.getByRole('button', { name: /calculate your instant quote/i }).click()
  await expect(page.getByRole('heading', { name: 'Commercial Deep Cleaning' })).toBeVisible()
  await page.waitForTimeout(800)

  const quote = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const quoteBlocking = quote.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')

  const blocking = [
    ...landingBlocking.map(v => `landing/${v.id}: ${v.help}`),
    ...quoteBlocking.map(v => `quote/${v.id}: ${v.help}`),
  ]
  expect(blocking).toEqual([])
})
