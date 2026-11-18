import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL)
const rows = await sql`select auth_user_id,email,name,role,status from staff_members`
console.log('staff_members:', JSON.stringify(rows, null, 2))
const leads = await sql`select count(*)::int as n from leads`
console.log('leads:', leads)
const quotes = await sql`select count(*)::int as n from quotes`
console.log('quotes:', quotes)
const bookings = await sql`select count(*)::int as n from bookings`
console.log('bookings:', bookings)
