import { getAccount } from "@/lib/appwrite/client";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { queryKeyPrefixes } from "@/lib/tanstack/client";


export function viewerQueryOptions() {
  return queryOptions({
    queryKey: [queryKeyPrefixes.viewer],
    queryFn: async () => {
      const account = getAccount();
      return await account.get();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function signupMutationOptions() {
  return mutationOptions({
    mutationFn: async (data: { email: string; password: string }) => {
      const account = getAccount();
      return await account.create("unique()", data.email, data.password);
    },
    onSuccess: (data) => {
      console.log("Signup successful:", data);
    },
    onError: (error) => {
      console.error("Signup error:", error);
    },
    meta: {
      invalidates: [[queryKeyPrefixes.viewer]],
    },
  });
}
