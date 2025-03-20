import { Hono } from 'hono'
import { apiRoutes } from './api/routes'

const app = new Hono()

app.route('/api', apiRoutes)

export { app }
