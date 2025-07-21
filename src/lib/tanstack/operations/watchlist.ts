import { pb } from "@/lib/pb/client";
import { queryOptions } from "@tanstack/react-query";
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
