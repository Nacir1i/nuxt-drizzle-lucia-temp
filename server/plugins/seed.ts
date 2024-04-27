import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { useDatabase } from '~/server/utils/db'

async function seed(_db: PostgresJsDatabase<Record<string, never>>) {
    // TODO: Add Logger
    console.log("Seeding completed");
}

export default defineNitroPlugin(async (_nitroApp) => {
  try {
    if (process.dev) {
      const db = useDatabase();

      await seed(db);
    }
  }
  catch (error) {
    // TODO: Add Logger
    console.error(error);
  }
})