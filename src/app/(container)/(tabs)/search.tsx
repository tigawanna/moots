import { SearchResults } from "@/components/trakt/TrakSearch";
import { TraktSearchResults } from "@/components/trakt/TraktSearchResults";
import { useTraktSearch } from "@/lib/trakt/trakt-hooks";
import React from "react";
import { StyleSheet } from "react-native";
import { Surface, useTheme } from "react-native-paper";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Search() {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const query = "uwu";
  const {
    data: searchResults,
    isLoading,
    error,
  } = useTraktSearch({
    query,
    limit: 20,
  });
  return (
    <Surface style={[styles.container,{paddingTop:top}]}>
      <TraktSearchResults
        query={query}
        results={searchResults}
        isLoading={isLoading}
        error={error}
      />
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
