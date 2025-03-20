import { ValidationError } from '@/api/errors/validation-error'
import { logger } from '@/logger'
import { zValidator as zv } from '@hono/zod-validator'
import type { ValidationTargets } from 'hono'
import type { ZodSchema } from 'zod'

export const zValidator = <
  T extends ZodSchema,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T
) => {
  return zv(target, schema, (result, c) => {
    const requestId = c.get('requestId')
    logger.trace({ requestId, target, data: result.data }, 'Validation params')

    if (!result.success) {
      const details = result.error.flatten().fieldErrors
      logger.trace(
        { requestId, target, data: result.data, details },
        'Validation failed'
      )
      throw new ValidationError({ details })
    }
  })
}
