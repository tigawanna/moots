import { pb } from "@/lib/pb/client";
import { UsersResponse } from "@/lib/pb/types/pb-types";
import { queryOptions } from "@tanstack/react-query";

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

