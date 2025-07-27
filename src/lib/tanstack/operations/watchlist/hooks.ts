import { pb } from "@/lib/pb/client";
import { useQuery } from "@tanstack/react-query";
import { getUserWatchlistQueryOptions } from "./operations-options";

interface UseIsInWatchlistProps {
  tmdbId: string | number;
}

export function useIsInWatchlist({ tmdbId }: UseIsInWatchlistProps): boolean {
  const userId = pb.authStore.record?.id;
  const { data: watchlists } = useQuery({ 
    ...getUserWatchlistQueryOptions({ userId }),
    enabled: !!userId && !!tmdbId,
    select: (data) => data.items || [],
  });

  // Check if the item is in any of the user's watchlists
  const isInWatchlist = watchlists?.some((watchlist) => {
    return watchlist.expand?.items?.some((item) => {
      return item.tmdb_id === Number(tmdbId);
    });
  });

  return !!isInWatchlist;
}
    