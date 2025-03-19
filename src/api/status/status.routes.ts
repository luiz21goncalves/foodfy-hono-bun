import { Hono } from 'hono'
import { statusService } from './status.service'

export const statusRoutes = new Hono().get('/', async (c) => {
  const databaseVersion = await statusService.getDatabaseVersion()
  const databaseMaxConnections = await statusService.getDatabaseMaxConnections()
  const databaseOpenedConnetions =
    await statusService.getDatabaseOpenedConnections()

  return c.json(
    {
      dependencies: {
        database: {
          version: databaseVersion,
          opened_connections: databaseOpenedConnetions,
          max_connections: databaseMaxConnections,
        },
      },
      updated_at: new Date().toISOString(),
    },
    200
  )
})
