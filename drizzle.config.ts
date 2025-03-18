import { ENV } from '@/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dbCredentials: {
    url: ENV.DATABASE_URL,
  },
  dialect: 'postgresql',
  out: './drizzle',
})
