import { pb } from "@/lib/pb/client";
import { WatchlistCreate, WatchlistUpdate } from "@/lib/pb/types/pb-types";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { eq } from "@tigawanna/typed-pocketbase";

export function createWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: (newItem: WatchlistCreate) => {
      return pb.from("watchlist").create(newItem);
    },
  });
}

export function updateWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: (newItem: WatchlistUpdate) => {
      return pb.from("watchlist").update(newItem.id, newItem);
    },
  });
}

export function deleteWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: (id: string) => {
      return pb.from("watchlist").delete(id);
    },
  });
}

export function getUserWatchlistQueryOptions() {
  const userId = pb.authStore.record?.id;
  return queryOptions({
    queryKey: ["user-watchlist"],
    queryFn: () => {
      if (!userId) {
        throw new Error("User not authenticated");
      }
      // Fetch user watchlist items
      return pb.from("watchlist").getList(1, 25, {
        filter: eq("user_id", [userId]),
        sort: "-created",
      });
    },
    enabled: !!userId, // Only run if user is authenticated
  });
}
