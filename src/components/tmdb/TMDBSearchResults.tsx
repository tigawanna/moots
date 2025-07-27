import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import { isMovie, isPerson, isTVShow, TMDBSearchResult } from "@/lib/tmdb/sdk-via-pb";
import { movieToUnified, tvToUnified, UnifiedMediaItem } from "@/types/unified-media";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { EmptyRoadSVG } from "../shared/svg/empty";
import { UnifiedWatchlistItemCard } from "../shared/watchlist/UnifiedWatchlistItemCard";
import { TrendingOnTMDB } from "./TrendingOnTMDB";

interface TMDBSearchResultsProps {
  query: string;
  results?: TMDBSearchResult[];
  isLoading?: boolean;
  error?: Error | null;
  onItemPress?: (result: TMDBSearchResult) => void;
}

export function TMDBSearchResults({
  query,
  results,
  isLoading,
  error,
  onItemPress,
}: TMDBSearchResultsProps) {
  const { colors } = useTheme();

  // Convert search results to unified format
  const unifiedResults: UnifiedMediaItem[] = React.useMemo(() => {
    if (!results) return [];
    
    return results
      .filter((item) => isMovie(item) || isTVShow(item)) // Only include movies and TV shows, exclude persons
      .map((item) => {
        if (isMovie(item)) {
          return movieToUnified(item);
        } else if (isTVShow(item)) {
          return tvToUnified(item);
        }
        // This should never happen due to filter above, but TypeScript needs it
        throw new Error("Invalid item type");
      });
  }, [results]);

  const handleItemPress = (item: UnifiedMediaItem) => {
    console.log(`${item.media_type} pressed:`, item.title || item.name);
    // We can't directly call onItemPress with UnifiedMediaItem since it expects TMDBSearchResult
    // For now, we'll handle navigation internally in the card component
  };

  if (isLoading) {
    return (
      <View style={styles.statesContainer}>
        <LoadingIndicatorDots />
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          Searching for &quot;{query}&quot;...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.statesContainer}>
        {__DEV__ ? (
          <View>
            <Text variant="titleMedium" style={{ color: colors.error }}>
              Failed to load search results
            </Text>
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
              {error instanceof Error ? error.message : "Unknown error"}
            </Text>
          </View>
        ) : (
          <View style={{ alignItems: "center", justifyContent: "center", gap: 40 }}>
            <EmptyRoadSVG />
            <Text variant="titleLarge">Something went wrong</Text>
          </View>
        )}
      </View>
    );
  }

  if (!query || query.length === 0) {
    return <TrendingOnTMDB />;
  }

  if (!results || results.length === 0) {
    return (
      <View style={styles.statesContainer}>
        <Text variant="titleMedium" style={{ color: colors.onSurfaceVariant }}>
          No results found
        </Text>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          Try searching with different keywords
        </Text>
      </View>
    );
  }

  // Count movies and TV shows separately for header
  const movieCount = results.filter(isMovie).length;
  const tvCount = results.filter(isTVShow).length;
  const personCount = results.filter(isPerson).length;
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="titleSmall" style={{ color: colors.onSurface }}>
          Found {unifiedResults.length} results for &quot;{query}&quot;
        </Text>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 4 }}>
          {movieCount} movies, {tvCount} TV shows
          {personCount > 0 ? ` (${personCount} people not shown)` : ""}
        </Text>
      </View>

      <FlatList
        data={unifiedResults}
        renderItem={({ item }) => (
          <UnifiedWatchlistItemCard
            item={item}
            viewMode="list"
            showActions={true}
            showWatchlistDropdown={true}
            onPress={() => handleItemPress(item)}
          />
        )}
        keyExtractor={(item) => `${item.media_type}-${item.id}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    gap: 6
  },
  statesContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  listContent: {
    paddingTop: 6,
    gap: 12,
  },
});
