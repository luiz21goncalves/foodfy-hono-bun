import { db } from '@/api/db/connection'
import { ENV } from '@/env'
import { sql } from 'drizzle-orm'

export const statusService = {
  getDatabaseVersion: async (): Promise<string> => {
    const {
      rows: [{ server_version }],
    } = await db.execute<{ server_version: string }>(sql`SHOW server_version`)

    return server_version
  },
  getDatabaseMaxConnections: async (): Promise<number> => {
    const {
      rows: [{ max_connections }],
    } = await db.execute<{ max_connections: string }>(sql`SHOW max_connections`)

    return Number(max_connections)
  },
  getDatabaseOpenedConnections: async (): Promise<number> => {
    const {
      rows: [{ count }],
    } = await db.execute<{ count: number }>(
      sql`SELECT count(*)::int FROM pg_stat_activity WHERE datname = ${ENV.POSTGRES_DB}`
    )

    return count
  },
}
