import { pb } from "@/lib/pb/client";
import { WatchlistResponse } from "@/lib/pb/types/pb-types";
import { queryOptions } from "@tanstack/react-query";
import { and, eq, like } from "@tigawanna/typed-pocketbase";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UseWatchListQueryFunctionProps {
  userId?: string;
  page?: number;
}

type WatchTimeKeys = keyof WatchlistResponse;

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
        setFilters: (filters) =>
          set((state) => ({ filters: { ...state.filters, ...filters } })),
      }),
      {
        name: "watchlist-filters-storage",
      }
    )
  )
);

export function useWatchListQueryOptions({
  userId,
  page = 1,
}: UseWatchListQueryFunctionProps) {
  return queryOptions({
    queryKey: ["user-watchlist", userId, page],
    queryFn: () => {
      const { filters, searchTerm, sort } =
        useUserWatchListFiltersStore.getState();

      if (!userId) {
        return {
          items: [],
          page: 1,
          perPage: 25,
          totalItems: 0,
          totalPages: 0,
        };
      }

      return pb.from("watchlist").getList(page, 25, {
        filter: and(
          eq("user_id", [userId]),
          searchTerm ? like("title", `%${searchTerm}%`) : undefined,
          filters.watched !== undefined
            ? eq("watched_status", filters.watched)
            : undefined
        ),
        sort: `${sort.direction === "desc" ? "-" : ""}${sort.field}` as any,
      });
    },
    staleTime:0,
    gcTime:0,
    // staleTime: 12 * 60 * 60 * 1000, // 12 hours
  });
}
