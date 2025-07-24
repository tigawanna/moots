import { LoadingIndicatorDots } from "@/components/screens/state-screens/LoadingIndicatorDots";
import { EmptyRoadSVG } from "@/components/shared/svg/empty";
import { pb } from "@/lib/pb/client";
import {
  useUserWatchListFiltersStore,
  watchListQueryOptions,
} from "@/lib/tanstack/operations/watchlist/user-watchlist";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Searchbar, Surface, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { UserWatchListFlatList } from "./UserWatchListFlatList";

export function UserWatchList({ community }: { community?: boolean }) {
  // filters
  const userId = pb.authStore?.record?.id;
  const { data, isLoading, error, refetch } = useQuery(
    watchListQueryOptions({ userId: community ? undefined : userId })
  );

  const { colors } = useTheme();

  if (isLoading) {
    return (
      <UserWatchListContainer>
        <LoadingIndicatorDots />
      </UserWatchListContainer>
    );
  }
  if (error) {
    return (
      <UserWatchListContainer>
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
            <View style={{ alignItems: "center", justifyContent: "center", gap: 40 }}>
              <EmptyRoadSVG />
              <Text variant="titleLarge">Something went wrong</Text>
            </View>
          )}
        </View>
      </UserWatchListContainer>
    );
  }
  if (!data) {
    return (
      <UserWatchListContainer>
        <View style={styles.statesContainer}>
          {__DEV__ ? (
            <View>
              <Text variant="titleMedium" style={{ color: colors.error }}>
                No watchlist items found
              </Text>
            </View>
          ) : (
            <View style={{ alignItems: "center", justifyContent: "center", gap: 40 }}>
              <EmptyRoadSVG />
              <Text variant="titleLarge">No watchlist items found</Text>
            </View>
          )}
        </View>
      </UserWatchListContainer>
    );
  }

  return (
    <UserWatchListContainer>
      <View style={styles.statesContainer}>
        <UserWatchListFlatList watchList={data.items} refetch={refetch} />
      </View>
    </UserWatchListContainer>
  );
}

export function UserWatchListContainer({ children }: { children: React.ReactNode }) {
  const { searchTerm, setSearchTerm } = useUserWatchListFiltersStore();
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();
  return (
    <Surface style={{ ...styles.container, paddingTop: top }}>
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
});
