import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { neon } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('Set DATABASE_URL_UNPOOLED or DATABASE_URL before running migrations.')
  process.exit(1)
}

const sql = neon(databaseUrl)
const directory = join(process.cwd(), 'db', 'migrations')
const files = (await readdir(directory)).filter(file => file.endsWith('.sql')).sort()

for (const file of files) {
  const source = await readFile(join(directory, file), 'utf8')
  const statements = source
    .split(/;\s*(?:\r?\n|$)/)
    .map(statement => statement.trim())
    .filter(Boolean)

  for (const statement of statements) {
    await sql.query(statement)
  }
  console.log(`applied ${file} (${statements.length} statements)`)
}

console.log('migrations complete')
