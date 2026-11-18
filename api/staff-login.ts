/// <reference types="node" />
import { getStaffFromNeonToken } from './_lib/neon-auth.js'

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

function cookieHeader(response: Response): string {
  const cookies = response.headers.getSetCookie?.() ?? []
  if (cookies.length > 0) return cookies.join('; ')
  return response.headers.get('set-cookie') ?? ''
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const body = req.body as { email?: unknown; password?: unknown } | null
  if (typeof body?.email !== 'string' || typeof body?.password !== 'string') {
    res.status(400).json({ error: 'invalid_credentials' })
    return
  }

  const baseUrl = process.env.NEON_AUTH_BASE_URL
  if (!baseUrl) {
    res.status(500).json({ error: 'missing_neon_auth_env' })
    return
  }

  // Neon Auth validates the Origin header against its trusted origins. A server
  // to server call is not a browser request, so identify it with the auth
  // service's own origin rather than the caller's Origin.
  const authUrl = baseUrl.replace(/\/$/, '')
  const authOrigin = new URL(baseUrl).origin
  const authResponse = await fetch(`${authUrl}/sign-in/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: authOrigin,
    },
    body: JSON.stringify({ email: body.email, password: body.password }),
  })

  if (!authResponse.ok) {
    res.status(401).json({ error: 'invalid_credentials' })
    return
  }

  const cookies = cookieHeader(authResponse)
  const tokenResponse = await fetch(`${authUrl}/token`, {
    method: 'GET',
    headers: cookies ? { Cookie: cookies } : {},
  })

  if (!tokenResponse.ok) {
    res.status(401).json({ error: 'invalid_credentials' })
    return
  }

  const tokenData = (await tokenResponse.json()) as { token?: string }
  const token = tokenData.token
  if (!token) {
    res.status(401).json({ error: 'invalid_credentials' })
    return
  }

  const user = await getStaffFromNeonToken(token)
  if (!user) {
    res.status(403).json({ error: 'staff_access_required' })
    return
  }

  res.status(200).json({
    accessToken: token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  })
}
