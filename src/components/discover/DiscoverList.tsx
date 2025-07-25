import { FlatList, ScrollView, StyleSheet, View } from 'react-native'
import { Text,Surface } from 'react-native-paper';
 
export function DiscoverList(){
return (
  <View style={styles.discoverContainer}>
    {/* Category Selection */}
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoryScroll}
      contentContainerStyle={styles.categoryContent}>
      {DISCOVER_CATEGORIES.map((category) => (
        <Chip
          key={category.key}
          selected={selectedCategory === category.key}
          onPress={() => setSelectedCategory(category.key)}
          style={[
            styles.categoryChip,
            selectedCategory === category.key
              ? {
                  backgroundColor: colors.tertiary,
                  borderColor: colors.secondary,
                }
              : {
                  backgroundColor: colors.surfaceVariant,
                },
          ]}
          textStyle={selectedCategory === category.key ? styles.selectedCategoryText : undefined}>
          <Text>{category.label}</Text>
        </Chip>
      ))}
    </ScrollView>

    {/* Results Grid */}
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
      ListEmptyComponent={
        discoverLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text>No results found</Text>
          </View>
        )
      }
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
