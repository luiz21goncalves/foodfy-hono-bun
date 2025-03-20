import { pino } from 'pino'
import { ENV } from './env'

export const logger = pino({
  level: ENV.LOGGER_LEVEL,
})
