import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { UnifiedWatchlistItem } from './types';
import { WatchlistItemActions } from './WatchlistItemActions';
import { WatchlistItemStatus } from './WatchlistItemStatus';
import { WatchlistItemUtils } from './WatchlistItemUtils';

interface WatchlistItemGridCardProps {
  item: UnifiedWatchlistItem;
  onPress?: () => void;
  onLongPress?: () => void;
  onToggleWatched?: (item: UnifiedWatchlistItem) => void;
  onRemove?: (item: UnifiedWatchlistItem) => void;
  onAdd?: (item: UnifiedWatchlistItem) => void;
  isSelected?: boolean;
  showActions?: boolean;
}

export function WatchlistItemGridCard({ 
  item,
  onPress,
  onLongPress,
  onToggleWatched,
  onRemove,
  onAdd,
  isSelected = false,
  showActions = true
}: WatchlistItemGridCardProps) {
  const { colors } = useTheme();
  
  const posterUrl = WatchlistItemUtils.getPosterUrl(item);
  const releaseYear = WatchlistItemUtils.getReleaseYear(item);
  const addedDate = WatchlistItemUtils.getFormattedAddedDate(item);
  const personalRating = WatchlistItemUtils.getPersonalRating(item);
  const isWatched = WatchlistItemUtils.getWatchedStatus(item);

  const getStatusColor = () => {
    const isInWatchlist = WatchlistItemUtils.isInWatchlist(item);
    if (!isInWatchlist) return colors.outline;
    return isWatched ? colors.primary : colors.secondary;
  };

  const getStatusIcon = () => {
    const isInWatchlist = WatchlistItemUtils.isInWatchlist(item);
    if (!isInWatchlist) return 'bookmark-outline';
    return isWatched ? 'check-circle' : 'bookmark';
  };

  const cardStyle = [
    styles.gridCard,
    isSelected && { 
      borderColor: colors.primary, 
      borderWidth: 2 
    },
    { backgroundColor: colors.surface }
  ];

  return (
    <Card style={cardStyle} mode="outlined">
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
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
          <View style={[
            styles.statusIndicator, 
            { backgroundColor: getStatusColor() }
          ]}>
            <MaterialIcons
              name={getStatusIcon()}
              size={16}
              color={colors.onPrimary}
            />
          </View>
          
          {/* Personal rating overlay */}
          {personalRating > 0 && (
            <View style={[
              styles.ratingOverlay,
              { backgroundColor: colors.surface + 'E6' }
            ]}>
              <Text style={[
                styles.ratingText,
                { color: colors.onSurface }
              ]}>
                {personalRating}/10
              </Text>
            </View>
          )}
          
          {/* TMDB rating overlay */}
          {item.vote_average && item.vote_average > 0 && (
            <View style={[
              styles.tmdbRatingOverlay,
              { backgroundColor: colors.surface + 'E6' }
            ]}>
              <MaterialIcons name="star" size={12} color="#FFD700" />
              <Text style={[
                styles.tmdbRatingText,
                { color: colors.onSurface }
              ]}>
                {item.vote_average.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
        
        <Card.Content style={styles.gridInfo}>
          <Text variant="titleSmall" numberOfLines={2} style={styles.gridTitle}>
            {item.title}
          </Text>
          
          <Text variant="bodySmall" style={[
            styles.gridYear,
            { color: colors.onSurfaceVariant }
          ]}>
            {releaseYear} • {WatchlistItemUtils.getShortMediaTypeText(item)}
          </Text>
          
          {addedDate && (
            <Text variant="bodySmall" style={[
              styles.gridAddedDate,
              { color: colors.onSurfaceVariant }
            ]}>
              Added {addedDate}
            </Text>
          )}
          
          <View style={styles.statusRow}>
            <WatchlistItemStatus item={item} size="small" showText={false} />
          </View>
        </Card.Content>
        
        {showActions && (
          <WatchlistItemActions
            item={item}
            onToggleWatched={onToggleWatched}
            onRemove={onRemove}
            onAdd={onAdd}
            size="small"
            layout="horizontal"
          />
        )}
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  tmdbRatingOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  tmdbRatingText: {
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
    marginBottom: 2,
  },
  gridAddedDate: {
    fontSize: 10,
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
});