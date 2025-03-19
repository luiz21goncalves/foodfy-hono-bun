import { ConflictError } from '@/api/errors/conflict-error'
import { InternalServerError } from '@/api/errors/internal-server-error'
import { ValidationError } from '@/api/errors/validation-error'
import { pinoLogger } from '@/api/middlewares/logger'
import { Hono } from 'hono'

import { requestId } from 'hono/request-id'
import { statusRoutes } from './status/status.routes'
import { usersRoutes } from './users/users.routes'

export const apiRoutes = new Hono().basePath('/v1')

apiRoutes.use(requestId())
apiRoutes.use(pinoLogger)

apiRoutes.route('/status', statusRoutes)
apiRoutes.route('/users', usersRoutes)

apiRoutes.onError((error, c) => {
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
