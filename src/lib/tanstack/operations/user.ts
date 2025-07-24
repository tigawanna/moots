import { pb } from "@/lib/pb/client";
import { UsersCreate, UsersResponse } from "@/lib/pb/types/pb-types";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export function viewerQueryOptions() {
  return queryOptions({
    queryKey: ["viewer"],
    queryFn: async () => {
      const viewer = (await pb.authStore.record) as UsersResponse;
      return viewer;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function logoutViewerMutationOptions() {
  return mutationOptions({
    mutationFn: async () => {
      await pb.authStore.clear();
    },
    meta: {
      invalidates: [["viewer"]],
    },
  });
}

export function signinMutationOption() {
  return mutationOptions({
    mutationFn: ({ password, usernameOrEmail }: { usernameOrEmail: string; password: string }) => {
      return pb.from("users").authWithPassword(usernameOrEmail, password);
    },
    meta: {
      invalidates: [["viewer"]],
    },
  });
}
export function signupMutationOption() {
  return mutationOptions({
    mutationFn: (
      input: UsersCreate & {
        email:string;
        password: string;
        passwordConfirm:string
      }
    ) => {
      return pb.from("users").create(input);
    },
    meta: {
      invalidates: [["viewer"]],
    },
  });
}
