import { TMDBSearchResults } from "@/components/tmdb/TMDBSearchResults";
import { useTMDBDiscover, useTMDBSearch } from "@/lib/tanstack/operations/discover/tmdb-hooks";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar, Surface, useTheme,} from "react-native-paper";
import { DiscoverFeedFilters, FilterButton, useHasActiveFilters } from "./DiscoverFeedFilters";
import { useDiscoverSearchQuery } from "@/lib/tanstack/operations/discover/discover-search";
import { DiscoverList } from "./DiscoverList";
import { LoadingIndicatorDots } from "../state-screens/LoadingIndicatorDots";
import { useDiscoverFiltersStore } from "@/lib/tanstack/operations/discover/discover-fliters-store";

const DISCOVER_CATEGORIES = [
  {
    key: "popular_movies",
    label: "Popular Movies",
    type: "movie",
    sort: "popularity.desc",
  },
  {
    key: "top_rated_movies",
    label: "Top Rated Movies",
    type: "movie",
    sort: "vote_average.desc",
  },
  {
    key: "upcoming_movies",
    label: "Upcoming Movies",
    type: "movie",
    sort: "release_date.desc",
  },
  {
    key: "popular_tv",
    label: "Popular TV",
    type: "tv",
    sort: "popularity.desc",
  },
  {
    key: "top_rated_tv",
    label: "Top Rated TV",
    type: "tv",
    sort: "vote_average.desc",
  },
  {
    key: "airing_today",
    label: "Airing Today",
    type: "tv",
    sort: "first_air_date.desc",
  },
];

export function DiscoverScreen() {
 const [activeTab, setActiveTab] = useState("discover");
  const [selectedCategory, setSelectedCategory] = useState("popular_movies");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { query: searchQuery } = useDiscoverSearchQuery();

    const {
      filters,
      setFilters,
      resetFilters,
      selectedGenres,
      toggleGenre,
      clearGenres,
    } = useDiscoverFiltersStore();
  
  // Search hook
  const {
    data: searchResults,
    isLoading: searchLoading,
    error: searchError,
  } = useTMDBSearch({
    query: searchQuery,
    page: 1,
  });

  // Discover hook
  const currentCategory = DISCOVER_CATEGORIES.find((cat) => cat.key === selectedCategory);
  
  const { data: discoverResults, isLoading: discoverLoading } = useTMDBDiscover({
    type: (currentCategory?.type as "movie" | "tv") || "movie",
    params: {
      sort_by: currentCategory?.sort || "popularity.desc",
      page: 1,
    },
  });

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
    maxWidth: "98%",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
