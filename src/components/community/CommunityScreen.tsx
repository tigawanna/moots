import { CommunityWatchlistCard } from '@/components/community/CommunityWatchlistCard';
import { pb } from '@/lib/pb/client';
import { useCommunityWatchlists } from '@/lib/tanstack/operations/watchlist/old/watchlist-hooks';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import {
    Button,
    Chip,
    FAB,
    Searchbar,
    SegmentedButtons,
    Surface,
    Text,
    useTheme
} from 'react-native-paper';

const SORT_OPTIONS = [
  { key: '-created', label: 'Newest' },
  { key: '-like_count', label: 'Most Liked' },
  { key: '-item_count', label: 'Largest' },
  { key: 'title', label: 'A-Z' },
];

const CATEGORY_FILTERS = [
  { key: 'all', label: 'All Categories' },
  { key: 'movies', label: 'Movies' },
  { key: 'tv_shows', label: 'TV Shows' },
  { key: 'mixed', label: 'Mixed' },
  { key: 'documentaries', label: 'Documentaries' },
  { key: 'anime', label: 'Anime' },
];

export function CommunityScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const userId = pb.authStore.model?.id;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('discover');
  const [sortBy, setSortBy] = useState('-created');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Build filter string
  const buildFilterString = () => {
    let filter = 'is_public = true';
    
    if (categoryFilter !== 'all') {
      filter += ` && category = "${categoryFilter}"`;
    }
    
    if (searchQuery.trim()) {
      filter += ` && (title ~ "${searchQuery}" || description ~ "${searchQuery}")`;
    }
    
    return filter;
  };
  
  // Data hooks
  const {
    data: communityLists,
    isLoading,
    error,
    refetch,
  } = useCommunityWatchlists({
    filter: buildFilterString(),
    sort: sortBy,
    page: 1,
    perPage: 20,
  });
  
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);
  
  const handleCreateList = () => {
    router.push('/create-community-list');
  };
  
  const renderListItem = useCallback(({ item }: { item: any }) => (
    <CommunityWatchlistCard
      watchlist={item}
      onPress={() => router.push(`/community-list/${item.id}`)}
    />
  ), [router]);
  
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        {searchQuery.trim() ? 'No lists found' : 'No community lists yet'}
      </Text>
      <Text variant="bodyLarge" style={styles.emptySubtitle}>
        {searchQuery.trim() 
          ? 'Try adjusting your search or filters'
          : 'Be the first to share your watchlist with the community'
        }
      </Text>
      {!searchQuery.trim() && (
        <Button
          mode="contained"
          icon="plus"
          onPress={handleCreateList}
          style={styles.createButton}
        >
          Create Community List
        </Button>
      )}
    </View>
  );
  
  const renderDiscoverContent = () => (
    <View style={styles.content}>
      {/* Sort and Filter Controls */}
      <View style={styles.controlsContainer}>
        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <Text variant="labelMedium" style={styles.controlLabel}>
            Sort by:
          </Text>
          <View style={styles.sortChips}>
            {SORT_OPTIONS.map((option) => (
              <Chip
                key={option.key}
                selected={sortBy === option.key}
                onPress={() => setSortBy(option.key)}
                style={[
                  styles.sortChip,
                  sortBy === option.key && styles.selectedChip
                ]}
                textStyle={sortBy === option.key ? styles.selectedChipText : undefined}
              >
                {option.label}
              </Chip>
            ))}
          </View>
        </View>
        
        {/* Category Filter */}
        <View style={styles.filterContainer}>
          <Text variant="labelMedium" style={styles.controlLabel}>
            Category:
          </Text>
          <View style={styles.filterChips}>
            {CATEGORY_FILTERS.map((filter) => (
              <Chip
                key={filter.key}
                selected={categoryFilter === filter.key}
                onPress={() => setCategoryFilter(filter.key)}
                style={[
                  styles.filterChip,
                  categoryFilter === filter.key && styles.selectedChip
                ]}
                textStyle={categoryFilter === filter.key ? styles.selectedChipText : undefined}
              >
                {filter.label}
              </Chip>
            ))}
          </View>
        </View>
      </View>
      
      {/* Community Lists */}
      <FlatList
        data={communityLists?.items || []}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          (!communityLists?.items?.length) && styles.emptyContainer
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
  
  const renderMyListsContent = () => (
    <View style={styles.content}>
      <Text variant="bodyLarge" style={styles.comingSoon}>
        My Community Lists - Coming Soon
      </Text>
      <Text variant="bodyMedium" style={styles.comingSoonSubtext}>
        Manage your shared watchlists and see engagement stats
      </Text>
    </View>
  );
  
  return (
    <Surface style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Community Watchlists
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          Discover and share movie & TV collections
        </Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search community lists..."
          value={searchQuery}
          onChangeText={handleSearchChange}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={colors.onSurfaceVariant}
          placeholderTextColor={colors.onSurfaceVariant}
        />
      </View>
      
      {/* Tab Navigation */}
      {!isSearchFocused && (
        <View style={styles.tabContainer}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={setActiveTab}
            buttons={[
              {
                value: 'discover',
                label: 'Discover',
                icon: 'compass-outline',
              },
              {
                value: 'my-lists',
                label: 'My Lists',
                icon: 'account-outline',
                disabled: !userId,
              },
            ]}
            style={styles.segmentedButtons}
          />
        </View>
      )}
      
      {/* Content */}
      {activeTab === 'discover' ? renderDiscoverContent() : renderMyListsContent()}
      
      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateList}
        label="Create List"
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Header
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#666',
  },
  
  // Search
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  searchBar: {
    elevation: 2,
  },
  searchInput: {
    fontSize: 16,
  },
  
  // Tabs
  tabContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: 'white',
  },
  segmentedButtons: {
    backgroundColor: 'transparent',
  },
  
  // Content
  content: {
    flex: 1,
  },
  
  // Controls
  controlsContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  controlLabel: {
    marginBottom: 8,
    color: '#666',
  },
  sortContainer: {
    marginBottom: 16,
  },
  sortChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortChip: {
    marginRight: 0,
  },
  filterContainer: {},
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    marginRight: 0,
  },
  selectedChip: {
    backgroundColor: '#2196F3',
  },
  selectedChipText: {
    color: 'white',
  },
  
  // List
  listContainer: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Empty state
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
  },
  createButton: {
    marginTop: 8,
  },
  
  // Coming soon
  comingSoon: {
    textAlign: 'center',
    marginTop: 64,
    marginBottom: 8,
  },
  comingSoonSubtext: {
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 32,
  },
  
  // FAB
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
