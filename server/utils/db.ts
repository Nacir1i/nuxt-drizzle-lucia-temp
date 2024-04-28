import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { userTable } from '../db/schema/user';
import { sessionTable } from '../db/schema/session';

import postgres from 'postgres'

let sql: postgres.Sql<{}> | null
let db: PostgresJsDatabase<Record<string, never>> | null

export function useDatabase() {
  const config = useRuntimeConfig()
  
  if (sql && db)
    return db

  if (!config.dbUrl)
    // TODO: Add Logger
    throw new Error('Missing dbUrl in runtime config')

  sql = postgres(config.dbUrl, { max: 1 })
  db = drizzle(sql)

  return db
}

export function useDrizzleAdapter() {
  const db = useDatabase();

  return new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);
}