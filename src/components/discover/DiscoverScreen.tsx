import { TMDBSearchResults } from "@/components/tmdb/TMDBSearchResults";
import { getCategoryLabel, useDiscoverFiltersStore } from "@/lib/tanstack/operations/discover/discover-fliters-store";
import { useDiscoverSearchQuery } from "@/lib/tanstack/operations/discover/discover-search";
import { useTMDBDiscover, useTMDBSearch } from "@/lib/tanstack/operations/discover/tmdb-hooks";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar, Surface, useTheme } from "react-native-paper";
import { TabScreen, Tabs, TabsProvider } from "react-native-paper-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoadingIndicatorDots } from "../state-screens/LoadingIndicatorDots";
import { DiscoverFeedFilters, FilterButton, useHasActiveFilters } from "./DiscoverFeedFilters";
import { DiscoverList } from "./DiscoverList";

// Individual tab components for Movies and TV
function MovieDiscoverTab() {
  const { movieFilters, setActiveTab } = useDiscoverFiltersStore();
  
  React.useEffect(() => {
    setActiveTab("movie");
  }, [setActiveTab]);

  const categoryLabel = getCategoryLabel(movieFilters.sort_by);
  
  const { data: discoverResults, isLoading: discoverLoading } = useTMDBDiscover({
    type: "movie",
    params: {
      page: 1,
      ...movieFilters,
    },
  });

  const currentCategory = {
    key: movieFilters.sort_by.replace('.', '_'),
    label: categoryLabel,
    type: "movie" as const,
    sort: movieFilters.sort_by,
  };

  if (discoverLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingIndicatorDots />
      </View>
    );
  }

  return <DiscoverList currentCategory={currentCategory} discoverResults={discoverResults} />;
}

function TVDiscoverTab() {
  const { tvFilters, setActiveTab } = useDiscoverFiltersStore();
  
  React.useEffect(() => {
    setActiveTab("tv");
  }, [setActiveTab]);

  const categoryLabel = getCategoryLabel(tvFilters.sort_by);
  
  const { data: discoverResults, isLoading: discoverLoading } = useTMDBDiscover({
    type: "tv",
    params: {
      page: 1,
      ...tvFilters,
    },
  });

  const currentCategory = {
    key: tvFilters.sort_by.replace('.', '_'),
    label: categoryLabel,
    type: "tv" as const,
    sort: tvFilters.sort_by,
  };

  if (discoverLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingIndicatorDots />
      </View>
    );
  }

  return <DiscoverList currentCategory={currentCategory} discoverResults={discoverResults} />;
}

export function DiscoverScreen() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { query: searchQuery } = useDiscoverSearchQuery();
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();

  // Search hook
  const {
    data: searchResults,
    isLoading: searchLoading,
    error: searchError,
  } = useTMDBSearch({
    query: searchQuery,
    page: 1,
  });

  // If there's a search query or search is focused, show search results
  if (searchQuery?.trim() || isSearchFocused) {
    return (
      <View style={{ flex: 1, paddingTop: top }}>
        <DiscoverScreenScafold setIsSearchFocused={setIsSearchFocused}>
          <TMDBSearchResults
            query={searchQuery}
            results={searchResults?.results}
            isLoading={searchLoading}
            error={searchError}
          />
        </DiscoverScreenScafold>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: top }}>
      <DiscoverScreenScafold setIsSearchFocused={setIsSearchFocused}>
        <TabsProvider defaultIndex={0}>
          <Tabs
            tabHeaderStyle={{
              marginBottom: 12,
            }}
            theme={{
              colors: {
                primary: colors.primary,
                background: colors.surface,
              },
            }}
          >
            <TabScreen label="Movies" icon="movie">
              <MovieDiscoverTab />
            </TabScreen>

            <TabScreen label="TV Shows" icon="television">
              <TVDiscoverTab />
            </TabScreen>
          </Tabs>
        </TabsProvider>
      </DiscoverScreenScafold>
    </View>
  );
}

export function DiscoverScreenScafold({
  children,
  setIsSearchFocused,
}: {
  children: React.ReactNode;
  setIsSearchFocused?: (focused: boolean) => void;
}) {
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = useHasActiveFilters();
  const { colors } = useTheme();
  const { query, setDiscoverKeyword } = useDiscoverSearchQuery();

  const handleSearchChange = useCallback(
    (query: string) => {
      setDiscoverKeyword(query);
    },
    [setDiscoverKeyword]
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
