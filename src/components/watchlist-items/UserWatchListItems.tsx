import { EmptyRoadSVG } from "@/components/shared/svg/empty";
import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import { pb } from "@/lib/pb/client";
import {
  useUserWatchListFiltersStore,
  watchListItemsQueryOptions,
} from "@/lib/tanstack/operations/watchlist-items/query-options";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Searchbar, Surface, Text, useTheme } from "react-native-paper";
import { UserWatchListFlatList } from "./UserWatchListItemsFlatList";

export function UserWatchList({ community }: { community?: boolean }) {
  // filters
  const userId = pb.authStore?.record?.id;
  const { data, isLoading, error, refetch } = useQuery(
    watchListItemsQueryOptions({ userId: community ? undefined : userId })
  );

  const { colors } = useTheme();

  if (isLoading) {
    return (
      <UserWatchListScafold>
        <LoadingIndicatorDots />
      </UserWatchListScafold>
    );
  }
  if (error) {
    return (
      <UserWatchListScafold>
        <View style={styles.statesContainer}>
          {__DEV__ ? (
            <View>
              <Text variant="titleMedium" style={{ color: colors.error }}>
                Failed to load
              </Text>
              <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
                {error instanceof Error ? error.message : "Unknown error"}
              </Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <EmptyRoadSVG />
              </View>
              <Text variant="headlineSmall" style={[styles.emptyTitle, { color: colors.onSurface }]}>
                Something went wrong
              </Text>
              <Text variant="bodyMedium" style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
                Try adjusting your filters or search terms to discover more content
              </Text>
            </View>
        
          )}
        </View>
      </UserWatchListScafold>
    );
  }
  if (!data) {
    return (
      <UserWatchListScafold>
        <View style={styles.statesContainer}>
          {__DEV__ ? (
            <View>
              <Text variant="titleMedium" style={{ color: colors.error }}>
                No watchlist items found
              </Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <EmptyRoadSVG />
              </View>
              <Text
                variant="headlineSmall"
                style={[styles.emptyTitle, { color: colors.onSurface }]}>
                No watchlist items found
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
                Try adjusting your filters or search terms to discover more content
              </Text>
            </View>
          )}
        </View>
      </UserWatchListScafold>
    );
  }

  return (
    <UserWatchListScafold>
      <View style={styles.statesContainer}>
        <UserWatchListFlatList watchList={data.items} refetch={refetch} />
      </View>
    </UserWatchListScafold>
  );
}

export function UserWatchListScafold({ children }: { children: React.ReactNode }) {
  const { searchTerm, setSearchTerm } = useUserWatchListFiltersStore();
  const { colors } = useTheme();

  return (
    <Surface style={{ ...styles.container }}>
      <Searchbar
        placeholder="Search Watchlist"
        onChangeText={(term) => setSearchTerm(term)}
        value={searchTerm}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        iconColor={colors.onSurfaceVariant}
        placeholderTextColor={colors.onSurfaceVariant}
      />
      {children}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    gap: 6,
    paddingHorizontal: 14,
  },
  statesContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  searchBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  searchInput: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  emptyIconContainer: {
    opacity: 0.6,
    marginBottom: 8,
  },
  emptyTitle: {
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
  },
  emptySubtitle: {
    textAlign: "center",
    opacity: 0.8,
    maxWidth: 280,
    lineHeight: 20,
  },
});
