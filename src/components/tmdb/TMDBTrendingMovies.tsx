import { LoadingIndicatorDots } from '@/components/state-screens/LoadingIndicatorDots';
import { useTMDBTrendingMovies } from '@/lib/tanstack/operations/discover/tmdb-hooks';
import { movieToUnified, UnifiedMediaItem } from '@/types/unified-media';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { EmptyRoadSVG } from '../shared/svg/empty';
import { UnifiedWatchlistItemCard } from '../shared/watchlist/UnifiedWatchlistItemCard';

export function TMDBTrendingMovies() {
  const { colors } = useTheme();
  const { data: moviesResponse, isLoading, error } = useTMDBTrendingMovies();

  // Convert TMDB movies to unified format
  const unifiedMovies: UnifiedMediaItem[] = React.useMemo(() => {
    if (!moviesResponse?.results) return [];
    return moviesResponse.results.map(movieToUnified);
  }, [moviesResponse?.results]);

  const handleMoviePress = (item: UnifiedMediaItem) => {
    console.log('Movie pressed:', item.title);
  };

  if (isLoading) {
    return (
      <Surface style={styles.statesContainer}>
        <LoadingIndicatorDots />
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          Loading trending movies...
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
              Failed to load trending movies
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

  if (!moviesResponse?.results || moviesResponse.results.length === 0) {
    return (
      <Surface style={styles.statesContainer}>
        <Text variant="titleMedium" style={{ color: colors.onSurfaceVariant }}>
          No trending movies found
        </Text>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <FlatList
        data={unifiedMovies}
        renderItem={({ item }) => (
          <UnifiedWatchlistItemCard
            item={item}
            viewMode="list"
            showActions={true}
            showWatchlistDropdown={true}
            onPress={() => handleMoviePress(item)}
          />
        )}
        keyExtractor={(item) => `movie-${item.id}`}
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
