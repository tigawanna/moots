import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import { useTMDBTrendingTV } from "@/lib/tanstack/operations/discover/tmdb-hooks";
import { tvToUnified, UnifiedMediaItem } from "@/types/unified-media";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { EmptyRoadSVG } from "../shared/svg/empty";
import { UnifiedWatchlistItemCard } from "../shared/watchlist/UnifiedWatchlistItemCard";

export function TMDBTrendingTV() {
  const { colors } = useTheme();
  const { data: tvResponse, isLoading, error } = useTMDBTrendingTV();

  // Convert TMDB TV shows to unified format
  const unifiedTVShows: UnifiedMediaItem[] = React.useMemo(() => {
    if (!tvResponse?.results) return [];
    return tvResponse.results.map(tvToUnified);
  }, [tvResponse?.results]);

  const handleShowPress = (item: UnifiedMediaItem) => {
    console.log("TV Show pressed:", item.name);
  };

  if (isLoading) {
    return (
      <Surface style={styles.statesContainer}>
        <LoadingIndicatorDots />
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          Loading trending TV shows...
        </Text>
      </Surface>
    );
  }

  if (error) {
    return (
      <Surface style={styles.statesContainer}>
        {__DEV__ ? (
          <View>
            <Text variant="titleMedium" style={{ color: colors.error }}>
              Failed to load trending TV shows
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
      </Surface>
    );
  }

  if (!tvResponse?.results || tvResponse.results.length === 0) {
    return (
      <Surface style={styles.statesContainer}>
        <Text variant="titleMedium" style={{ color: colors.onSurfaceVariant }}>
          No trending TV shows found
        </Text>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <FlatList
        data={unifiedTVShows}
        renderItem={({ item }) => (
          <UnifiedWatchlistItemCard
            item={item}
            viewMode="list"
            showActions={true}
            showWatchlistDropdown={true}
            onPress={() => handleShowPress(item)}
          />
        )}
        keyExtractor={(item) => `tv-${item.id}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  statesContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    gap: 12,
  },
});
