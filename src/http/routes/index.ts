import { Hono } from 'hono'

import { statusRoutes } from './status'

export const routes = new Hono().basePath('v1')

routes.route('/status', statusRoutes)
