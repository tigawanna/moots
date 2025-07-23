import { LoadingIndicatorDots } from "@/components/screens/state-screens/LoadingIndicatorDots";
import { TMDBSearchResult, buildTMDBImageUrl, isMovie, isPerson, isTVShow } from "@/lib/tmdb/sdk-via-pb";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { Card, Chip, Text, useTheme } from "react-native-paper";
import { TrendingOnTMDB } from "./TrendingOnTMDB";
import { EmptyRoadSVG } from "../shared/svg/empty";

interface SearchResultItemProps {
  item: TMDBSearchResult;
  onPress?: (result: TMDBSearchResult) => void;
}

function SearchResultItem({ item, onPress }: SearchResultItemProps) {
  const { colors } = useTheme();

  const renderContent = () => {
    if (isMovie(item)) {
      const posterUrl = buildTMDBImageUrl(item.poster_path, 'w185');
      return (
        <Card style={styles.resultCard} onPress={() => onPress?.(item)} mode="contained">
          <Card.Content>
            <View style={styles.contentContainer}>
              {posterUrl && (
                <Image source={{ uri: posterUrl }} style={styles.poster} />
              )}
              <View style={styles.textContent}>
                <View style={styles.header}>
                  <Text variant="titleMedium" numberOfLines={2} style={styles.title}>
                    {item.title}
                  </Text>
                  <Text  style={styles.typeChip}>
                    Movie
                  </Text>
                </View>
                
                <View style={styles.metadata}>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                    {item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'}
                  </Text>
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

    if (isTVShow(item)) {
      const posterUrl = buildTMDBImageUrl(item.poster_path, 'w185');
      return (
        <Card style={styles.resultCard} onPress={() => onPress?.(item)} mode="contained">
          <Card.Content>
            <View style={styles.contentContainer}>
              {posterUrl && (
                <Image source={{ uri: posterUrl }} style={styles.poster} />
              )}
              <View style={styles.textContent}>
                <View style={styles.header}>
                  <Text variant="titleMedium" numberOfLines={2} style={styles.title}>
                    {item.name}
                  </Text>
                  <Text  style={styles.typeChip}>
                    TV Show
                  </Text>
                </View>
                
                <View style={styles.metadata}>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                    {item.first_air_date ? new Date(item.first_air_date).getFullYear() : 'N/A'}
                  </Text>
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

    if (isPerson(item)) {
      const profileUrl = buildTMDBImageUrl(item.profile_path, 'w185');
      return (
        <Card style={styles.resultCard} onPress={() => onPress?.(item)} mode="contained">
          <Card.Content>
            <View style={styles.contentContainer}>
              {profileUrl && (
                <Image source={{ uri: profileUrl }} style={styles.profileImage} />
              )}
              <View style={styles.textContent}>
                <View style={styles.header}>
                  <Text variant="titleMedium" numberOfLines={2} style={styles.title}>
                    {item.name}
                  </Text>
                  <Text  style={styles.typeChip}>
                    Person
                  </Text>
                </View>
                
                <View style={styles.metadata}>
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                    {item.known_for_department}
                  </Text>
                </View>
                
                <View style={styles.statsContainer}>
                  <Text variant="labelSmall" style={{ color: colors.primary }}>
                    🎭 {item.known_for_department}
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      );
    }

    return null;
  };

  return renderContent();
}

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

  const handleItemPress = (result: TMDBSearchResult) => {
    console.log(`${result.media_type} pressed:`, 
      isMovie(result) ? result.title : 
      isTVShow(result) ? result.name : 
      isPerson(result) ? result.name : 'Unknown'
    );
    onItemPress?.(result);
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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text variant="titleSmall" style={{ color: colors.onSurface }}>
          Found {results.length} results for &quot;{query}&quot;
        </Text>
      </View>

      <FlatList
        data={results}
        renderItem={({ item }) => <SearchResultItem item={item} onPress={handleItemPress} />}
        keyExtractor={(item, index) => {
          if (isMovie(item)) return `movie-${item.id}`;
          if (isTVShow(item)) return `tv-${item.id}`;
          if (isPerson(item)) return `person-${item.id}`;
          return `unknown-${index}`;
        }}
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
  resultCard: {
    flex: 1,
    marginHorizontal: 4,
    minHeight: 120,
  },
  contentContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
  },
  textContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  typeChip: {
    // height: 24,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  overview: {
    marginBottom: 8,
    lineHeight: 18,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
