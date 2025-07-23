import { useTraktSearch } from "@/lib/trakt/trakt-hooks";
import { TraktSearchResults } from "./TraktSearchResults";

export function SearchResults({ query }: { query: string }) {
  const { data: searchResults, isLoading, error } = useTraktSearch({ 
    query, 
    limit: 20 
  });

  return (
    <TraktSearchResults 
      query={query}
      results={searchResults}
      isLoading={isLoading}
      error={error}
    />
  );
}
