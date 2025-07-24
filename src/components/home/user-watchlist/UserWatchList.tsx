import { LoadingIndicatorDots } from "@/components/screens/state-screens/LoadingIndicatorDots";
import { EmptyRoadSVG } from "@/components/shared/svg/empty";
import { pb } from "@/lib/pb/client";
import {
  useUserWatchListFiltersStore,
  useWatchListQueryOptions,
} from "@/lib/tanstack/operations/user-watchlist";

import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Text, Surface, Searchbar, useTheme } from "react-native-paper";

export function UserWatchList() {
  // filters
  const userId = pb.authStore?.record?.id;
  const { data, isLoading, error } = useQuery(useWatchListQueryOptions({ userId }));
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

  return (
    <UserWatchListContainer>
      <View style={styles.statesContainer}>
        <Text variant="titleLarge">UserWatchList</Text>
      </View>
    </UserWatchListContainer>
  );
}

export function UserWatchListContainer({ children }: { children: React.ReactNode }) {
  const { searchTerm, setSearchTerm, sort, setSort, filters, setFilters } =
    useUserWatchListFiltersStore();
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
});
