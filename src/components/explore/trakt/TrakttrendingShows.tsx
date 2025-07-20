import { LoadingIndicatorDots } from '@/components/screens/state-screens/LoadingIndicatorDots';
import { TraktTrendingShowResponse, traktTrendingShowsQueryOptions } from '@/lib/trakt/trakt-trending';
import { useQuery } from '@tanstack/react-query';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card, Surface, Text, useTheme } from 'react-native-paper';

interface ShowItemProps {
  item: TraktTrendingShowResponse;
  onPress?: (show: TraktTrendingShowResponse) => void;
}

function ShowItem({ item, onPress }: ShowItemProps) {
  const { colors } = useTheme();
  
  return (
    <Card 
      style={styles.showCard} 
      onPress={() => onPress?.(item)}
      mode="contained"
    >
      <Card.Content>
        <Text variant="titleMedium" numberOfLines={2}>
          {item.show.title}
        </Text>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
          {item.show.year}
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

export function TrakttrendingShows() {
  const { colors } = useTheme();
  const { data: trendingShows, isLoading, error } = useQuery(traktTrendingShowsQueryOptions());

  const handleShowPress = (show: TraktTrendingShowResponse) => {
    // TODO: Navigate to show details screen
    console.log('Show pressed:', show.show.title);
  };

  if (isLoading) {
    return (
      <Surface style={styles.container}>
        <LoadingIndicatorDots />
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          Loading trending shows...
        </Text>
      </Surface>
    );
  }

  if (error) {
    return (
      <Surface style={styles.container}>
        <Text variant="titleMedium" style={{ color: colors.error }}>
          Failed to load trending shows
        </Text>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
          {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <FlatList
        data={trendingShows}
        renderItem={({ item }) => (
          <ShowItem item={item} onPress={handleShowPress} />
        )}
        keyExtractor={(item) => item.show.ids.trakt.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
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
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  showCard: {
    flex: 1,
    marginHorizontal: 4,
    minHeight: 120,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
