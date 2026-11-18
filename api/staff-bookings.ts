/// <reference types="node" />
import { neon } from '@neondatabase/serverless'
import { getStaffFromNeonToken } from './_lib/neon-auth.js'

interface ApiRequest {
  method?: string
  query?: Record<string, string | string[] | undefined>
  body?: unknown
  headers: Record<string, string | string[] | undefined>
}

interface ApiResponse {
  setHeader(name: string, value: string): void
  status(code: number): ApiResponse
  json(body: unknown): void
}

function headerValue(req: ApiRequest, name: string): string | undefined {
  const value = req.headers[name] ?? req.headers[name.toLowerCase()]
  return Array.isArray(value) ? value[0] : value
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'POST') {
    const body = req.body as {
      quoteId?: unknown
      scheduledDate?: unknown
      scheduledTime?: unknown
      assignedStaffAuthUserId?: unknown
    } | null

    if (typeof body?.quoteId !== 'string' || typeof body?.scheduledDate !== 'string' || typeof body?.scheduledTime !== 'string') {
      res.status(400).json({ error: 'invalid_booking' })
      return
    }

    const authorization = headerValue(req, 'authorization')
    const token = authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : undefined
    if (!token) {
      res.status(401).json({ error: 'unauthorized' })
      return
    }

    const staff = await getStaffFromNeonToken(token)
    if (!staff) {
      res.status(403).json({ error: 'staff_access_required' })
      return
    }

    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      res.status(500).json({ error: 'missing_database_url' })
      return
    }

    const sql = neon(databaseUrl)
    const quotes = (await sql`
      select
        q.id,
        q.lead_id,
        q.customer_name,
        q.customer_phone,
        q.vertical,
        q.params,
        q.quote,
        q.total_cents,
        q.status,
        q.currency,
        q.source,
        q.created_at,
        l.client_request_id,
        l.preferred_date,
        l.preferred_time
      from quotes q
      join leads l on l.id = q.lead_id
      where q.id = ${body.quoteId}
      limit 1
    `) as Array<Record<string, unknown>>

    const quote = quotes[0]
    if (!quote) {
      res.status(404).json({ error: 'quote_not_found' })
      return
    }

    const existingBooking = (await sql`
      select id from bookings where quote_id = ${String(quote.id)} limit 1
    `) as Array<{ id: string }>
    if (existingBooking.length > 0) {
      res.status(409).json({ error: 'booking_already_exists' })
      return
    }

    const assignedStaffAuthUserId =
      typeof body.assignedStaffAuthUserId === 'string' && body.assignedStaffAuthUserId
        ? body.assignedStaffAuthUserId
        : staff.id

    const booking = (await sql`
      insert into bookings (
        quote_id,
        reference,
        customer_name,
        customer_phone,
        vertical,
        scheduled_date,
        scheduled_time,
        status,
        assigned_staff_auth_user_id,
        notes
      )
      values (
        ${String(quote.id)},
        ${`BK-${Date.now()}`},
        ${String(quote.customer_name)},
        ${String(quote.customer_phone)},
        ${String(quote.vertical)},
        ${body.scheduledDate},
        ${body.scheduledTime},
        'confirmed',
        ${assignedStaffAuthUserId},
        '{}'::jsonb
      )
      returning id,
        quote_id,
        reference,
        customer_name,
        customer_phone,
        vertical,
        scheduled_date,
        scheduled_time,
        status,
        assigned_staff_auth_user_id,
        notes
    `) as Array<Record<string, unknown>>

    await sql`
      update quotes
      set status = 'confirmed',
          updated_at = now()
      where id = ${String(quote.id)}
    `

    await sql`
      update leads
      set status = 'won'
      where id = ${String(quote.lead_id)}
        and status <> 'won'
    `
    await sql`
      insert into audit_events (actor_id, action, entity_type, entity_id, payload)
      values (${staff.id}, 'booking_confirmed', 'booking', ${String(booking[0]?.id ?? quote.id)}, ${JSON.stringify({ quoteId: String(quote.id), scheduledDate: body.scheduledDate, scheduledTime: body.scheduledTime })})
    `

    res.status(201).json({ data: { staff, booking: booking[0] } })
    return
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST')
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const authorization = headerValue(req, 'authorization')
  const token = authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : undefined
  if (!token) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }

  const staff = await getStaffFromNeonToken(token)
  if (!staff) {
    res.status(403).json({ error: 'staff_access_required' })
    return
  }

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    res.status(500).json({ error: 'missing_database_url' })
    return
  }

  const sql = neon(databaseUrl)
  const bookings = (await sql`
    select
      b.id,
      b.quote_id,
      b.reference,
      b.customer_name,
      b.customer_phone,
      b.vertical,
      b.scheduled_date,
      b.scheduled_time,
      b.status as status,
      b.notes,
      q.status as quote_status,
      q.total_cents,
      q.currency,
      q.created_at as quote_created_at,
       b.created_at as created_at,
      l.client_request_id,
      l.preferred_date,
      l.preferred_time
    from bookings b
    join quotes q on q.id = b.quote_id
    join leads l on l.id = q.lead_id
    order by b.created_at desc
    limit 100
  `) as Array<Record<string, unknown>>

  res.status(200).json({ data: { staff, bookings } })
}
