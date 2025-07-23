import { LoadingIndicatorDots } from '@/components/screens/state-screens/LoadingIndicatorDots';
import { TraktPopularMovie, TraktPopularShow } from '@/lib/trakt/trakt-trending';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Chip, Surface, Text, useTheme } from 'react-native-paper';

interface PopularMovieItemProps {
  item: TraktPopularMovie;
  onPress?: (movie: TraktPopularMovie) => void;
}

function PopularMovieItem({ item, onPress }: PopularMovieItemProps) {
  const { colors } = useTheme();
  
  return (
    <Card 
      style={styles.contentCard} 
      onPress={() => onPress?.(item)}
      mode="contained"
    >
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" numberOfLines={2} style={styles.title}>
            {item.title}
          </Text>
          <Chip mode="outlined" compact style={styles.typeChip}>
            Movie
          </Chip>
        </View>
        
        <View style={styles.metadata}>
          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            {item.year}
          </Text>
          {item.genres && item.genres.length > 0 && (
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
              • {item.genres.slice(0, 2).join(', ')}
            </Text>
          )}
        </View>
        
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
            ⭐ {item.rating ? item.rating.toFixed(1) : 'N/A'}
          </Text>
          {item.votes && (
            <Text variant="labelSmall" style={{ color: colors.secondary }}>
              🗳️ {item.votes} votes
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

interface PopularShowItemProps {
  item: TraktPopularShow;
  onPress?: (show: TraktPopularShow) => void;
}

function PopularShowItem({ item, onPress }: PopularShowItemProps) {
  const { colors } = useTheme();
  
  return (
    <Card 
      style={styles.contentCard} 
      onPress={() => onPress?.(item)}
      mode="contained"
    >
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" numberOfLines={2} style={styles.title}>
            {item.title}
          </Text>
          <Chip mode="outlined" compact style={styles.typeChip}>
            TV Show
          </Chip>
        </View>
        
        <View style={styles.metadata}>
          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            {item.year}
          </Text>
          {item.genres && item.genres.length > 0 && (
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
              • {item.genres.slice(0, 2).join(', ')}
            </Text>
          )}
          {item.network && (
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
              • {item.network}
            </Text>
          )}
        </View>
        
        <View style={styles.statsContainer}>
          <Text variant="labelSmall" style={{ color: colors.primary }}>
            ⭐ {item.rating ? item.rating.toFixed(1) : 'N/A'}
          </Text>
          {item.votes && (
            <Text variant="labelSmall" style={{ color: colors.secondary }}>
              🗳️ {item.votes} votes
            </Text>
          )}
          {item.status && (
            <Text variant="labelSmall" style={{ color: colors.tertiary }}>
              📺 {item.status}
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}

interface TraktPopularMoviesProps {
  movies?: TraktPopularMovie[];
  isLoading?: boolean;
  error?: Error | null;
  onItemPress?: (movie: TraktPopularMovie) => void;
  title?: string;
}

export function TraktPopularMovies({ 
  movies, 
  isLoading, 
  error, 
  onItemPress,
  title = "Popular Movies"
}: TraktPopularMoviesProps) {
  const { colors } = useTheme();

  const handleItemPress = (movie: TraktPopularMovie) => {
    // TODO: Navigate to movie details screen
    console.log('Popular movie pressed:', movie.title);
    onItemPress?.(movie);
  };

  if (isLoading) {
    return (
      <Surface style={styles.container}>
        <LoadingIndicatorDots />
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          Loading {title.toLowerCase()}...
        </Text>
      </Surface>
    );
  }

  if (error) {
    return (
      <Surface style={styles.container}>
        <Text variant="titleMedium" style={{ color: colors.error }}>
          Failed to load {title.toLowerCase()}
        </Text>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </Text>
      </Surface>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <Surface style={styles.container}>
        <Text variant="titleMedium" style={{ color: colors.onSurfaceVariant }}>
          No {title.toLowerCase()} found
        </Text>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="titleSmall" style={{ color: colors.onSurface }}>
          {title} ({movies.length})
        </Text>
      </View>
      
      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <PopularMovieItem item={item} onPress={handleItemPress} />
        )}
        keyExtractor={(item) => item.ids.trakt.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </Surface>
  );
}

interface TraktPopularShowsProps {
  shows?: TraktPopularShow[];
  isLoading?: boolean;
  error?: Error | null;
  onItemPress?: (show: TraktPopularShow) => void;
  title?: string;
}

export function TraktPopularShows({ 
  shows, 
  isLoading, 
  error, 
  onItemPress,
  title = "Popular Shows"
}: TraktPopularShowsProps) {
  const { colors } = useTheme();

  const handleItemPress = (show: TraktPopularShow) => {
    // TODO: Navigate to show details screen
    console.log('Popular show pressed:', show.title);
    onItemPress?.(show);
  };

  if (isLoading) {
    return (
      <Surface style={styles.container}>
        <LoadingIndicatorDots />
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          Loading {title.toLowerCase()}...
        </Text>
      </Surface>
    );
  }

  if (error) {
    return (
      <Surface style={styles.container}>
        <Text variant="titleMedium" style={{ color: colors.error }}>
          Failed to load {title.toLowerCase()}
        </Text>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </Text>
      </Surface>
    );
  }

  if (!shows || shows.length === 0) {
    return (
      <Surface style={styles.container}>
        <Text variant="titleMedium" style={{ color: colors.onSurfaceVariant }}>
          No {title.toLowerCase()} found
        </Text>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="titleSmall" style={{ color: colors.onSurface }}>
          {title} ({shows.length})
        </Text>
      </View>
      
      <FlatList
        data={shows}
        renderItem={({ item }) => (
          <PopularShowItem item={item} onPress={handleItemPress} />
        )}
        keyExtractor={(item) => item.ids.trakt.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  headerContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  contentCard: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  typeChip: {
    height: 24,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  overview: {
    marginBottom: 8,
    lineHeight: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
});
