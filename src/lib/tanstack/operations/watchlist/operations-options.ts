import { pb } from "@/lib/pb/client";
import { WatchlistCreate, WatchlistItemsCreate, WatchlistUpdate } from "@/lib/pb/types/pb-types";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { eq } from "@tigawanna/typed-pocketbase";

export function createWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: (newItem: WatchlistCreate) => {
      return pb.from("watchlist").create(newItem, {
        select: {
          expand: {
            items: true,
          },
        },
      });
    },
    meta: {
      invalidates: [
        ["watchlist"], // Invalidate all watchlist queries
      ],
    },
  });
}

export function updateWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: (newItem: WatchlistUpdate) => {
      return pb.from("watchlist").update(newItem.id, newItem, {
        select: {
          expand: {
            items: true,
          },
        },
      });
    },
    meta: {
      invalidates: [
        ["watchlist"], // Invalidate all watchlist queries
      ],
    },
  });
}

export function deleteWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: (id: string) => {
      return pb.from("watchlist").delete(id);
    },
    meta: {
      invalidates: [
        ["watchlist"], // Invalidate all watchlist queries
        ["watchlist-items"], // Invalidate watchlist items queries
      ],
    },
  });
}

interface GetUserWatchlistQueryOptionsProps {
  keyword?: string;
  userId?: string;
}
export function getUserWatchlistQueryOptions({
  keyword,
  userId,
}: GetUserWatchlistQueryOptionsProps) {
  return queryOptions({
    queryKey: userId ? ["watchlist", userId, keyword] : ["watchlist", "community", keyword],
    queryFn: () => {
      return pb.from("watchlist").getList(1, 25, {
        filter: userId ? `user_id ~ "${userId}"` : undefined,
        sort: "-created",
        select: {
          expand: {
            items: true,
          },
        },
      });
    },
    // enabled: !!userId, // Only run if user is authenticated
  });
}

export function addTowatchListMutationOptions() {
  return mutationOptions({
    mutationFn: async (payload: {
      watchlistId: string;
      itemPayload: WatchlistItemsCreate;
    }) => {
      const { watchlistId, itemPayload } = payload;
      
      // Check if item already exists in watchlist_items
      try {
        const existingItem = await pb
          .from("watchlist_items")
          .getFirstListItem(eq("tmdb_id", itemPayload.tmdb_id));
        
        // Item exists, just add it to the watchlist
        const updatedWatchlist = await pb.from("watchlist").update(
          watchlistId,
          {
            "items+": existingItem.id,
          } as any, // TypeScript casting needed for relation operations
          {
            select: {
              expand: {
                items: true,
              },
            },
          }
        );
        return updatedWatchlist;
      } catch {
        // Item doesn't exist, create it first then add to watchlist
        const newItem = await pb.from("watchlist_items").create(itemPayload);
        const updatedWatchlist = await pb.from("watchlist").update(
          watchlistId, 
          {
            "items+": newItem.id
          } as any, // TypeScript casting needed for relation operations
          {
            select: {
              expand: {
                items: true
              }
            }
          }
        );
        return updatedWatchlist;
      }
    },
    meta: {
      invalidates: [
        ["watchlist"], // Invalidate all watchlist queries
        ["watchlist-items"], // Invalidate watchlist items queries
      ],
    },
  });
}

export function removeFromWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: async (payload: {
      watchlistId: string;
      itemId: string;
    }) => {
      const { watchlistId, itemId } = payload;
      return pb.from("watchlist").update(
        watchlistId,
        {
          "items-": itemId,
        } as any, // TypeScript casting needed for relation operations
        {
          select: {
            expand: {
              items: true,
            },
          },
        }
      );
    },
    meta: {
      invalidates: [
        ["watchlist"], // Invalidate all watchlist queries
        ["watchlist-items"], // Invalidate watchlist items queries
      ],
    },
  });
}
