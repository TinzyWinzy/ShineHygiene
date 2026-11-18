import { neon } from '@neondatabase/serverless'
import { createRemoteJWKSet, jwtVerify } from 'jose'

export interface StaffUser {
  id: string
  email: string
  name: string
  role: string
}

interface NeonAuthUser {
  id: string
  email: string
  name?: string
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null

function getJwks() {
  if (!jwks) {
    const baseUrl = process.env.NEON_AUTH_BASE_URL
    if (!baseUrl) {
      throw new Error('missing_neon_auth_env')
    }
    const jwksUrl =
      process.env.NEON_AUTH_JWKS_URL ??
      `${baseUrl.replace(/\/$/, '')}/.well-known/jwks.json`
    jwks = createRemoteJWKSet(new URL(jwksUrl))
  }
  return jwks
}

export async function verifyNeonToken(token: string): Promise<NeonAuthUser | null> {
  const baseUrl = process.env.NEON_AUTH_BASE_URL
  if (!baseUrl) {
    throw new Error('missing_neon_auth_env')
  }

  const origin = new URL(baseUrl).origin
  try {
    const { payload } = await jwtVerify(token, getJwks(), {
      algorithms: ['EdDSA'],
      issuer: origin,
      audience: origin,
    })

    const id = payload.sub
    const email = payload.email
    if (typeof id !== 'string' || typeof email !== 'string') {
      return null
    }

    return {
      id,
      email,
      name: typeof payload.name === 'string' ? payload.name : undefined,
    }
  } catch {
    return null
  }
}

export async function getStaffFromNeonToken(token: string): Promise<StaffUser | null> {
  const user = await verifyNeonToken(token)
  if (!user) {
    return null
  }

  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('missing_database_url')
  }

  const sql = neon(databaseUrl)
  const rows = (await sql`
    select auth_user_id, email, name, role, status
    from staff_members
    where auth_user_id = ${user.id}
    limit 1
  `) as Array<{
    auth_user_id: string
    email: string
    name: string
    role: string
    status: string
  }>

  const staff = rows[0]
  if (!staff || staff.status !== 'active') {
    return null
  }

  if (staff.email.toLowerCase() !== user.email.toLowerCase()) {
    return null
  }

  const allowed = ['owner', 'admin', 'ops']
  if (!allowed.includes(staff.role)) {
    return null
  }

  return {
    id: staff.auth_user_id,
    email: staff.email,
    name: staff.name,
    role: staff.role,
  }
}
