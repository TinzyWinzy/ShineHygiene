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
    await page.locator('nav').getByRole('button', { name: tab }).click()
    await expect(page.getByRole('heading', { name: heading })).toBeVisible()
    await expect(page.getByText('Estimated Total')).toBeVisible()
  }

  expect(pageErrors).toEqual([])
})

test('submission is saved by the office API and WhatsApp is the handoff', async ({ page }) => {
  let requestBody: Record<string, unknown> | null = null

  await page.route('**/api/leads', async route => {
    requestBody = route.request().postDataJSON() as Record<string, unknown>
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ reference: 'SH-E2E-1234', totalCents: 12_000, duplicate: false }),
    })
  })

  await page.goto('/')
  await page.getByRole('button', { name: /calculate your instant quote/i }).click()
  await page.getByRole('button', { name: /residential/i }).click()
  await expect(page.getByRole('heading', { name: 'Residential Deep Cleaning' })).toBeVisible()

  await page.getByLabel('Full Name').fill('Rudo Test')
  await page.getByLabel('Phone Number').fill('0771234567')
  await page.getByRole('button', { name: 'Get My Quote' }).click()

  await expect(page.getByRole('heading', { name: 'Quote request received' })).toBeVisible()
  await expect(page.getByText('SH-E2E-1234')).toBeVisible()
  await expect(page.getByText(/confirmation.*sent/i)).toHaveCount(0)

  expect(requestBody).toMatchObject({
    name: 'Rudo Test',
    phone: '0771234567',
    vertical: 'residential',
    params: { rooms: 3, windowDeepClean: false },
  })
  expect(requestBody).not.toHaveProperty('quote')

  const whatsapp = page.getByRole('link', { name: /send via whatsapp/i })
  await expect(whatsapp).toHaveAttribute('href', /^https:\/\/wa\.me\/263774449064\?text=/)
  await expect(whatsapp).toHaveAttribute('href', /Rudo%20Test/)

  await page.reload()
  await expect(page.getByText(/1 quote request received by our office/)).toBeVisible()
})

test('a failed API call keeps the draft and can be retried idempotently', async ({ page }) => {
  const requestIds: unknown[] = []
  let attempts = 0

  await page.route('**/api/leads', async route => {
    attempts += 1
    const body = route.request().postDataJSON() as Record<string, unknown>
    requestIds.push(body.clientRequestId)

    if (attempts === 1) {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'insert_failed' }),
      })
      return
    }

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ reference: 'SH-RETRY-5678', totalCents: 12_000, duplicate: false }),
    })
  })

  await page.goto('/')
  await page.getByRole('button', { name: /calculate your instant quote/i }).click()
  await page.getByLabel('Full Name').fill('Retry User')
  await page.getByLabel('Phone Number').fill('0779999999')
  await page.getByRole('button', { name: 'Get My Quote' }).click()

  await expect(page.getByRole('alert')).toContainText(/could not save your request/i)
  await expect(page.getByText('Nothing has been sent yet')).toBeVisible()
  await expect(page.getByText(/1 saved quote on this device/)).toBeVisible()
  await expect(page.getByRole('link', { name: /send via whatsapp/i })).toBeVisible()

  await page.getByRole('button', { name: 'Try again' }).click()

  await expect(page.getByRole('heading', { name: 'Quote request received' })).toBeVisible()
  await expect(page.getByText('SH-RETRY-5678')).toBeVisible()
  expect(attempts).toBe(2)
  expect(requestIds[0]).toBe(requestIds[1])
})

test('offline submission keeps the draft and never calls the API', async ({ page, context }) => {
  let apiCalls = 0
  await page.route('**/api/leads', async route => {
    apiCalls += 1
    await route.abort()
  })

  await page.goto('/')
  await page.getByRole('button', { name: /calculate your instant quote/i }).click()
  await expect(page.getByRole('slider', { name: 'Floor Area' })).toBeVisible()

  await context.setOffline(true)
  await page.getByLabel('Full Name').fill('Offline User')
  await page.getByLabel('Phone Number').fill('0779999999')
  await page.getByRole('button', { name: 'Get My Quote' }).click()

  await expect(page.getByText(/You are offline/)).toBeVisible()
  await expect(page.getByText('Nothing has been sent yet')).toBeVisible()
  expect(apiCalls).toBe(0)

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
