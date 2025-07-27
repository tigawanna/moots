import { UnifiedWatchlistItemCard } from "@/components/shared/watchlist/UnifiedWatchlistItemCard";
import { LoadingFallback } from "@/components/state-screens/LoadingFallback";
import { discoverMoviesQueryOptions, discoverTVQueryOptions } from "@/lib/tanstack/operations/tmdb/query-options";
import { movieToUnified, tvToUnified, UnifiedMediaItem } from "@/types/unified-media";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
    Button,
    Searchbar,
    SegmentedButtons,
    Surface,
    Text,
    useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MediaType = "movie" | "tv";

export function DiscoverWithUnifiedCards() {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [searchQuery, setSearchQuery] = useState("");

  // Discover movies
  const { 
    data: moviesData, 
    isLoading: moviesLoading, 
    error: moviesError 
  } = useQuery({
    ...discoverMoviesQueryOptions({ 
      sort_by: "popularity.desc",
      page: 1,
    }),
    enabled: mediaType === "movie",
  });

  // Discover TV shows
  const { 
    data: tvData, 
    isLoading: tvLoading, 
    error: tvError 
  } = useQuery({
    ...discoverTVQueryOptions({ 
      sort_by: "popularity.desc",
      page: 1,
    }),
    enabled: mediaType === "tv",
  });

  // Convert TMDB results to unified format
  const unifiedItems: UnifiedMediaItem[] = React.useMemo(() => {
    if (mediaType === "movie" && moviesData?.results) {
      return moviesData.results.map(movieToUnified);
    } else if (mediaType === "tv" && tvData?.results) {
      return tvData.results.map(tvToUnified);
    }
    return [];
  }, [mediaType, moviesData, tvData]);

  // Filter by search query
  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return unifiedItems;
    return unifiedItems.filter(item => 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [unifiedItems, searchQuery]);

  const isLoading = mediaType === "movie" ? moviesLoading : tvLoading;
  const error = mediaType === "movie" ? moviesError : tvError;

  const handleAddToWatchlist = (watchlistId: string, mediaItem: UnifiedMediaItem) => {
    console.log("Adding to watchlist:", watchlistId, mediaItem.title || mediaItem.name);
    // This would typically trigger a success message or navigation
  };

  const renderItem = ({ item }: { item: UnifiedMediaItem }) => (
    <UnifiedWatchlistItemCard
      item={item}
      viewMode="list"
      showWatchlistDropdown={true}
      onAddToWatchlist={handleAddToWatchlist}
      mediaTypeTab={mediaType}
    />
  );

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <Surface style={[styles.container, { paddingTop: top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Discover {mediaType === "movie" ? "Movies" : "TV Shows"}
        </Text>

        {/* Media Type Toggle */}
        <SegmentedButtons
          value={mediaType}
          onValueChange={(value) => setMediaType(value as MediaType)}
          buttons={[
            { value: "movie", label: "Movies" },
            { value: "tv", label: "TV Shows" },
          ]}
          style={styles.segmentedButtons}
        />

        {/* Search */}
        <Searchbar
          placeholder={`Search ${mediaType === "movie" ? "movies" : "TV shows"}...`}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      {/* Error State */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text variant="titleMedium" style={{ color: colors.error }}>
            Failed to load {mediaType === "movie" ? "movies" : "TV shows"}
          </Text>
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
            {error.message}
          </Text>
          <Button 
            mode="outlined" 
            onPress={() => {
              // Trigger a refetch or navigate back
              console.log("Retry pressed");
            }}
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      ) : null}

      {/* Results */}
      {!error ? (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.media_type}-${item.id}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text variant="titleMedium" style={{ color: colors.onSurfaceVariant }}>
                {searchQuery ? "No results found" : "No items available"}
              </Text>
              {searchQuery ? (
                <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                  Try a different search term
                </Text>
              ) : null}
            </View>
          }
        />
      ) : null}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  searchbar: {
    marginBottom: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  retryButton: {
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
});
