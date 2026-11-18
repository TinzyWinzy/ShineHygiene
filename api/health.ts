/// <reference types="node" />
import { neon } from '@neondatabase/serverless'

interface ApiRequest {
  method?: string
  headers: Record<string, string | string[] | undefined>
}

interface ApiResponse {
  setHeader(name: string, value: string): void
  status(code: number): ApiResponse
  json(body: unknown): void
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    res.status(503).json({ status: 'degraded', db: 'missing_database_url' })
    return
  }

  try {
    const sql = neon(databaseUrl)
    await sql`select 1`
    res.status(200).json({ status: 'ok', db: 'ok' })
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      db: error instanceof Error ? error.message : 'unavailable',
    })
  }
}
