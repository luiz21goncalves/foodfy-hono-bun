import { pino } from 'pino'
import { ENV } from './env'

export const logger = pino({
  enabled: ENV.NODE_ENV !== 'test',
})
