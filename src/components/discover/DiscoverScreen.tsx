import { TMDBSearchResults } from "@/components/tmdb/TMDBSearchResults";
import {
  getCategoryLabel,
  useDiscoverFiltersStore,
} from "@/lib/tanstack/operations/discover/discover-fliters-store";
import { useDiscoverSearchQuery } from "@/lib/tanstack/operations/discover/discover-search";
import { useTMDBDiscover, useTMDBSearch } from "@/lib/tanstack/operations/discover/tmdb-hooks";
import React, { useCallback, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Searchbar, Surface, useTheme } from "react-native-paper";
import { TabScreen, Tabs, TabsProvider } from "react-native-paper-tabs";
import { LoadingIndicatorDots } from "../state-screens/LoadingIndicatorDots";
import { DiscoverFeedFilters, FilterButton, useHasActiveFilters } from "./DiscoverFeedFilters";
import { DiscoverList } from "./DiscoverList";
import { useResponsiveListView } from "@/hooks/useWebCompatibleListView";

// Individual tab components for Movies and TV
function MovieDiscoverTab() {
  const { movieFilters, setActiveTab } = useDiscoverFiltersStore();

  React.useEffect(() => {
    setActiveTab("movie");
  }, [setActiveTab]);

  const categoryLabel = getCategoryLabel(movieFilters.sort_by);
  const { columns, orientation, setOrientation, isLoadingOrientation } = useResponsiveListView({
    key: "discover-list",
    minItemWidth: 190, // Default minimum width for movie/show cards
    maxColumns: 6, // Reasonable max for readability
  });
  const { data: discoverResults, isLoading: discoverLoading } = useTMDBDiscover({
    type: "movie",
    params: {
      page: 1,
      ...movieFilters,
    },
  });

  const currentCategory = {
    key: movieFilters.sort_by.replace(".", "_"),
    label: categoryLabel,
    type: "movie" as const,
    sort: movieFilters.sort_by,
  };

  if (discoverLoading || isLoadingOrientation) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingIndicatorDots />
      </View>
    );
  }

  return (
    <DiscoverList
      currentCategory={currentCategory}
      discoverResults={discoverResults}
      columns={columns}
      orientation={orientation}
      setOrientation={setOrientation}
    />
  );
}

function TVDiscoverTab() {
  const { tvFilters, setActiveTab } = useDiscoverFiltersStore();

  React.useEffect(() => {
    setActiveTab("tv");
  }, [setActiveTab]);

  const categoryLabel = getCategoryLabel(tvFilters.sort_by);
  const { columns, orientation, setOrientation, isLoadingOrientation } = useResponsiveListView({
    key: "discover-list",
  });
  const { data: discoverResults, isLoading: discoverLoading } = useTMDBDiscover({
    type: "tv",
    params: {
      page: 1,
      ...tvFilters,
    },
  });

  const currentCategory = {
    key: tvFilters.sort_by.replace(".", "_"),
    label: categoryLabel,
    type: "tv" as const,
    sort: tvFilters.sort_by,
  };

  if (discoverLoading || isLoadingOrientation) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingIndicatorDots />
      </View>
    );
  }

  return (
    <DiscoverList
      currentCategory={currentCategory}
      discoverResults={discoverResults}
      columns={columns}
      orientation={orientation}
      setOrientation={setOrientation}
    />
  ) ;
}

export function DiscoverScreen() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { query: searchQuery } = useDiscoverSearchQuery();
  const { colors } = useTheme();

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
      <View style={{ flex: 1 }}>
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
    <View style={{ flex: 1 }}>
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
            }}>
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
  const { width } = useWindowDimensions();

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
      <View style={[styles.searchContainer, { width: width * 0.95 }]}>
        <Searchbar
          placeholder="Search movies, TV shows, people..."
          value={query || ""}
          onChangeText={handleSearchChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          style={[styles.searchBar, { width: width * 0.7 }]}
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
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingTop: 12,
  },
  searchBar: {
    elevation: 2,
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
