import { readFileSync } from 'node:fs'
import { createRemoteJWKSet, jwtVerify } from 'jose'
const base = process.env.NEON_AUTH_BASE_URL
const lines = readFileSync('.staff-bootstrap.local', 'utf8').split(/\r?\n/)
const email = lines.find(l => l.startsWith('email='))?.slice(6)
const password = lines.find(l => l.startsWith('password='))?.slice(9)
const origin = new URL(base).origin
const url = base.replace(/\/$/, '')

const signIn = await fetch(`${url}/sign-in/email`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: origin },
  body: JSON.stringify({ email, password }),
})
console.log('sign-in status:', signIn.status)
console.log('set-cookie:', signIn.headers.getSetCookie?.())
const cookies = (signIn.headers.getSetCookie?.() ?? []).join('; ')
console.log('cookie string length:', cookies.length)
const body = await signIn.json()
console.log('body token length:', body.token?.length, 'user id:', body.user?.id)

const tokenRes = await fetch(`${url}/token`, { method: 'GET', headers: cookies ? { Cookie: cookies } : {} })
console.log('token status:', tokenRes.status, 'set-cookie:', tokenRes.headers.getSetCookie?.())
const tokenText = await tokenRes.text()
console.log('token body preview:', tokenText.slice(0, 120))

try {
  const jwks = createRemoteJWKSet(new URL(`${url}/.well-known/jwks.json`))
  const token = JSON.parse(tokenText).token
  const { payload } = await jwtVerify(token, jwks, { algorithms: ['EdDSA'], issuer: origin, audience: origin })
  console.log('jwt ok sub:', payload.sub, 'email:', payload.email)
} catch (e) {
  console.log('jwt error:', e.message)
}
