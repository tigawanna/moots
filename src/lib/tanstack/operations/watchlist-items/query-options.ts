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

export function watchListQueryOptions({ userId, page = 1 }: UseWatchListQueryFunctionProps) {
  return queryOptions({
    queryKey: userId ? ["watchlist-items", userId, page] : ["watchlist-items", "all", page],
    queryFn: () => {
      const { filters, searchTerm, sort } = useUserWatchListFiltersStore.getState();
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

interface AddToWatchListMutationOptionsProps {
  userId: string;
  payload: WatchlistItemsCreate;
}

export function addToWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: ({ userId, payload }: AddToWatchListMutationOptionsProps) => {
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
  });
}

interface RemoveFromWatchListMutationOptionsProps {
  itemId: string;
}

export function removeFromWatchListMutationOptions() {
  return mutationOptions({
    mutationFn: ({ itemId }: RemoveFromWatchListMutationOptionsProps) => {
      return pb.from("watchlist").delete(itemId);
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
  });
}

export function toggleWatchedListItemMutationOptions() {
  return mutationOptions({
    mutationFn: ({ itemId, watched }: { itemId: string; watched: boolean }) => {
      return pb.from("watchlist_items").update(itemId, {
        watched_status: watched,
      } as WatchlistItemsUpdate);
    },
  });
}
