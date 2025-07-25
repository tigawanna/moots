import { TMDBSearchResults } from "@/components/tmdb/TMDBSearchResults";
import { useTMDBDiscover, useTMDBSearch } from "@/lib/tanstack/operations/discover/tmdb-hooks";
import React, { useCallback, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { Chip, Searchbar, Surface, Text, useTheme, Button } from "react-native-paper";
import { WatchlistItemCard } from "../shared/watchlist/WatchlistItemCard";
import { DiscoverFeedFilters, FilterButton, useHasActiveFilters } from "./DiscoverFeedFilters";
import { useDiscoverSearchQuery } from "@/lib/tanstack/operations/discover/discover-search";

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
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedCategory, setSelectedCategory] = useState("popular_movies");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  const renderDiscoverSection = () => (
    <View style={styles.discoverContainer}>
      {/* Category Selection */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}>
        {DISCOVER_CATEGORIES.map((category) => (
          <Chip
            key={category.key}
            selected={selectedCategory === category.key}
            onPress={() => setSelectedCategory(category.key)}
            style={[
              styles.categoryChip,
              selectedCategory === category.key
                ? {
                    backgroundColor: colors.tertiary,
                    borderColor: colors.secondary,
                  }
                : {
                    backgroundColor: colors.surfaceVariant,
                  },
            ]}
            textStyle={selectedCategory === category.key ? styles.selectedCategoryText : undefined}>
            <Text>{category.label}</Text>
          </Chip>
        ))}
      </ScrollView>

      {/* Results Grid */}
      <FlatList
        data={(discoverResults?.results as any[]) || []}
        renderItem={({ item }) => (
          <WatchlistItemCard
            item={item}
            viewMode="grid"
            // onPress={(id)=>{
            //   router.push(id)
            // }}
            showActions={true}
          />
        )}
        keyExtractor={(item) => `${item.id}-${currentCategory?.type}`}
        numColumns={2}
        contentContainerStyle={styles.resultsGrid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          discoverLoading ? (
            <View style={styles.loadingContainer}>
              <Text>Loading...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text>No results found</Text>
            </View>
          )
        }
      />
    </View>
  );

  const renderSearchSection = () => (
    <TMDBSearchResults
      query={searchQuery}
      results={searchResults?.results}
      isLoading={searchLoading}
      error={searchError}
    />
  );

  return (
    <Surface style={styles.container}>
      {/* Search Bar */}

      {/* Content */}
      <DiscoverScreenScafold setActiveTab={setActiveTab} setIsSearchFocused={setIsSearchFocused}>
        <View style={styles.content}>
          {(activeTab === "search" || isSearchFocused) && searchQuery.trim()
            ? renderSearchSection()
            : renderDiscoverSection()}
        </View>
      </DiscoverScreenScafold>
    </Surface>
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
  const handleSearchChange = useCallback((query: string) => {
    setDiscoverKeyword(query);
    if (query.trim()) {
      setActiveTab?.("search");
    }
  }, [setActiveTab, setDiscoverKeyword]);
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
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    elevation: 2,
  },
  searchInput: {
    fontSize: 16,
  },

  // Content styles
  content: {
    flex: 1,
  },

  // Discover styles
  discoverContainer: {
    flex: 1,
  },
  categoryScroll: {
    maxHeight: 50,
    marginBottom: 8,
  },
  categoryContent: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
  },

  selectedCategoryText: {
    color: "white",
  },

  // Results styles
  resultsGrid: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
