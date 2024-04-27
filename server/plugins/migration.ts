import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { useDatabase } from '~/server/utils/db'

export default defineNitroPlugin(async (_nitroApp) => {
  try {
    if (process.dev) {
      const db = useDatabase();

      await migrate(db, { migrationsFolder: './server/db/migrations' });

      // TODO: Add Logger
      console.log("Migration completed");
    }
  }
  catch (error) {
    // TODO: Add Logger
    console.error(error);
  }
})