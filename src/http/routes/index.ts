import { ConflictError } from '@/errors/conflict-error'
import { InternalServerError } from '@/errors/internal-server-error'
import { ValidationError } from '@/errors/validation-error'
import { Hono } from 'hono'
import { statusRoutes } from './status'
import { usersRoutes } from './users'

export const routes = new Hono().basePath('v1')

routes.route('/status', statusRoutes)
routes.route('/users', usersRoutes)

routes.onError((error, c) => {
  if (error instanceof ConflictError) {
    return c.json(error, error.statusCode)
  }

  if (error instanceof ValidationError) {
    return c.json(error, error.statusCode)
  }

  const internalServerError = new InternalServerError({ cause: error })
  console.error(internalServerError)

  return c.json(internalServerError, internalServerError.statusCode)
})
