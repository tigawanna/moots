import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { envVariables } from "../env";

export const authClient = createAuthClient({
  baseURL: envVariables.EXPO_PUBLIC_BETTER_AUTH_URL, // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      scheme: "moots",
      storagePrefix: "moots",
      storage: SecureStore,
    }),
  ],
});
