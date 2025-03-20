import { z } from 'zod'

const envSchema = z.object({
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['production', 'development', 'test']),
  LOGGER_LEVEL: z.string().optional(),
  MAILER_SMTP_URL: z.string().url(),
})

export const ENV = envSchema.parse(process.env)
