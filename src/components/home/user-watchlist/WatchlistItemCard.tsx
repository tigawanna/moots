import { WatchlistResponse } from '@/lib/pb/types/pb-types';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Card, Chip, IconButton, Text, useTheme } from 'react-native-paper';

interface WatchlistItemCardProps {
  item: WatchlistResponse;
  viewMode?: 'grid' | 'list';
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  showActions?: boolean;
}

export function WatchlistItemCard({ 
  item, 
  viewMode = 'grid',
  onPress,
  onLongPress,
  isSelected = false,
  showActions = true
}: WatchlistItemCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  
  // Get poster image URL (using TMDB base URL)
  const posterUrl = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : null;
  
  // Format release date
  const releaseYear = item.release_date ? new Date(item.release_date).getFullYear() : null;
  
  // Format added date
  const addedDate = new Date(item.created);
  const formattedAddedDate = addedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: addedDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
  
  // Get status color and icon
  const getStatusColor = () => {
    return item.watched_status ? '#4CAF50' : '#2196F3';
  };
  
  const getStatusIcon = () => {
    return item.watched_status ? 'check-circle' : 'bookmark';
  };
  
  const getStatusText = () => {
    return item.watched_status ? 'Watched' : 'To Watch';
  };
  
  // Handle navigation
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      const mediaType = item.media_type[0] || 'movie';
      const route = mediaType === 'movie' ? '/movie' : '/show';
      router.push(`${route}/${item.tmdb_id}`);
    }
  };
  
  // Handle long press for selection
  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress();
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
          onPress: () => {
            // TODO: Implement remove functionality
            console.log('Remove item:', item.id);
          }
        }
      ]
    );
  };
  
  // Handle toggle watched status
  const handleToggleWatched = () => {
    // TODO: Implement toggle watched functionality
    console.log('Toggle watched:', item.id, !item.watched_status);
  };
  
  // Render rating stars
  const renderRatingStars = (rating: number) => {
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
                {releaseYear} • {item.media_type[0] === 'movie' ? 'Movie' : 'TV Show'}
              </Text>
              
              <View style={styles.statusRow}>
                <Chip
                  icon={getStatusIcon()}
                  style={[styles.statusChip, { backgroundColor: getStatusColor() + '20' }]}
                  textStyle={{ color: getStatusColor(), fontSize: 12 }}
                  compact
                >
                  {getStatusText()}
                </Chip>
                
                {item.personal_rating > 0 && renderRatingStars(item.personal_rating)}
              </View>
              
              {item.vote_average > 0 && (
                <Text variant="bodySmall" style={styles.tmdbRating}>
                  TMDB: {item.vote_average.toFixed(1)}/10
                </Text>
              )}
            </View>
            
            <Text variant="bodySmall" style={styles.addedDate}>
              Added {formattedAddedDate}
            </Text>
            
            {item.notes && (
              <Text variant="bodySmall" numberOfLines={2} style={styles.notes}>
                {item.notes}
              </Text>
            )}
            
            {item.overview && (
              <Text variant="bodySmall" numberOfLines={3} style={styles.overview}>
                {item.overview}
              </Text>
            )}
          </View>
          
          {showActions && (
            <View style={styles.listActions}>
              <IconButton
                icon={item.watched_status ? 'check-circle' : 'check-circle-outline'}
                size={20}
                iconColor={item.watched_status ? '#4CAF50' : '#757575'}
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
            source={posterUrl ? { uri: posterUrl } : require('@/assets/images/poster-placeholder.jpeg')}
            style={styles.gridPoster}
            contentFit="cover"
            placeholder={require('@/assets/images/poster-placeholder.jpeg')}
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
          {item.personal_rating > 0 && (
            <View style={styles.ratingOverlay}>
              <Text style={styles.ratingText}>
                {item.personal_rating}/10
              </Text>
            </View>
          )}
          
          {/* TMDB rating overlay */}
          {item.vote_average > 0 && (
            <View style={styles.tmdbRatingOverlay}>
              <MaterialIcons name="star" size={12} color="#FFD700" />
              <Text style={styles.tmdbRatingText}>
                {item.vote_average.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
        
        <Card.Content style={styles.gridInfo}>
          <Text variant="titleSmall" numberOfLines={2} style={styles.gridTitle}>
            {item.title}
          </Text>
          
          <Text variant="bodySmall" style={styles.gridYear}>
            {releaseYear} • {item.media_type[0] === 'movie' ? 'Movie' : 'TV'}
          </Text>
          
          <Text variant="bodySmall" style={styles.gridAddedDate}>
            Added {formattedAddedDate}
          </Text>
          
          <View style={styles.statusRow}>
            <Chip
              icon={getStatusIcon()}
              style={[styles.gridStatusChip, { backgroundColor: getStatusColor() + '20' }]}
              textStyle={{ color: getStatusColor(), fontSize: 10 }}
              compact
            >
              {getStatusText()}
            </Chip>
          </View>
        </Card.Content>
        
        {showActions && (
          <View style={styles.gridActions}>
            <IconButton
              icon={item.watched_status ? 'check' : 'check-outline'}
              size={18}
              iconColor={item.watched_status ? '#4CAF50' : '#757575'}
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
  tmdbRatingOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  tmdbRatingText: {
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
    marginBottom: 4,
  },
  gridStatusChip: {
    height: 20,
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
    width: 80,
    height: 120,
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
    marginBottom: 4,
  },
  statusChip: {
    height: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 1,
  },
  tmdbRating: {
    color: '#666',
    marginTop: 2,
  },
  addedDate: {
    color: '#999',
    marginBottom: 4,
  },
  notes: {
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  overview: {
    color: '#666',
    lineHeight: 16,
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