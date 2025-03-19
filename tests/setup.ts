import { beforeAll } from 'bun:test'
import { execSync } from 'node:child_process'
import { db } from '@/api/db/connection'
import { sql } from 'drizzle-orm'

beforeAll(async () => {
  await db.execute(
    sql`DROP SCHEMA IF EXISTS drizzle CASCADE; DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public`
  )

  execSync('bun run migrate')
})
