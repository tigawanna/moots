import { betterAuth } from "better-auth";

import { Kysely } from "kysely";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { apiEnvVariables } from "@/lib/api-env";

import { expo } from "@better-auth/expo";

const db = new Kysely({
  dialect: new LibsqlDialect({
    url: apiEnvVariables.TURSO_DB_URL,
    authToken: apiEnvVariables.TURSO_DB_SECRET,
  }),
});

export const auth = betterAuth({
  database: db,
  secret: apiEnvVariables.BETTER_AUTH_SECRET,
  plugins: [expo()],
  trustedOrigins: ["moots://"], // Replace with your app's custom scheme.
  emailAndPassword: {
    enabled: true, // Enable authentication using email and password.
  },
  google: {
    enabled: true, // Enable Google authentication.
    clientId: apiEnvVariables.GOOGLE_CLIENT_ID,
    clientSecret: apiEnvVariables.GOOGLE_CLIENT_SECRET,
  },

});
