import { TMDBSearchResults } from "@/components/tmdb/TMDBSearchResults";
import { useTMDBSearch } from "@/lib/tmdb/tmdb-hooks";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar, Surface, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Tmbd() {
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
  } = useTMDBSearch({
    query,
    page: 1,
  });

  return (
    <Surface style={[styles.container, { paddingTop: top }]}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search movies, TV shows, people..."
          onChangeText={handleSearchChange}
          value={query}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={colors.onSurfaceVariant}
          placeholderTextColor={colors.onSurfaceVariant}
        />
      </View>
      <TMDBSearchResults
        query={query}
        results={searchResults?.results}
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
});
