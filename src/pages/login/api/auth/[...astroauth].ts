import AstroAuth from "@astro-auth/core";
import { CredentialProvider } from "@astro-auth/providers";
import { ensureSchema } from "./schema";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

const db = new Database("radiks.db");
ensureSchema(db);

export const all = AstroAuth({
  authProviders: [
    CredentialProvider({
      authorize: async ({ email, password }) => {
        const user = db
          .prepare("SELECT * FROM users WHERE email = ?")
          .get(email);

        if (!user) return null;

        if (bcrypt.compareSync(password, user.password)) {
          return { email };
        }

        return null;
      },
    }),
  ],
});
