import { status } from '@/models/status'
import { Hono } from 'hono'

export const statusRoutes = new Hono()

statusRoutes.get('/', async (c) => {
  const databaseVersion = await status.database.getVersion()
  const databaseMaxConnections = await status.database.getMaxConnections()
  const databaseOpenedConnections = await status.database.getOpenedConnections()

  return c.json({
    updated_at: new Date().toISOString(),
    dependencies: {
      database: {
        version: databaseVersion,
        max_connections: databaseMaxConnections,
        opened_connections: databaseOpenedConnections,
      },
    },
  })
})
