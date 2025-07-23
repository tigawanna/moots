import { LoadingIndicatorDots } from '@/components/screens/state-screens/LoadingIndicatorDots';
import { TMDBMovie, buildTMDBImageUrl } from '@/lib/tmdb/sdk-via-pb';
import { useTMDBTrendingMovies } from '@/lib/tmdb/tmdb-hooks';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { Card, Surface, Text, useTheme } from 'react-native-paper';

interface MovieItemProps {
  item: TMDBMovie;
  onPress?: (movie: TMDBMovie) => void;
}

function MovieItem({ item, onPress }: MovieItemProps) {
  const { colors } = useTheme();
  const posterUrl = buildTMDBImageUrl(item.poster_path, 'w342');
  
  return (
    <Card 
      style={styles.movieCard} 
      onPress={() => onPress?.(item)}
      mode="contained"
    >
      <Card.Content>
        <View style={styles.contentContainer}>
          {posterUrl && (
            <Image source={{ uri: posterUrl }} style={styles.poster} />
          )}
          <View style={styles.textContent}>
            <Text variant="titleMedium" numberOfLines={2} style={styles.title}>
              {item.title}
            </Text>
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
              {item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}
            </Text>
            
            {item.overview && (
              <Text 
                variant="bodySmall" 
                numberOfLines={3} 
                style={[styles.overview, { color: colors.onSurfaceVariant }]}
              >
                {item.overview}
              </Text>
            )}
            
            <View style={styles.statsContainer}>
              <Text variant="labelSmall" style={{ color: colors.primary }}>
                ⭐ {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
              </Text>
              <Text variant="labelSmall" style={{ color: colors.secondary }}>
                🗳️ {item.vote_count} votes
              </Text>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

export function TMDBTrendingMovies() {
  const { colors } = useTheme();
  const { data: moviesResponse, isLoading, error } = useTMDBTrendingMovies();

  const handleMoviePress = (movie: TMDBMovie) => {
    console.log('Movie pressed:', movie.title);
  };

  if (isLoading) {
    return (
      <Surface style={styles.container}>
        <LoadingIndicatorDots />
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          Loading trending movies...
        </Text>
      </Surface>
    );
  }

  if (error) {
    return (
      <Surface style={styles.container}>
        <Text variant="titleMedium" style={{ color: colors.error }}>
          Failed to load trending movies
        </Text>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      </Surface>
    );
  }

  if (!moviesResponse?.results || moviesResponse.results.length === 0) {
    return (
      <Surface style={styles.container}>
        <Text variant="titleMedium" style={{ color: colors.onSurfaceVariant }}>
          No trending movies found
        </Text>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <FlatList
        data={moviesResponse.results}
        renderItem={({ item }) => (
          <MovieItem item={item} onPress={handleMoviePress} />
        )}
        keyExtractor={(item) => item.id.toString()}
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
  listContent: {
    gap: 12,
  },
  movieCard: {
    flex: 1,
    marginHorizontal: 4,
    minHeight: 140,
  },
  contentContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  textContent: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  overview: {
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 18,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
});