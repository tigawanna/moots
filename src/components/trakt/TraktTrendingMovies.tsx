import { LoadingIndicatorDots } from '@/components/screens/state-screens/LoadingIndicatorDots';
import { useTraktTrendingMovies } from '@/lib/trakt/trakt-hooks';
import { TraktTrendingMovieResponse } from '@/lib/trakt/trakt-trending';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Surface, Text, useTheme } from 'react-native-paper';

interface MovieItemProps {
  item: TraktTrendingMovieResponse;
  onPress?: (movie: TraktTrendingMovieResponse) => void;
}

function MovieItem({ item, onPress }: MovieItemProps) {
  const { colors } = useTheme();
  
  return (
    <Card 
      style={styles.movieCard} 
      onPress={() => onPress?.(item)}
      mode="contained"
    >
      <Card.Content>
        <Text variant="titleMedium" numberOfLines={2}>
          {item.movie.title}
        </Text>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
          {item.movie.year}
        </Text>
        <View style={styles.statsContainer}>
          <Text variant="labelSmall" style={{ color: colors.primary }}>
            👁 {item.watchers} watching
          </Text>
          <Text variant="labelSmall" style={{ color: colors.secondary }}>
            ▶️ {item.play_count} plays
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

export function TraktTrendingMovies() {
  const { colors } = useTheme();
  const { data: trendingMovies, isLoading, error } = useTraktTrendingMovies();

  const handleMoviePress = (movie: TraktTrendingMovieResponse) => {
    // TODO: Navigate to movie details screen
    console.log('Movie pressed:', movie.movie.title);
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
        <Text variant="titleMedium" style={{ color: colors.error }}>
          Failed to load trending movies
        </Text>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <FlatList
        data={trendingMovies}
        renderItem={({ item }) => (
          <MovieItem item={item} onPress={handleMoviePress} />
        )}
        keyExtractor={(item) => item.movie.ids.trakt.toString()}
        // numColumns={2}
        // columnWrapperStyle={styles.row}
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
  movieCard: {
    flex: 1,
    marginHorizontal: 4,
    minHeight: 120,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
});
