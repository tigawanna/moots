import { TMDBSearchResults } from "@/components/tmdb/TMDBSearchResults";
import { getCategoryLabel, getMediaTypeFromSort, useDiscoverFiltersStore } from "@/lib/tanstack/operations/discover/discover-fliters-store";
import { useDiscoverSearchQuery } from "@/lib/tanstack/operations/discover/discover-search";
import { useTMDBDiscover, useTMDBSearch } from "@/lib/tanstack/operations/discover/tmdb-hooks";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar, Surface, useTheme, } from "react-native-paper";
import { LoadingIndicatorDots } from "../state-screens/LoadingIndicatorDots";
import { DiscoverFeedFilters, FilterButton, useHasActiveFilters } from "./DiscoverFeedFilters";
import { DiscoverList } from "./DiscoverList";

export function DiscoverScreen() {
 const [activeTab, setActiveTab] = useState("discover");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { query: searchQuery } = useDiscoverSearchQuery();
const { filters } = useDiscoverFiltersStore();

 // Search hook
  const {
    data: searchResults,
    isLoading: searchLoading,
    error: searchError,
  } = useTMDBSearch({
    query: searchQuery,
    page: 1,
  });  // Discover hook - use filters from store
  const mediaType = getMediaTypeFromSort(filters);
  const categoryLabel = getCategoryLabel(filters.sort_by);
  
  const { data: discoverResults, isLoading: discoverLoading } = useTMDBDiscover({
    type: mediaType,
    params: {
      page: 1,
      ...filters,
    },
  });

  // Create a current category object for compatibility
  const currentCategory = {
    key: filters.sort_by.replace('.', '_'),
    label: categoryLabel,
    type: mediaType,
    sort: filters.sort_by,
  };

  if (discoverLoading) {
    return (
      <DiscoverScreenScafold setActiveTab={setActiveTab} setIsSearchFocused={setIsSearchFocused}>
        <View style={styles.loadingContainer}>
          <LoadingIndicatorDots />
        </View>
      </DiscoverScreenScafold>
    );
  }

  if (activeTab === "search" || isSearchFocused) {
    return (
      <DiscoverScreenScafold setActiveTab={setActiveTab} setIsSearchFocused={setIsSearchFocused}>
        <TMDBSearchResults
          query={searchQuery}
          results={searchResults?.results}
          isLoading={searchLoading}
          error={searchError}
        />
      </DiscoverScreenScafold>
    );
  }
  return (
    <DiscoverScreenScafold setActiveTab={setActiveTab} setIsSearchFocused={setIsSearchFocused}>
      <DiscoverList currentCategory={currentCategory} discoverResults={discoverResults} />
    </DiscoverScreenScafold>
  );
}

export function DiscoverScreenScafold({
  children,
  setActiveTab,
  setIsSearchFocused,
}: {
  children: React.ReactNode;
  setActiveTab?: (tab: string) => void;
  setIsSearchFocused?: (focused: boolean) => void;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = useHasActiveFilters();
  const { colors } = useTheme();
  const { query, setDiscoverKeyword } = useDiscoverSearchQuery();


  const handleSearchChange = useCallback(
    (query: string) => {
      setDiscoverKeyword(query);
      if (query.trim()) {
        setActiveTab?.("search");
      }
    },
    [setActiveTab, setDiscoverKeyword]
  );
  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused?.(true);
  }, [setIsSearchFocused]);

  const handleSearchBlur = useCallback(() => {
    setIsSearchFocused?.(false);
  }, [setIsSearchFocused]);


  return (
    <Surface style={{ ...styles.container }}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search movies, TV shows, people..."
          value={query || ""}
          onChangeText={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={colors.onSurfaceVariant}
          placeholderTextColor={colors.onSurfaceVariant}
        />
        <FilterButton onPress={() => setShowFilters(true)} hasActiveFilters={hasActiveFilters} />
        <DiscoverFeedFilters visible={showFilters} onDismiss={() => setShowFilters(false)} />
      </View>
      {children}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Search styles
  searchContainer: {
    width: "100%",
    maxWidth: "95%",
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    elevation: 2,
    width: "100%",
  },
  searchInput: {
    fontSize: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
