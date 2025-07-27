import { pb } from "@/lib/pb/client";
import { useQuery } from "@tanstack/react-query";
import { getUserWatchedlistQueryOptions, getUserWatchlistQueryOptions } from "./operations-options";

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

// interface UseIsWatchedProps {
//   tmdbId: string | number;
// }

// export function useIsWatched({ tmdbId }: UseIsWatchedProps): boolean {
//   const userId = pb.authStore.record?.id;
//   const { data: watchedItems } = useQuery({
//     ...getUserWatchedlistQueryOptions({ userId: userId! }),
//     enabled: !!userId && !!tmdbId,
//   });

//   // Check if the item is in the user's watched list
//   const isWatched = watchedItems?.some((watchedItem) => {
//     return watchedItem === Number(tmdbId);
//   });

//   return !!isWatched;
// }
