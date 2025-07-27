import { useSnackbar } from "@/components/react-native-paper/snackbar/global-snackbar-store";
import { pb } from "@/lib/pb/client";
import { useTMDBDiscover } from "@/lib/tanstack/operations/discover/tmdb-hooks";
import { quickAddToDefaultWatchlistMutationOptions } from "@/lib/tanstack/operations/watchlist-items/query-options";
import { getUserWatchedlistQueryOptions, getUserWatchlistQueryOptions } from "@/lib/tanstack/operations/watchlist/operations-options";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput, useTheme } from "react-native-paper";

export function WatchlistDebugScreen() {
  const { colors } = useTheme();
  const { showSnackbar } = useSnackbar();
  const [tmdbId, setTmdbId] = useState("550"); // Fight Club as test movie
  
  const user = pb.authStore.record;
  const userId = user?.id;

  // Query user's watchlists
  const { data: watchlists, isLoading: watchlistsLoading, error: watchlistsError } = useQuery({
    ...getUserWatchlistQueryOptions({ userId }),
    enabled: !!userId,
  });

  // Query user's watched items
  const { data: watchedItems, isLoading: watchedLoading, error: watchedError } = useQuery({
    ...getUserWatchedlistQueryOptions({ userId: userId! }),
    enabled: !!userId,
  });

  // Test TMDB with watched status
  const { data: tmdbMovies, isLoading: tmdbLoading } = useTMDBDiscover({
    type: "movie",
    params: { sort_by: "popularity.desc", page: 1 },
  });

  // Quick add mutation
  const quickAddMutation = useMutation(quickAddToDefaultWatchlistMutationOptions());

  const handleQuickAdd = async () => {
    if (!user) {
      showSnackbar("Please sign in first");
      return;
    }

    try {
      await quickAddMutation.mutateAsync({
        userId: user.id,
        payload: {
          added_by: user.id,
          media_type: "movie",
          tmdb_id: parseInt(tmdbId),
          title: "Fight Club (Test)",
          overview: "Test movie for debugging watchlist operations",
          release_date: "1999-10-15",
          vote_average: 8.8,
          genre_ids: [18, 53],
        },
      });
      showSnackbar("Successfully added to watchlist!");
    } catch (error) {
      console.error("Quick add error:", error);
      showSnackbar(`Failed to add: ${error}`);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text variant="titleLarge">Please sign in to test watchlist operations</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Watchlist Debug Tools" />
        <Card.Content>
          <Text variant="bodyMedium">User: {user.email}</Text>
          <Text variant="bodyMedium">User ID: {user.id}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Quick Add Test" />
        <Card.Content>
          <TextInput
            label="TMDB ID"
            value={tmdbId}
            onChangeText={setTmdbId}
            mode="outlined"
            style={styles.input}
          />
          <Button
            mode="contained"
            onPress={handleQuickAdd}
            loading={quickAddMutation.isPending}
            disabled={quickAddMutation.isPending}
            style={styles.button}
          >
            Add to Default Watchlist
          </Button>
          {quickAddMutation.error && (
            <Text style={{ color: colors.error, marginTop: 8 }}>
              Error: {quickAddMutation.error.message}
            </Text>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="User Watchlists" />
        <Card.Content>
          {watchlistsLoading ? (
            <Text>Loading watchlists...</Text>
          ) : watchlistsError ? (
            <Text style={{ color: colors.error }}>
              Error loading watchlists: {watchlistsError.message}
            </Text>
          ) : watchlists?.items.length === 0 ? (
            <Text>No watchlists found</Text>
          ) : (
            watchlists?.items.map((watchlist) => (
              <View key={watchlist.id} style={styles.watchlistItem}>
                <Text variant="titleMedium">{watchlist.title}</Text>
                <Text variant="bodySmall">ID: {watchlist.id}</Text>
                <Text variant="bodySmall">
                  Items: {watchlist.items?.length || 0}
                </Text>
                {watchlist.expand?.items && (
                  <View style={styles.expandedItems}>
                    <Text variant="bodySmall" style={{ fontWeight: "bold" }}>
                      Expanded Items:
                    </Text>
                    {watchlist.expand.items.map((item: any) => (
                      <Text key={item.id} variant="bodySmall">
                        • {item.title} (TMDB: {item.tmdb_id})
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Watched Items" />
        <Card.Content>
          {watchedLoading ? (
            <Text>Loading watched items...</Text>
          ) : watchedError ? (
            <Text style={{ color: colors.error }}>
              Error loading watched items: {watchedError.message}
            </Text>
          ) : !watchedItems || watchedItems.length === 0 ? (
            <Text>No watched items found</Text>
          ) : (
            watchedItems.map((item: any, index: number) => (
              <View key={index} style={styles.watchlistItem}>
                <Text variant="titleMedium">{item.title}</Text>
                <Text variant="bodySmall">TMDB ID: {item.tmdb_id}</Text>
                <Text variant="bodySmall">Type: {item.media_type}</Text>
              </View>
            ))
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="TMDB Movies with Watched Status" />
        <Card.Content>
          {tmdbLoading ? (
            <Text>Loading TMDB movies...</Text>
          ) : tmdbMovies ? (
            <>
              <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
                Found {tmdbMovies.results.length} movies
              </Text>
              {tmdbMovies.results.slice(0, 5).map((movie: any) => (
                <View key={movie.id} style={styles.watchlistItem}>
                  <Text variant="titleMedium">{movie.title}</Text>
                  <Text variant="bodySmall">TMDB ID: {movie.id}</Text>
                  <Text 
                    variant="bodySmall" 
                    style={{ 
                      color: movie.watched ? colors.primary : colors.onSurfaceVariant,
                      fontWeight: movie.watched ? "bold" : "normal"
                    }}
                  >
                    Status: {movie.watched ? "WATCHED" : "Not watched"}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <Text>No TMDB data available</Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  watchlistItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  expandedItems: {
    marginTop: 8,
    paddingLeft: 8,
  },
});
