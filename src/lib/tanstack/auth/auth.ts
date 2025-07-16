import { getAccount } from "@/lib/appwrite/client";
import { queryKeyPrefixes } from "@/lib/tanstack/client";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { ID, Models } from "react-native-appwrite";

// Types
export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface PasswordRecoveryData {
  email: string;
  url: string;
}

export interface PasswordResetData {
  userId: string;
  secret: string;
  password: string;
}

export interface EmailVerificationData {
  url: string;
}

export interface VerifyEmailData {
  userId: string;
  secret: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
  oldPassword?: string;
}

// Query Options
export function viewerQueryOptions() {
  return queryOptions({
    queryKey: [queryKeyPrefixes.viewer],
    queryFn: async (): Promise<Models.User<Models.Preferences> | null> => {
      try {
        const account = getAccount();
        return await account.get();
      } catch {
        // If user is not authenticated, return null instead of throwing
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function sessionQueryOptions() {
  return queryOptions({
    queryKey: [queryKeyPrefixes.auth, "session"],
    queryFn: async () => {
      try {
        const account = getAccount();
        return await account.getSession("current");
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Mutation Options
export function signUpMutationOptions() {
  return mutationOptions({
    mutationFn: async (data: SignUpData) => {
      const account = getAccount();
      const userId = ID.unique();
      
      // Create account
      const user = await account.create(userId, data.email, data.password, data.name);
      
      // Automatically sign in after registration
      await account.createEmailPasswordSession(data.email, data.password);
      
      return user;
    },
    onSuccess: (data) => {
      console.log("Sign up successful:", data);
    },
    onError: (error) => {
      console.error("Sign up error:", error);
    },
    meta: {
      invalidates: [
        [queryKeyPrefixes.viewer],
        [queryKeyPrefixes.auth, "session"],
      ],
    },
  });
}

export function signInMutationOptions() {
  return mutationOptions({
    mutationFn: async (data: SignInData) => {
      const account = getAccount();
      return await account.createEmailPasswordSession(data.email, data.password);
    },
    onSuccess: (data) => {
      console.log("Sign in successful:", data);
    },
    onError: (error) => {
      console.error("Sign in error:", error);
    },
    meta: {
      invalidates: [
        [queryKeyPrefixes.viewer],
        [queryKeyPrefixes.auth, "session"],
      ],
    },
  });
}

export function signOutMutationOptions() {
  return mutationOptions({
    mutationFn: async () => {
      const account = getAccount();
      return await account.deleteSession("current");
    },
    onSuccess: () => {
      console.log("Sign out successful");
    },
    onError: (error) => {
      console.error("Sign out error:", error);
    },
    meta: {
      invalidates: [
        [queryKeyPrefixes.viewer],
        [queryKeyPrefixes.auth, "session"],
      ],
    },
  });
}

export function signOutAllMutationOptions() {
  return mutationOptions({
    mutationFn: async () => {
      const account = getAccount();
      return await account.deleteSessions();
    },
    onSuccess: () => {
      console.log("Sign out from all devices successful");
    },
    onError: (error) => {
      console.error("Sign out all error:", error);
    },
    meta: {
      invalidates: [
        [queryKeyPrefixes.viewer],
        [queryKeyPrefixes.auth, "session"],
      ],
    },
  });
}

export function createPasswordRecoveryMutationOptions() {
  return mutationOptions({
    mutationFn: async (data: PasswordRecoveryData) => {
      const account = getAccount();
      return await account.createRecovery(data.email, data.url);
    },
    onSuccess: (data) => {
      console.log("Password recovery email sent:", data);
    },
    onError: (error) => {
      console.error("Password recovery error:", error);
    },
  });
}

export function updatePasswordRecoveryMutationOptions() {
  return mutationOptions({
    mutationFn: async (data: PasswordResetData) => {
      const account = getAccount();
      return await account.updateRecovery(data.userId, data.secret, data.password);
    },
    onSuccess: (data) => {
      console.log("Password reset successful:", data);
    },
    onError: (error) => {
      console.error("Password reset error:", error);
    },
    meta: {
      invalidates: [
        [queryKeyPrefixes.viewer],
        [queryKeyPrefixes.auth, "session"],
      ],
    },
  });
}

export function createEmailVerificationMutationOptions() {
  return mutationOptions({
    mutationFn: async (data: EmailVerificationData) => {
      const account = getAccount();
      return await account.createVerification(data.url);
    },
    onSuccess: (data) => {
      console.log("Email verification sent:", data);
    },
    onError: (error) => {
      console.error("Email verification error:", error);
    },
  });
}

export function verifyEmailMutationOptions() {
  return mutationOptions({
    mutationFn: async (data: VerifyEmailData) => {
      const account = getAccount();
      return await account.updateVerification(data.userId, data.secret);
    },
    onSuccess: (data) => {
      console.log("Email verified successfully:", data);
    },
    onError: (error) => {
      console.error("Email verification error:", error);
    },
    meta: {
      invalidates: [
        [queryKeyPrefixes.viewer],
      ],
    },
  });
}

export function updateProfileMutationOptions() {
  return mutationOptions({
    mutationFn: async (data: UpdateProfileData) => {
      const account = getAccount();
      const promises = [];
      
      if (data.name) {
        promises.push(account.updateName(data.name));
      }
      
      if (data.email) {
        promises.push(account.updateEmail(data.email, data.password || ""));
      }
      
      if (data.password && data.oldPassword) {
        promises.push(account.updatePassword(data.password, data.oldPassword));
      }
      
      return await Promise.all(promises);
    },
    onSuccess: (data) => {
      console.log("Profile updated successfully:", data);
    },
    onError: (error) => {
      console.error("Profile update error:", error);
    },
    meta: {
      invalidates: [
        [queryKeyPrefixes.viewer],
      ],
    },
  });
}
