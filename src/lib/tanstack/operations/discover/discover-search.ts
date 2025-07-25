import { router, useLocalSearchParams } from "expo-router";

export function useDiscoverSearchQuery() {
  const { query } = useLocalSearchParams<{
    query: string;
  }>();
  const setDiscoverKeyword = (newTerm: string) => {
    router.setParams({
      query: newTerm,
    });
  };
  return { query, setDiscoverKeyword };
}
