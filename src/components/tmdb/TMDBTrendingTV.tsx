import { LoadingIndicatorDots } from "@/components/screens/state-screens/LoadingIndicatorDots";
import { TMDBTVShow, buildTMDBImageUrl } from "@/lib/tmdb/sdk-via-pb";
import { useTMDBTrendingTV } from "@/lib/tmdb/tmdb-hooks";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { Card, Surface, Text, useTheme } from "react-native-paper";
import { EmptyRoadSVG } from "../shared/svg/empty";

interface TVShowItemProps {
  item: TMDBTVShow;
  onPress?: (show: TMDBTVShow) => void;
}

function TVShowItem({ item, onPress }: TVShowItemProps) {
  const { colors } = useTheme();
  const posterUrl = buildTMDBImageUrl(item.poster_path, "w342");

  return (
    <Card style={styles.showCard} onPress={() => onPress?.(item)} mode="contained">
      <Card.Content>
        <View style={styles.contentContainer}>
          {posterUrl && <Image source={{ uri: posterUrl }} style={styles.poster} />}
          <View style={styles.textContent}>
            <Text variant="titleMedium" numberOfLines={2} style={styles.title}>
              {item.name}
            </Text>
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
              {item.first_air_date ? new Date(item.first_air_date).getFullYear() : "N/A"}
            </Text>

            {item.overview && (
              <Text
                variant="bodySmall"
                numberOfLines={3}
                style={[styles.overview, { color: colors.onSurfaceVariant }]}>
                {item.overview}
              </Text>
            )}

            <View style={styles.statsContainer}>
              <Text variant="labelSmall" style={{ color: colors.primary }}>
                ⭐ {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
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

export function TMDBTrendingTV() {
  const { colors } = useTheme();
  const { data: tvResponse, isLoading, error } = useTMDBTrendingTV();

  const handleShowPress = (show: TMDBTVShow) => {
    console.log("TV Show pressed:", show.name);
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
        data={tvResponse.results}
        renderItem={({ item }) => <TVShowItem item={item} onPress={handleShowPress} />}
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
  showCard: {
    flex: 1,
    marginHorizontal: 4,
    minHeight: 140,
  },
  contentContainer: {
    flexDirection: "row",
    gap: 12,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
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
