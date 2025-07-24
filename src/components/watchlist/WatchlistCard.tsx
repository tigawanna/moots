import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Card, Chip, IconButton, ProgressBar, Text } from 'react-native-paper';

import { type WatchlistItem } from '../../lib/tanstack/operations/watchlist/watchlist-types';
import { getOptimizedImageUrl } from '../../lib/tmdb/sdk-via-pb';
import { useWatchlistUIStore } from '../../store/watchlist-store';
import { addToWatchListMutationOptions, removeFromWatchListMutationOptions, toggleWatchedListItemMutationOptions } from '@/lib/tanstack/operations/watchlist/user-watchlist';
import { useMutation } from '@tanstack/react-query';

interface WatchlistCardProps {
  item: WatchlistItem;
  viewMode?: 'grid' | 'list';
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  showActions?: boolean;
}

export function WatchlistCard({ 
  item, 
  viewMode = 'grid',
  onPress,
  onLongPress,
  isSelected = false,
  showActions = true
}: WatchlistCardProps) {
  const router = useRouter();
  const { selectedItems, toggleItemSelection } = useWatchlistUIStore();
  


    const removeFromWatchlist = useMutation(removeFromWatchListMutationOptions());
    const toggleWatchedStatus = useMutation(toggleWatchedListItemMutationOptions());
  
  // Get poster image URL
  const posterUrl = item.poster_path ? getOptimizedImageUrl(item.poster_path, 'poster', 'medium') : undefined;
  
  // Format release date
  const releaseYear = item.release_date ? new Date(item.release_date).getFullYear() : null;
  
  // Format added date
  const addedDate = new Date(item.added_date);
  const formattedAddedDate = addedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: addedDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
  
  // Get status color and icon
  const getStatusColor = () => {
    switch (item.watched_status) {
      case 'watched': return '#4CAF50';
      case 'watching': return '#FF9800';
      case 'unwatched': return '#2196F3';
      default: return '#757575';
    }
  };
  
  const getStatusIcon = () => {
    switch (item.watched_status) {
      case 'watched': return 'check-circle';
      case 'watching': return 'play-circle';
      case 'unwatched': return 'bookmark';
      default: return 'bookmark';
    }
  };
  
  // Handle navigation
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      const route = item.media_type === 'movie' ? '/movie' : '/show';
      router.push(`${route}/${item.tmdb_id}`);
    }
  };
  
  // Handle long press for selection
  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress();
    } else {
      toggleItemSelection(item.id);
    }
  };
  
  // Handle remove with confirmation
  const handleRemove = () => {
    Alert.alert(
      'Remove from Watchlist',
      `Remove "${item.title}" from your watchlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromWatchlist.mutate({itemId: item.id}),
        }
      ]
    );
  };
  
  // Handle toggle watched status
  const handleToggleWatched = () => {
    const newStatus = item.watched_status === 'watched' ? false : true;
    toggleWatchedStatus.mutate({ itemId: item.id, watched: newStatus });
  };
  
  // Render rating stars
  const renderRatingStars = (rating: number | null) => {
    if (!rating) return null;
    
    const stars = Math.round(rating / 2); // Convert 1-10 to 1-5 stars
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialIcons
            key={star}
            name={star <= stars ? 'star' : 'star-border'}
            size={12}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };
  
  if (viewMode === 'list') {
    return (
      <Card 
        style={[
          styles.listCard,
          isSelected && styles.selectedCard
        ]}
        mode="outlined"
      >
        <Pressable
          onPress={handlePress}
          onLongPress={handleLongPress}
          style={styles.listContent}
        >
          <Image
            source={posterUrl ? { uri: posterUrl } : require('@/assets/images/poster-placeholder.jpeg')}
            style={styles.listPoster}
            contentFit="cover"
            placeholder={require('@/assets/images/poster-placeholder.jpeg')}
          />
          
          <View style={styles.listInfo}>
            <Text variant="titleMedium" numberOfLines={2} style={styles.title}>
              {item.title}
            </Text>
            
            <View style={styles.listMetadata}>
              <Text variant="bodySmall" style={styles.year}>
                {releaseYear} • {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
              </Text>
              
              <View style={styles.statusRow}>
                <Chip
                  icon={getStatusIcon()}
                  style={[styles.statusChip, { backgroundColor: getStatusColor() + '20' }]}
                  textStyle={{ color: getStatusColor(), fontSize: 12 }}
                  compact
                >
                  {item.watched_status}
                </Chip>
                
                {item.personal_rating && renderRatingStars(item.personal_rating)}
              </View>
            </View>
            
            <Text variant="bodySmall" style={styles.addedDate}>
              Added {formattedAddedDate}
            </Text>
            
            {item.notes && (
              <Text variant="bodySmall" numberOfLines={2} style={styles.notes}>
                {item.notes}
              </Text>
            )}
          </View>
          
          {showActions && (
            <View style={styles.listActions}>
              <IconButton
                icon={item.watched_status === 'watched' ? 'check-circle' : 'check-circle-outline'}
                size={20}
                iconColor={item.watched_status === 'watched' ? '#4CAF50' : '#757575'}
                onPress={handleToggleWatched}
              />
              <IconButton
                icon="delete-outline"
                size={20}
                iconColor="#F44336"
                onPress={handleRemove}
              />
            </View>
          )}
        </Pressable>
      </Card>
    );
  }
  
  // Grid view
  return (
    <Card 
      style={[
        styles.gridCard,
        isSelected && styles.selectedCard
      ]}
      mode="outlined"
    >
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={styles.gridContent}
      >
        <View style={styles.posterContainer}>
          <Image
            source={posterUrl ? { uri: posterUrl } : require('../../../assets/images/poster-placeholder.jpeg')}
            style={styles.gridPoster}
            contentFit="cover"
            placeholder={require('../../../assets/images/poster-placeholder.jpeg')}
          />
          
          {/* Status indicator overlay */}
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]}>
            <MaterialIcons
              name={getStatusIcon()}
              size={16}
              color="white"
            />
          </View>
          
          {/* Personal rating overlay */}
          {item.personal_rating && (
            <View style={styles.ratingOverlay}>
              <Text style={styles.ratingText}>
                {item.personal_rating}/10
              </Text>
            </View>
          )}
        </View>
        
        <Card.Content style={styles.gridInfo}>
          <Text variant="titleSmall" numberOfLines={2} style={styles.gridTitle}>
            {item.title}
          </Text>
          
          <Text variant="bodySmall" style={styles.gridYear}>
            {releaseYear}
          </Text>
          
          <Text variant="bodySmall" style={styles.gridAddedDate}>
            Added {formattedAddedDate}
          </Text>
          
          {/* Progress bar for TV shows being watched */}
          {item.media_type === 'tv' && item.watched_status === 'watching' && (
            <ProgressBar
              progress={0.6} // This would come from episode tracking
              color={getStatusColor()}
              style={styles.progressBar}
            />
          )}
        </Card.Content>
        
        {showActions && (
          <View style={styles.gridActions}>
            <IconButton
              icon={item.watched_status === 'watched' ? 'check' : 'check-outline'}
              size={18}
              iconColor={item.watched_status === 'watched' ? '#4CAF50' : '#757575'}
              onPress={handleToggleWatched}
              style={styles.actionButton}
            />
            <IconButton
              icon="delete-outline"
              size={18}
              iconColor="#F44336"
              onPress={handleRemove}
              style={styles.actionButton}
            />
          </View>
        )}
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  // Grid styles
  gridCard: {
    flex: 1,
    margin: 4,
    maxWidth: '48%',
  },
  gridContent: {
    flex: 1,
  },
  posterContainer: {
    position: 'relative',
    aspectRatio: 2/3,
  },
  gridPoster: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  statusIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  gridInfo: {
    flex: 1,
    paddingTop: 8,
  },
  gridTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  gridYear: {
    color: '#666',
    marginBottom: 2,
  },
  gridAddedDate: {
    color: '#999',
    fontSize: 10,
  },
  progressBar: {
    marginTop: 4,
    height: 2,
  },
  gridActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  actionButton: {
    margin: 0,
  },
  
  // List styles
  listCard: {
    marginVertical: 4,
    marginHorizontal: 8,
  },
  listContent: {
    flexDirection: 'row',
    padding: 12,
  },
  listPoster: {
    width: 60,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  listInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  listMetadata: {
    marginBottom: 4,
  },
  year: {
    color: '#666',
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusChip: {
    height: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 1,
  },
  addedDate: {
    color: '#999',
    marginBottom: 4,
  },
  notes: {
    color: '#666',
    fontStyle: 'italic',
  },
  listActions: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
  
  // Common styles
  selectedCard: {
    borderColor: '#2196F3',
    borderWidth: 2,
  },
});
