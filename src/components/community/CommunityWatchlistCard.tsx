import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Avatar, Card, Chip, IconButton, Text } from 'react-native-paper';
import { type CommunityWatchlist } from '../../lib/tanstack/operations/watchlist/watchlist-types';

interface CommunityWatchlistCardProps {
  watchlist: CommunityWatchlist;
  onPress?: () => void;
  onLike?: () => void;
  onImport?: () => void;
  showActions?: boolean;
}

export function CommunityWatchlistCard({
  watchlist,
  onPress,
  onLike,
  onImport,
  showActions = true
}: CommunityWatchlistCardProps) {
  
  // Format created date
  const createdDate = new Date(watchlist.created);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: createdDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
  
  // Get category color
  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'movies': return '#E91E63';
      case 'tv_shows': return '#9C27B0';
      case 'mixed': return '#2196F3';
      case 'documentaries': return '#FF9800';
      case 'anime': return '#4CAF50';
      case 'comedy': return '#FFEB3B';
      case 'drama': return '#795548';
      case 'action': return '#F44336';
      case 'horror': return '#424242';
      case 'sci_fi': return '#00BCD4';
      case 'romance': return '#E91E63';
      case 'thriller': return '#607D8B';
      default: return '#757575';
    }
  };
  
  // Format category name
  const formatCategoryName = (category: string | null) => {
    if (!category) return 'Mixed';
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  return (
    <Card style={styles.card} mode="outlined">
      <Pressable onPress={onPress} style={styles.pressable}>
        <Card.Content style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Avatar.Text
                size={32}
                label={watchlist.expand?.user?.name?.charAt(0) || 'U'}
                style={styles.avatar}
              />
              <View style={styles.userDetails}>
                <Text variant="bodyMedium" style={styles.userName}>
                  {watchlist.expand?.user?.name || 'Anonymous'}
                </Text>
                <Text variant="bodySmall" style={styles.createdDate}>
                  {formattedDate}
                </Text>
              </View>
            </View>
            
            {watchlist.category && (
              <Chip
                style={[
                  styles.categoryChip,
                  { backgroundColor: getCategoryColor(watchlist.category) + '20' }
                ]}
                textStyle={{ 
                  color: getCategoryColor(watchlist.category),
                  fontSize: 10 
                }}
                compact
              >
                {formatCategoryName(watchlist.category)}
              </Chip>
            )}
          </View>
          
          {/* Title and Description */}
          <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
            {watchlist.title}
          </Text>
          
          {watchlist.description && (
            <Text variant="bodyMedium" style={styles.description} numberOfLines={3}>
              {watchlist.description}
            </Text>
          )}
          
          {/* Tags */}
          {watchlist.tags && watchlist.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {watchlist.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  style={styles.tagChip}
                  textStyle={styles.tagText}
                  compact
                >
                  {tag}
                </Chip>
              ))}
              {watchlist.tags.length > 3 && (
                <Text variant="bodySmall" style={styles.moreTagsText}>
                  +{watchlist.tags.length - 3} more
                </Text>
              )}
            </View>
          )}
          
          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <MaterialIcons name="movie" size={16} color="#666" />
              <Text variant="bodySmall" style={styles.statText}>
                {watchlist.item_count} items
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialIcons name="favorite" size={16} color="#666" />
              <Text variant="bodySmall" style={styles.statText}>
                {watchlist.like_count} likes
              </Text>
            </View>
          </View>
          
          {/* Actions */}
          {showActions && (
            <View style={styles.actions}>
              <IconButton
                icon="favorite-outline"
                size={20}
                iconColor="#E91E63"
                onPress={onLike}
                style={styles.actionButton}
              />
              <IconButton
                icon="download"
                size={20}
                iconColor="#2196F3"
                onPress={onImport}
                style={styles.actionButton}
              />
              <IconButton
                icon="share"
                size={20}
                iconColor="#666"
                onPress={() => {
                  // Handle share
                }}
                style={styles.actionButton}
              />
            </View>
          )}
        </Card.Content>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    marginHorizontal: 8,
  },
  pressable: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 8,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    marginBottom: 2,
  },
  createdDate: {
    color: '#666',
  },
  categoryChip: {
    height: 24,
  },
  
  // Content
  title: {
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 20,
  },
  description: {
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  
  // Tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  tagChip: {
    height: 20,
    backgroundColor: '#F5F5F5',
  },
  tagText: {
    fontSize: 10,
    color: '#666',
  },
  moreTagsText: {
    color: '#999',
    fontSize: 10,
    marginLeft: 4,
  },
  
  // Stats
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#666',
  },
  
  // Actions
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 4,
  },
  actionButton: {
    margin: 0,
  },
});
