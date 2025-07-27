import { pb } from "@/lib/pb/client";
import {
    WatchlistItemsCreate,
    WatchlistItemsResponse,
    WatchlistItemsUpdate
} from "@/lib/pb/types/pb-types";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UseWatchListQueryFunctionProps {
  userId?: string;
  page?: number;
}

type WatchTimeKeys = keyof WatchlistItemsResponse;

interface WatchlistFiltersState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sort: {
    field: WatchTimeKeys;
    direction: "asc" | "desc";
  };
  setSort: (sort: { field: WatchTimeKeys; direction: "asc" | "desc" }) => void;
  filters: {
    watched?: boolean;
  };
  setFilters: (filters: Partial<WatchlistFiltersState["filters"]>) => void;
}

export const useUserWatchListFiltersStore = create<WatchlistFiltersState>()(
  devtools(
    persist(
      (set) => ({
        searchTerm: "",
        setSearchTerm: (term) => set({ searchTerm: term }),
        sort: { field: "created", direction: "desc" },
        setSort: (sort) => set({ sort }),
        filters: { watched: false },
        setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
      }),
      {
        name: "watchlist-filters-storage",
      }
    )
  )
);

export function watchListItemsQueryOptions({ userId, page = 1 }: UseWatchListQueryFunctionProps) {
  return queryOptions({
    queryKey: userId ? ["watchlist-items", userId, page] : ["watchlist-items", "all", page],
    queryFn: () => {
      // const { filters, searchTerm, sort } = useUserWatchListFiltersStore.getState();
      return pb.from("watchlist_items").getList(page, 25, {
        // filter: and(
        //   userId ? eq("user_id", [userId]) : undefined,
        //   searchTerm ? like("title", `%${searchTerm}%`) : undefined,
        //   filters.watched !== undefined ? eq("watched_status", filters.watched) : undefined
        // ),
        // sort: `${sort.direction === "desc" ? "-" : ""}${sort.field}` as any,
      });
    },
    staleTime: 0,
    gcTime: 0,
    // staleTime: 12 * 60 * 60 * 1000, // 12 hours
  });
}

interface addToWatchListItemsMutationOptionsProps {
  userId: string;
  payload: WatchlistItemsCreate;
}

export function addToWatchListItemsMutationOptions() {
  return mutationOptions({
    mutationFn: ({ userId, payload }: addToWatchListItemsMutationOptionsProps) => {
      return pb.from("watchlist_items").create({
        id: String(payload.tmdb_id),
        added_by: userId,
        media_type: payload.media_type,
        tmdb_id: payload.tmdb_id,
        title: payload.title,
        backdrop_path: payload.backdrop_path || undefined,
        poster_path: payload.poster_path || undefined,
        overview: payload.overview || undefined,
        release_date: payload.release_date || undefined,
        vote_average: payload.vote_average || 0,
        genre_ids: payload.genre_ids || [],
      });
    },
    meta: {
      invalidates: [
        ["watchlist-items"], // Invalidate watchlist items queries
        ["watchlist"], // Also invalidate watchlist queries that might include this item
      ],
    },
  });
}

interface removeFromWatchListItemsMutationOptionsProps {
  itemId: string;
}

export function removeFromWatchListItemsMutationOptions() {
  return mutationOptions({
    mutationFn: ({ itemId }: removeFromWatchListItemsMutationOptionsProps) => {
      return pb.from("watchlist_items").delete(itemId);
    },
    meta: {
      invalidates: [
        ["watchlist-items"], // Invalidate watchlist items queries
        ["watchlist"], // Also invalidate watchlist queries that might include this item
      ],
    },
  });
}

interface UpdateWatchListMutationOptionsProps {
  itemId: string;
  payload: WatchlistItemsUpdate;
}

export function updateWatchListItemMutationOptions() {
  return mutationOptions({
    mutationFn: ({ itemId, payload }: UpdateWatchListMutationOptionsProps) => {
      return pb.from("watchlist_items").update(itemId, {
        ...payload,
      });
    },
    meta: {
      invalidates: [
        ["watchlist-items"], // Invalidate watchlist items queries
        ["watchlist"], // Also invalidate watchlist queries that might include this item
      ],
    },
  });
}

export function toggleWatchedListItemMutationOptions() {
  return mutationOptions({
    mutationFn: ({ itemId, watched }: { itemId: string; watched: boolean }) => {
      return pb.from("watchlist_items").update(itemId, {
        watched_status: watched,
      } as WatchlistItemsUpdate);
    },
    meta: {
      invalidates: [
        ["watchlist-items"], // Invalidate watchlist items queries
        ["watchlist"], // Also invalidate watchlist queries that might include this item
      ],
    },
  });
}

interface QuickAddToDefaultWatchlistProps {
  userId: string;
  payload: WatchlistItemsCreate;
}

export function quickAddToDefaultWatchlistMutationOptions() {
  return mutationOptions({
    mutationFn: async ({ userId, payload }: QuickAddToDefaultWatchlistProps) => {
      // First, get or create the user's default "Want to Watch" watchlist
      let defaultWatchlist;
      try {
        defaultWatchlist = await pb
          .from("watchlist")
          .getFirstListItem(`user_id ~ "${userId}" && title = "Want to Watch"`);
      } catch {
        // Create default watchlist if it doesn't exist
        defaultWatchlist = await pb.from("watchlist").create({
          user_id: [userId],
          title: "Want to Watch",
          overview: "My default watchlist",
          visibility: ["private"],
          is_collaborative: false,
        });
      }

      // Check if item already exists in watchlist_items
      let watchlistItem;
      try {
        watchlistItem = await pb
          .from("watchlist_items")
          .getFirstListItem(`tmdb_id = ${payload.tmdb_id}`);
      } catch {
        // Create the watchlist item if it doesn't exist
        watchlistItem = await pb.from("watchlist_items").create(payload);
      }

      // Add the item to the watchlist (use append to avoid duplicates)
      const updatedWatchlist = await pb.from("watchlist").update(
        defaultWatchlist.id,
        {
          "items+": watchlistItem.id,
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
    },
    meta: {
      invalidates: [
        ["watchlist"], // Invalidate all watchlist queries
        ["watchlist-items"], // Invalidate watchlist items queries
      ],
    },
  });
}
