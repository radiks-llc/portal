import { getUserByEmail } from "@data/db";

import AstroAuth from "@astro-auth/core";
import { CredentialProvider } from "@astro-auth/providers";
import bcrypt from "bcryptjs";

export const all = AstroAuth({
  authProviders: [
    CredentialProvider({
      authorize: async ({ email, password }) => {
        try {
          const user = getUserByEmail(email);

          if (!user) return null;

          if (bcrypt.compareSync(password, user.password)) {
            return { id: user.id, email };
          }

          return null;
        } catch (e) {
          console.log(e);
        }
      },
    }),
  ],
});
