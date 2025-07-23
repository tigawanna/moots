import { LoadingIndicatorDots } from '@/components/screens/state-screens/LoadingIndicatorDots';
import { TraktSearchResult } from '@/lib/trakt/trakt-trending';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Chip, Surface, Text, useTheme } from 'react-native-paper';

interface SearchResultItemProps {
  item: TraktSearchResult;
  onPress?: (result: TraktSearchResult) => void;
}

function SearchResultItem({ item, onPress }: SearchResultItemProps) {
  const { colors } = useTheme();
  
  const isMovie = item.type === 'movie';
  const content = isMovie ? item.movie : item.show;
  
  if (!content) return null;

  return (
    <Card 
      style={styles.resultCard} 
      onPress={() => onPress?.(item)}
      mode="contained"
    >
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleMedium" numberOfLines={2} style={styles.title}>
            {content.title}
          </Text>
          <Chip mode="outlined" compact style={styles.typeChip}>
            {isMovie ? 'Movie' : 'TV Show'}
          </Chip>
        </View>
        
        <View style={styles.metadata}>
          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            {content.year}
          </Text>
          {/* Basic search results don't include genres */}
        </View>
        
        {/* Basic search results don't include overview */}
        
        <View style={styles.statsContainer}>
          <Text variant="labelSmall" style={{ color: colors.primary }}>
            🎬 {isMovie ? 'Movie' : 'TV Show'}
          </Text>
          <Text variant="labelSmall" style={{ color: colors.secondary }}>
            {content.year}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

interface TraktSearchResultsProps {
  query: string;
  results?: TraktSearchResult[];
  isLoading?: boolean;
  error?: Error | null;
  onItemPress?: (result: TraktSearchResult) => void;
}

export function TraktSearchResults({ 
  query, 
  results, 
  isLoading, 
  error, 
  onItemPress 
}: TraktSearchResultsProps) {
  const { colors } = useTheme();

  const handleItemPress = (result: TraktSearchResult) => {
    // TODO: Navigate to content details screen
    const content = result.type === 'movie' ? result.movie : result.show;
    console.log(`${result.type} pressed:`, content?.title);
    onItemPress?.(result);
  };

  if (isLoading) {
    return (
      <Surface style={styles.container}>
        <LoadingIndicatorDots />
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          Searching for &quot;{query}&quot;...
        </Text>
      </Surface>
    );
  }

  if (error) {
    return (
      <Surface style={styles.container}>
        <Text variant="titleMedium" style={{ color: colors.error }}>
          Search failed
        </Text>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </Text>
      </Surface>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Surface style={styles.container}>
        <Text variant="titleMedium" style={{ color: colors.onSurfaceVariant }}>
          No results found
        </Text>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          Try searching with different keywords
        </Text>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="titleSmall" style={{ color: colors.onSurface }}>
          Found {results.length} results for &quot;{query}&quot;
        </Text>
      </View>
      
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <SearchResultItem item={item} onPress={handleItemPress} />
        )}
        keyExtractor={(item, index) => {
          const content = item.type === 'movie' ? item.movie : item.show;
          return content?.ids.trakt.toString() || `${item.type}-${index}`;
        }}
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
  resultCard: {
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
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
