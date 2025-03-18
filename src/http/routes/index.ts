import { InternalServerError } from '@/errors/internal-server-error'
import { Hono } from 'hono'
import { requestId } from 'hono/request-id'
import { statusRoutes } from './status'

export const routes = new Hono().basePath('v1')

routes.use(requestId())

routes.route('/status', statusRoutes)

routes.onError((err, c) => {
  const internalServerError = new InternalServerError({ cause: err })
  console.error(internalServerError)

  return c.json(internalServerError, internalServerError.statusCode)
})
