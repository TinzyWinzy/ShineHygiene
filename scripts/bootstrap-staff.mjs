#!/usr/bin/env node
/**
 * Bootstrap the first Shine Hygiene staff member.
 *
 * Usage:
 *   node --env-file=.env.local scripts/bootstrap-staff.mjs <email> <password> "<name>" [role]
 *
 * Prerequisites:
 *   - NEON_AUTH_BASE_URL must be a real URL (not "provisioning").
 *   - DATABASE_URL must point at the target Neon database.
 *   - Migration 002_operations.sql must have been applied.
 *
 * This script creates the auth user via Neon Auth, then inserts a matching
 * staff_members row. It is intended for the very first owner/admin only;
 * subsequent staff should be invited through the ops console.
 */
import { neon } from '@neondatabase/serverless'
import { createRemoteJWKSet, jwtVerify } from 'jose'

const [email, passwordArg, name, role = 'owner'] = process.argv.slice(2)
const password = passwordArg === '-' ? process.env.STAFF_PASSWORD : passwordArg

if (!email || !password || !name) {
  console.error('Usage: bootstrap-staff.mjs <email> <password|-> "<name>" [role]')
  console.error('Pass "-" as the password to read it from the STAFF_PASSWORD environment variable.')
  process.exit(1)
}

const baseUrl = process.env.NEON_AUTH_BASE_URL
if (!baseUrl || baseUrl === 'provisioning') {
  console.error('NEON_AUTH_BASE_URL is not configured (still "provisioning"). Provision Neon Auth first.')
  process.exit(1)
}
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('DATABASE_URL is not configured.')
  process.exit(1)
}

const origin = new URL(baseUrl).origin
const allowedRoles = ['owner', 'admin', 'ops', 'cleaner']
if (!allowedRoles.includes(role)) {
  console.error(`Invalid role. Allowed: ${allowedRoles.join(', ')}`)
  process.exit(1)
}

function cookieHeader(response) {
  const cookies = response.headers.getSetCookie?.() ?? []
  if (cookies.length > 0) return cookies.join('; ')
  return response.headers.get('set-cookie') ?? ''
}

async function main() {
  const signUpResponse = await fetch(`${baseUrl.replace(/\/$/, '')}/sign-up/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify({ email, password, name }),
  })

  if (!signUpResponse.ok) {
    const text = await signUpResponse.text()
    console.error('Neon Auth sign-up failed:', signUpResponse.status, text)
    process.exit(1)
  }

  const cookies = cookieHeader(signUpResponse)
  const tokenResponse = await fetch(`${baseUrl.replace(/\/$/, '')}/token`, {
    method: 'GET',
    headers: cookies ? { Cookie: cookies } : {},
  })

  if (!tokenResponse.ok) {
    console.error('Neon Auth token exchange failed:', tokenResponse.status)
    process.exit(1)
  }

  const tokenData = (await tokenResponse.json())
  const token = tokenData?.token
  if (!token) {
    console.error('Neon Auth did not return a token.')
    process.exit(1)
  }

  const jwksUrl = process.env.NEON_AUTH_JWKS_URL ?? `${baseUrl.replace(/\/$/, '')}/.well-known/jwks.json`
  const jwks = createRemoteJWKSet(new URL(jwksUrl))
  const { payload } = await jwtVerify(token, jwks, { algorithms: ['EdDSA'], issuer: origin, audience: origin })
  const authUserId = payload.sub
  if (typeof authUserId !== 'string') {
    console.error('Could not extract user id from token.')
    process.exit(1)
  }

  const sql = neon(databaseUrl)
  await sql`
    insert into staff_members (auth_user_id, email, name, role, status)
    values (${authUserId}, ${email}, ${name}, ${role}, 'active')
    on conflict (auth_user_id) do update
      set email = excluded.email,
          name = excluded.name,
          role = excluded.role,
          status = 'active',
          updated_at = now()
  `

  console.log(`Staff member ready: ${name} <${email}> (${role})`)
  console.log(`Auth user id: ${authUserId}`)
}

main().catch(error => {
  console.error('Bootstrap failed:', error instanceof Error ? error.message : error)
  process.exit(1)
})
