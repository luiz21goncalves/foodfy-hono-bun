import { Hono } from 'hono'
import { requestId } from 'hono/request-id'
import { pinoLogger } from './middlewares/logger'
import { routes } from './routes'

const app = new Hono()

app.use('/api/*', requestId())
app.use('/api/*', pinoLogger)

app.route('/api', routes)

export { app }
