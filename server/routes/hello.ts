import { userTable, UserInsert } from "../db/schema/user";

export default defineEventHandler(async (event) => {
  const db = useDatabase();

  try {
    const res = await db.select().from(userTable);

    return { res };
  } catch (error) {
    return { error };
  }
});
