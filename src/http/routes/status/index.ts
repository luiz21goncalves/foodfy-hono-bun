import { Hono } from 'hono'

export const status = new Hono()

status.get('/', (c) => {
  return c.json({
    updated_at: new Date(),
    dependencies: {},
  })
})
