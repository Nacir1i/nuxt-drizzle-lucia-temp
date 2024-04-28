import { Lucia } from "lucia";
import { Facebook } from "arctic";
import { useDrizzleAdapter } from "./db";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  facebookId: number;
  username: string;
}

const adapter = useDrizzleAdapter();

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      facebookId: attributes.facebookId,
      username: attributes.username,
    };
  },
});

const config = useRuntimeConfig();

export const facebook = new Facebook(
  config.facebookClientId,
  config.facebookClientSecret,
  "http://localhost:3000/login/facebook/callback"
);
