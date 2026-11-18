/// <reference types="node" />
import { neon } from '@neondatabase/serverless'
import { getStaffFromNeonToken } from './_lib/neon-auth.js'

interface ApiRequest {
  method?: string
  query?: Record<string, string | string[] | undefined>
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

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
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
  const quotes = (await sql`
    select
      q.id,
      q.reference,
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
    order by q.created_at desc
    limit 100
  `) as Array<Record<string, unknown>>

  res.status(200).json({ data: { staff, quotes } })
}
