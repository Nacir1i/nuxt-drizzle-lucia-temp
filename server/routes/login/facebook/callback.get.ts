import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { userTable, UserSelect, UserInsert } from "~/server/db/schema/user";

export function isArrayEmpty(arr: any[] | undefined) {
  if (!arr) return false;
  return arr.length === 0;
}

interface FacebookUser {
  id: string;
  name: string;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const code = query.code?.toString() ?? null;
  const state = query.state?.toString() ?? null;
  const storedState = getCookie(event, "facebook_oauth_state") ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      status: 400,
    });
  }

  try {
    const db = useDatabase();
    const tokens = await facebook.validateAuthorizationCode(code);
    const facebookUserResponse = await fetch(
      `https://graph.facebook.com/v19.0/me?access_token=${tokens.accessToken}`
    );

    const facebookUser: FacebookUser = await facebookUserResponse.json();

    const existingUser: UserSelect[] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.facebookId, facebookUser.id));

    if (!isArrayEmpty(existingUser)) {
      const session = await lucia.createSession(existingUser[0].id, {});
      appendHeader(
        event,
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize()
      );
      return sendRedirect(event, "/");
    }

    const userId = generateIdFromEntropySize(10);

    const newUser: UserInsert = {
      id: userId,
      facebookId: facebookUser.id,
      username: facebookUser.name,
    };

    await db.insert(userTable).values(newUser);

    const session = await lucia.createSession(userId, {});
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize()
    );
    return sendRedirect(event, "/");
  } catch (e) {
    console.error(e);
    if (e instanceof OAuth2RequestError) {
      throw createError({
        status: 400,
      });
    }
    throw createError({
      status: 500,
    });
  }
});
