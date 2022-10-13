import AstroAuth from "@astro-auth/core";
import { CredentialProvider } from "@astro-auth/providers";
import { ensureSchema } from "./schema";
import Database from "better-sqlite3";

const db = new Database("radiks.db");
ensureSchema(db);

export const all = AstroAuth({
  authProviders: [
    CredentialProvider({
      authorize: async (properties) => {
        if (properties.email == "me@mitchellhynes.com") {
          return properties;
        }

        return null;
      },
    }),
  ],
});
