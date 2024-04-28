import { pgTable, text } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: text("id").primaryKey().notNull(),
  facebookId: text("facebook_id").unique().notNull(),
  username: text("username").notNull(),
});

export type UserInsert = typeof userTable.$inferInsert;
export type UserSelect = typeof userTable.$inferSelect;
