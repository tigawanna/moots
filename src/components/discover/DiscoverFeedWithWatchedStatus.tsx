import { UnifiedWatchlistItemCard } from "@/components/shared/watchlist/UnifiedWatchlistItemCard";
import { useTMDBDiscover } from "@/lib/tanstack/operations/discover/tmdb-hooks";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

interface DiscoverFeedProps {
  mediaType: "movie" | "tv";
}

export function DiscoverFeedWithWatchedStatus({ mediaType }: DiscoverFeedProps) {
  const { colors } = useTheme();
  
  const { data, isLoading, error } = useTMDBDiscover({
    type: mediaType,
    params: {
      sort_by: "popularity.desc",
      page: 1,
    },
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Loading {mediaType}s...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: colors.error }}>
          Error loading {mediaType}s: {error.message}
        </Text>
      </View>
    );
  }

  if (!data?.results?.length) {
    return (
      <View style={styles.centerContainer}>
        <Text>No {mediaType}s found</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => {
    // Convert TMDB item to UnifiedMediaItem format
    const unifiedItem = {
      id: item.id,
      tmdb_id: item.id,
      title: item.title || item.name,
      media_type: mediaType,
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      overview: item.overview,
      release_date: item.release_date || item.first_air_date,
      vote_average: item.vote_average,
      genre_ids: item.genre_ids,
      watched: item.watched, // This comes from our select function
    };

    return (
      <View style={styles.itemContainer}>
        <UnifiedWatchlistItemCard
          item={unifiedItem}
          viewMode="list"
          showActions={true}
          mediaTypeTab={mediaType}
        />
        
        {/* Show watched status indicator */}
        {item.watched && (
          <View style={[styles.watchedBadge, { backgroundColor: colors.primary }]}>
            <Text variant="labelSmall" style={{ color: colors.onPrimary }}>
              WATCHED
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={data.results}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContainer: {
    padding: 8,
  },
  itemContainer: {
    position: "relative",
    marginBottom: 8,
  },
  watchedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
});
