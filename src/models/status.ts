import { sql } from 'drizzle-orm'

import { db } from '@/db/connection'

export const status = {
  database: {
    getVersion: async (): Promise<string> => {
      const {
        rows: [{ server_version }],
      } = await db.execute<{ server_version: string }>(sql`SHOW server_version`)

      return server_version
    },
    getMaxConnections: async (): Promise<number> => {
      const {
        rows: [{ max_connections }],
      } = await db.execute<{ max_connections: string }>(
        sql`SHOW max_connections`
      )

      return Number(max_connections)
    },
    getOpenedConnections: async (): Promise<number> => {
      const {
        rows: [{ count }],
      } = await db.execute<{ count: number }>(
        sql`SELECT count(*)::int FROM pg_stat_activity WHERE datname = 'foodfy-hono-bun'`
      )

      return count
    },
  },
}
