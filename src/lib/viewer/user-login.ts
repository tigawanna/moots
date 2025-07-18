import { mutationOptions } from "@tanstack/react-query";
import { authClient } from "../better-auth/client";

interface CreateBetterAuthUserOptions {
  email: string;
  password: string;
  name: string;
  image?: string;
}

interface LoginBetterAuthUserOptions {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export function createBetterAuthUser() {
  return mutationOptions({
    mutationFn: async (user: CreateBetterAuthUserOptions) => {
      const { data, error } = await authClient.signUp.email({
        email: user.email, // user email address
        password: user.password, // user password -> min 8 characters by default
        name: user.name, // user display name
        image: user.image, // User image URL (optional)
        callbackURL: "/profile", // A URL to redirect to after the user verifies their email (optional)
      });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}

export function loginBetterAuthUser() {
  return mutationOptions({
    mutationFn: async (user: LoginBetterAuthUserOptions) => {
      const { data, error } = await authClient.signIn.email(
        {
          /**
           * The user email
           */
          email: user.email,
          /**
           * The user password
           */
          password: user.password,
          /**
           * A URL to redirect to after the user verifies their email (optional)
           */
          callbackURL: "/",
          /**
           * remember the user session after the browser is closed.
           * @default true
           */
          rememberMe: user.rememberMe ?? false,
        },
        {
          //callbacks
        }
      );
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}


export async function signinWithGoggle() {
  return await authClient.signIn.social({
    provider: "google",
    callbackURL: "/", // this will be converted to a deep link (eg. `myapp://dashboard`) on native
  });
}
export async function signupWithGoggle() {
  return await authClient.signIn.social({
    provider: "google",
    callbackURL: "/profile", // this will be converted to a deep link (eg. `myapp://dashboard`) on native
  });
}
