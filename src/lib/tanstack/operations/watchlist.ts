import { pb } from "@/lib/pb/client";
import { WatchlistItemsCreate } from "@/lib/pb/types/pb-types";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { eq } from "@tigawanna/typed-pocketbase";

interface GetWatchlistQueryOptionsprops {
  page: number;
  perPage?: number;
  userId?: string;
}
export function getWatchlistQueryOptions({
  page = 1,
  perPage = 24,
  userId,
}: GetWatchlistQueryOptionsprops) {
  return queryOptions({
    queryKey: userId ? ["watchlist", userId, page, perPage] : ["watchlist", page, perPage],
    queryFn: async () => {
      const response = await pb.from("watchlists").getList(page, perPage, {
        filter: userId ? eq("owner.id", userId) : undefined,
        sort: "-created",
        select: {
          expand: {
            owner: true,
          },
        },
      });
      return response;
    },
  });
}

interface GetWatchlistitemQueryOptionsprops {
  userId?: string;
  page?: number;
  perPage?: number;
}
export function getWatchlistitemQueryOptions({
  userId,
  page = 1,
  perPage = 24,
}: GetWatchlistitemQueryOptionsprops) {
  return queryOptions({
    queryKey: userId ? ["watchlistItem", userId, page, perPage] : ["watchlistItem", page, perPage],
    queryFn: async () => {
      const response = await pb.from("watchlistItems").getList(page, perPage, {
        sort: "-created"
      });
      return response;
    },
  });
}

export function addWatchlistitemMutationOptions(){
    return mutationOptions({
      mutationFn: async (newItem: WatchlistItemsCreate) => {
        const response = await pb.from("watchlistItems").create(newItem);
        return response;
      },
      
    });
}
