import { useLocalSearchParams, router } from "expo-router";

export function useWatchlistSearch() {
  const { query } = useLocalSearchParams<{ query: string }>();
  return {
    searchQuery:query || "",
    setSearchQuery: (query: string) => {
      router.setParams({ query });
    },

  };
}
