import type { Config } from 'drizzle-kit'

export default {
  schema: './server/db/schema/*.ts',
  out: './server/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.NUXT_DB_URL!
  }
} satisfies Config