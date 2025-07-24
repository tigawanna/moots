import { WatchlistCard } from '@/components/watchlist/WatchlistCard';
import { WatchlistFilters } from '@/components/watchlist/WatchlistFilters';
import { useWatchlistLimit } from '@/hooks/useWatchlistLimit';
import { pb } from '@/lib/pb/client';
import { useUserWatchlistInfinite, useWatchlistStats } from '@/lib/tanstack/operations/watchlist/old/watchlist-hooks';
import { type WatchlistItem } from '@/lib/tanstack/operations/watchlist/watchlist-types';
import { useWatchlistFilters, useWatchlistUIStore } from '@/store/watchlist-store';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import {
    Button,
    Card,
    FAB,
    IconButton,
    Modal,
    Portal,
    ProgressBar,
    Snackbar,
    Surface,
    Text
} from 'react-native-paper';

export function HomeScreenComponent() {
  const router = useRouter();
  const userId = pb.authStore.record?.id;
  
  // UI State
  const { 
    viewMode, 
    selectedItems, 
    clearSelection,
    setViewMode 
  } = useWatchlistUIStore();
  
  const { filterString, sortString } = useWatchlistFilters();
  
  // Local state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  
  // Data hooks
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useUserWatchlistInfinite({
    userId: userId || '',
    perPage: 20,
    filter: filterString,
    sort: sortString,
  });
  
  const { data: stats, isLoading: statsLoading } = useWatchlistStats(userId || '');
  const { 
    currentCount, 
    limit, 
    usagePercentage, 
    warningMessage, 
    warningColor 
  } = useWatchlistLimit();
  
  // Flatten paginated data
  const watchlistItems = data?.pages.flatMap(page => page.items) || [];
  
  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);
  
  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  
  // Handle item press
  const handleItemPress = useCallback((item: WatchlistItem) => {
    const route = item.media_type === 'movie' ? '/movie' : '/show';
    router.push(`${route}/${item.tmdb_id}`);
  }, [router]);
  
  // Handle batch operations
  const handleBatchDelete = () => {
    if (selectedItems.length === 0) return;
    
    Alert.alert(
      'Remove Items',
      `Remove ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} from your watchlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement batch delete
            setSnackbarMessage(`Removed ${selectedItems.length} items from watchlist`);
            setSnackbarVisible(true);
            clearSelection();
          }
        }
      ]
    );
  };
  
  // Render item
  const renderItem = useCallback(({ item }: { item: WatchlistItem }) => (
    <WatchlistCard
      item={item}
      viewMode={viewMode}
      onPress={() => handleItemPress(item)}
      isSelected={selectedItems.includes(item.id)}
    />
  ), [viewMode, selectedItems, handleItemPress]);
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        Your Watchlist is Empty
      </Text>
      <Text variant="bodyLarge" style={styles.emptySubtitle}>
        Start building your personal movie and TV show collection
      </Text>
      <Button
        mode="contained"
        icon="explore"
        onPress={() => router.push('/explore')}
        style={styles.exploreButton}
      >
        Explore Movies & TV Shows
      </Button>
    </View>
  );
  
  // Render loading state
  if (isLoading) {
    return (
      <Surface style={styles.container}>
        <WatchlistFilters />
        <View style={styles.loadingContainer}>
          <Text variant="bodyLarge">Loading your watchlist...</Text>
          <ProgressBar indeterminate style={styles.loadingBar} />
        </View>
      </Surface>
    );
  }
  console.log('Watchlist items error :', error);
  // Render error state
  if (error) {
    return (
      <Surface style={styles.container}>
        <View style={styles.errorContainer}>
          <Text variant="headlineSmall" style={styles.errorTitle}>
            Something went wrong
          </Text>
          <Text variant="bodyLarge" style={styles.errorMessage}>
            {error.message}
          </Text>
          <Button mode="contained" onPress={handleRefresh}>
            Try Again
          </Button>
        </View>
      </Surface>
    );
  }
  
  return (
    <Surface style={styles.container}>
      {/* Header with stats and controls */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.titleSection}>
            <Text variant="headlineSmall" style={styles.title}>
              My Watchlist
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {currentCount} of {limit} items
            </Text>
          </View>
          
          <View style={styles.headerActions}>
            <IconButton
              icon="bar-chart"
              onPress={() => setStatsModalVisible(true)}
            />
            <IconButton
              icon={viewMode === 'grid' ? 'view-list' : 'view-module'}
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            />
          </View>
        </View>
        
        {/* Usage progress bar */}
        <ProgressBar
          progress={usagePercentage / 100}
          color={warningColor}
          style={styles.usageBar}
        />
        
        {/* Warning message */}
        {warningMessage && (
          <Text variant="bodySmall" style={[styles.warningText, { color: warningColor }]}>
            {warningMessage}
          </Text>
        )}
      </View>
      
      {/* Filters */}
      <WatchlistFilters />
      
      {/* Selection toolbar */}
      {selectedItems.length > 0 && (
        <View style={styles.selectionToolbar}>
          <Text variant="bodyMedium">
            {selectedItems.length} selected
          </Text>
          <View style={styles.selectionActions}>
            <IconButton
              icon="delete"
              iconColor="#F44336"
              onPress={handleBatchDelete}
            />
            <IconButton
              icon="close"
              onPress={clearSelection}
            />
          </View>
        </View>
      )}
      
      {/* Watchlist */}
      <FlatList
        data={watchlistItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render when view mode changes
        contentContainerStyle={[
          styles.listContainer,
          watchlistItems.length === 0 && styles.emptyContainer
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.loadMoreContainer}>
              <ProgressBar indeterminate style={styles.loadMoreBar} />
            </View>
          ) : null
        }
      />
      
      {/* Floating Action Button */}
      <FAB
        icon="add"
        style={styles.fab}
        onPress={() => router.push('/explore')}
        label="Add Movies"
      />
      
      {/* Stats Modal */}
      <Portal>
        <Modal
          visible={statsModalVisible}
          onDismiss={() => setStatsModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Card>
            <Card.Title title="Watchlist Statistics" />
            <Card.Content>
              {statsLoading ? (
                <ProgressBar indeterminate />
              ) : stats ? (
                <View style={styles.statsContainer}>
                  <View style={styles.statRow}>
                    <Text variant="bodyLarge">Total Items:</Text>
                    <Text variant="bodyLarge" style={styles.statValue}>{stats.total}</Text>
                  </View>
                  
                  <View style={styles.statRow}>
                    <Text variant="bodyMedium">Watched:</Text>
                    <Text variant="bodyMedium" style={styles.statValue}>{stats.watched}</Text>
                  </View>
                  
                  <View style={styles.statRow}>
                    <Text variant="bodyMedium">Currently Watching:</Text>
                    <Text variant="bodyMedium" style={styles.statValue}>{stats.watching}</Text>
                  </View>
                  
                  <View style={styles.statRow}>
                    <Text variant="bodyMedium">Plan to Watch:</Text>
                    <Text variant="bodyMedium" style={styles.statValue}>{stats.unwatched}</Text>
                  </View>
                  
                  <View style={styles.statRow}>
                    <Text variant="bodyMedium">Movies:</Text>
                    <Text variant="bodyMedium" style={styles.statValue}>{stats.movies}</Text>
                  </View>
                  
                  <View style={styles.statRow}>
                    <Text variant="bodyMedium">TV Shows:</Text>
                    <Text variant="bodyMedium" style={styles.statValue}>{stats.tvShows}</Text>
                  </View>
                  
                  {stats.averageRating > 0 && (
                    <View style={styles.statRow}>
                      <Text variant="bodyMedium">Average Rating:</Text>
                      <Text variant="bodyMedium" style={styles.statValue}>
                        {stats.averageRating.toFixed(1)}/10
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.statRow}>
                    <Text variant="bodyMedium">Limit Used:</Text>
                    <Text variant="bodyMedium" style={styles.statValue}>
                      {Math.round(stats.limitUsed)}%
                    </Text>
                  </View>
                </View>
              ) : (
                <Text>No statistics available</Text>
              )}
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => setStatsModalVisible(false)}>Close</Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
      
      {/* Snackbar for notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Header styles
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
  },
  headerActions: {
    flexDirection: 'row',
  },
  usageBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 12,
    textAlign: 'center',
  },
  
  // Selection toolbar
  selectionToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  selectionActions: {
    flexDirection: 'row',
  },
  
  // List styles
  listContainer: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingBar: {
    width: 200,
    marginTop: 16,
  },
  loadMoreContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadMoreBar: {
    width: 100,
  },
  
  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#666',
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
  exploreButton: {
    marginTop: 8,
  },
  
  // FAB
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  
  // Modal styles
  modalContent: {
    margin: 20,
  },
  statsContainer: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statValue: {
    fontWeight: '600',
  },
});
