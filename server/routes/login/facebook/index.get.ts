import { generateState } from "arctic";
import { facebook } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  const state = generateState();
  const url = await facebook.createAuthorizationURL(state);

  setCookie(event, "facebook_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return sendRedirect(event, url.toString());
});
