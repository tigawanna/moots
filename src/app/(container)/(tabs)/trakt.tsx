import { TraktSearchResults } from "@/components/trakt/TraktSearchResults";
import { useTraktSearch } from "@/lib/trakt/trakt-hooks";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Surface, useTheme,Searchbar } from "react-native-paper";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Trakt() {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  const handleSearchChange = useCallback((query: string) => {
    setQuery(query);
  }, []);
  const {
    data: searchResults,
    isLoading,
    error,
  } = useTraktSearch({
    query,
    limit: 20,
  });
  return (
    <Surface style={[styles.container, { paddingTop: top }]}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="try a show or movie name "
          onChangeText={handleSearchChange}
          value={query}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={colors.onSurfaceVariant}
          placeholderTextColor={colors.onSurfaceVariant}
        />
      </View>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  searchInput: {
    fontSize: 16,
  },
  searchResults: {
    marginTop: 4,
    marginLeft: 12,
    opacity: 0.7,
  },
});
