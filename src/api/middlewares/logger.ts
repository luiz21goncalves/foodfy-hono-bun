import { logger } from '@/logger'
import { createMiddleware } from 'hono/factory'

export const pinoLogger = createMiddleware(async (c, next) => {
  const { method, path } = c.req
  const requestId = c.get('requestId')

  logger.info({ requestId, request: { method, path } }, 'Incoming request')

  const start = Date.now()

  await next()

  const { status } = c.res

  logger.info(
    {
      requestId,
      response: { status, ok: c.res.ok, time: time(start) },
    },
    'Request completed'
  )
})

function humanize(times: string[]): string {
  const [delimiter, separator] = [',', '.']
  const orderTimes = times.map((v) =>
    v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${delimiter}`)
  )

  return orderTimes.join(separator)
}

function time(start: number): string {
  const delta = Date.now() - start

  return humanize([
    delta < 1000 ? `${delta}ms` : `${Math.round(delta / 1000)}s`,
  ])
}
