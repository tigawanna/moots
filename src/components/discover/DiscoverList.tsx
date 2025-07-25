import { FlatList, StyleSheet, View } from 'react-native'
import { WatchlistItemCard } from '../shared/watchlist/WatchlistItemCard';
import { TMDBDiscoverResponse } from '@/lib/tanstack/operations/discover/tmdb-hooks';
 
interface DiscoverListProps {
  discoverResults: TMDBDiscoverResponse | undefined;
  currentCategory:
    | {
        key: string;
        label: string;
        type: string;
        sort: string;
      }
    | undefined;
}

export function DiscoverList({ currentCategory, discoverResults }: DiscoverListProps) {
  return (
    <View style={styles.discoverContainer}>
    {/* Category Selection */}
    <FlatList
      data={(discoverResults?.results as any[]) || []}
      renderItem={({ item }) => (
        <WatchlistItemCard
          item={item}
          viewMode="grid"
          // onPress={(id)=>{
          //   router.push(id)
          // }}
          showActions={true}
        />
      )}
      keyExtractor={(item) => `${item.id}-${currentCategory?.type}`}
      numColumns={2}
      contentContainerStyle={styles.resultsGrid}
      showsVerticalScrollIndicator={false}
      // ListEmptyComponent={
      //   discoverLoading ? (
      //     <View style={styles.loadingContainer}>
      //       <Text>Loading...</Text>
      //     </View>
      //   ) : (
      //     <View style={styles.emptyContainer}>
      //       <Text>No results found</Text>
      //     </View>
      //   )
      // }
    />
  </View>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Search styles
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    elevation: 2,
  },
  searchInput: {
    fontSize: 16,
  },

  // Content styles
  content: {
    flex: 1,
  },

  // Discover styles
  discoverContainer: {
    flex: 1,
  },
  categoryScroll: {
    maxHeight: 50,
    marginBottom: 8,
  },
  categoryContent: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
  },

  selectedCategoryText: {
    color: "white",
  },

  // Results styles
  resultsGrid: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
