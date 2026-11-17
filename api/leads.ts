import { randomBytes } from 'node:crypto'
import { neon } from '@neondatabase/serverless'
import { MAX_LEAD_BODY_BYTES, parseLeadSubmission } from '../src/domain/leadSubmission'

interface ApiRequest {
  method?: string
  body?: unknown
  headers: Record<string, string | string[] | undefined>
}

interface ApiResponse {
  setHeader(name: string, value: string): void
  status(code: number): ApiResponse
  json(body: unknown): void
}

interface StoredLead {
  reference: string
  created_at: string
  total_cents: number
}

function headerValue(req: ApiRequest, name: string): string | undefined {
  const value = req.headers[name] ?? req.headers[name.toLowerCase()]
  return Array.isArray(value) ? value[0] : value
}

function reference(): string {
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  return `SH-${day}-${randomBytes(4).toString('hex').toUpperCase()}`
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === '23505'
  )
}

function parseBody(req: ApiRequest): unknown {
  if (typeof req.body === 'string') {
    if (Buffer.byteLength(req.body, 'utf8') > MAX_LEAD_BODY_BYTES) return null
    try {
      return JSON.parse(req.body) as unknown
    } catch {
      return null
    }
  }
  return req.body
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const contentType = headerValue(req, 'content-type') ?? ''
  if (!contentType.toLowerCase().includes('application/json')) {
    res.status(415).json({ error: 'unsupported_media_type' })
    return
  }

  const contentLength = Number(headerValue(req, 'content-length'))
  if (Number.isFinite(contentLength) && contentLength > MAX_LEAD_BODY_BYTES) {
    res.status(413).json({ error: 'payload_too_large' })
    return
  }

  const parsed = parseLeadSubmission(parseBody(req))
  if (!parsed.ok) {
    res.status(400).json({ error: 'invalid_lead', fields: parsed.errors })
    return
  }

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('lead_insert_failed: DATABASE_URL is not configured')
    res.status(503).json({ error: 'service_unavailable' })
    return
  }

  const sql = neon(databaseUrl)
  const lead = parsed.lead
  const paramsJson = JSON.stringify(lead.state.params)
  const quoteJson = JSON.stringify(lead.quote)

  try {
    let rows: StoredLead[] = []

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        rows = (await sql`
          insert into leads (
            client_request_id,
            reference,
            vertical,
            name,
            phone,
            preferred_date,
            preferred_time,
            params,
            quote,
            total_cents
          )
          values (
            ${lead.clientRequestId},
            ${reference()},
            ${lead.state.vertical},
            ${lead.name},
            ${lead.phone},
            ${lead.preferredDate},
            ${lead.preferredTime},
            ${paramsJson}::jsonb,
            ${quoteJson}::jsonb,
            ${lead.totalCents}
          )
          on conflict (client_request_id) do nothing
          returning reference, created_at, total_cents
        `) as StoredLead[]
        break
      } catch (error) {
        const message = error instanceof Error ? error.message : ''
        if (isUniqueViolation(error) && message.includes('leads_reference_key')) continue
        throw error
      }
    }

    if (rows.length > 0) {
      res.status(201).json({
        reference: rows[0].reference,
        createdAt: rows[0].created_at,
        totalCents: rows[0].total_cents,
        duplicate: false,
      })
      return
    }

    const existing = (await sql`
      select reference, created_at, total_cents
      from leads
      where client_request_id = ${lead.clientRequestId}
      limit 1
    `) as StoredLead[]

    if (existing.length === 0) {
      console.error('lead_insert_failed: conflict without existing row')
      res.status(500).json({ error: 'insert_failed' })
      return
    }

    res.status(200).json({
      reference: existing[0].reference,
      createdAt: existing[0].created_at,
      totalCents: existing[0].total_cents,
      duplicate: true,
    })
  } catch (error) {
    console.error('lead_insert_failed', error instanceof Error ? error.message : 'unknown error')
    res.status(500).json({ error: 'insert_failed' })
  }
}
