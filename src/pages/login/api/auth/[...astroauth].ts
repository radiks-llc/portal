import { getUserByEmail } from "@data/db";

import AstroAuth from "@astro-auth/core";
import { CredentialProvider } from "@astro-auth/providers";
import bcrypt from "bcryptjs";

export const all = AstroAuth({
  authProviders: [
    CredentialProvider({
      authorize: async ({ email, password }) => {
        const user = getUserByEmail(email);

        if (!user) return null;

        if (bcrypt.compareSync(password, user.password)) {
          return { email };
        }

        return null;
      },
    }),
  ],
});
