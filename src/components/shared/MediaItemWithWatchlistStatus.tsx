import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';
import { useEnhancedWatchlistStatus } from '../../hooks/useWatchlistStatus';
import { getOptimizedImageUrl } from '../../lib/tmdb/sdk-via-pb';
import { AddToWatchlistButton } from '../watchlist/AddToWatchlistButton';

interface MediaItemWithWatchlistStatusProps {
  item: any; // TMDB movie/TV data
  mediaType: 'movie' | 'tv';
  showAddButton?: boolean;
  onPress?: () => void;
}

export function MediaItemWithWatchlistStatus({
  item,
  mediaType,
  showAddButton = true,
  onPress
}: MediaItemWithWatchlistStatusProps) {
  const router = useRouter();
  
  const {
    isInWatchlist,
    statusColor,
    statusIcon,
    statusText,
    formattedAddedDate,
    personalRatingStars,
    hasPersonalRating,
    isLoading
  } = useEnhancedWatchlistStatus(item.id, mediaType);
  
  // Get poster image URL
  const posterUrl = getOptimizedImageUrl(item.poster_path, 'poster', 'medium');
  
  // Format release date
  const releaseDate = mediaType === 'movie' ? item.release_date : item.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;
  
  // Get title
  const title = mediaType === 'movie' ? item.title : item.name;
  
  // Handle press
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      const route = mediaType === 'movie' ? '/movie' : '/show';
      router.push(`${route}/${item.id}`);
    }
  };
  
  // Render rating stars
  const renderRatingStars = () => {
    if (!hasPersonalRating) return null;
    
    return (
      <View style={styles.personalRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialIcons
            key={star}
            name={star <= personalRatingStars ? 'star' : 'star-border'}
            size={12}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };
  
  return (
    <Card style={styles.card} mode="outlined">
      <Pressable onPress={handlePress} style={styles.pressable}>
        <View style={styles.posterContainer}>
          <Image
            source={{ uri: posterUrl || undefined }}
            style={styles.poster}
            contentFit="cover"
            placeholder={require("@/assets/images/poster-placeholder.jpeg")}
          />

          {/* Watchlist Status Indicator */}
          {isInWatchlist && (
            <View style={[styles.statusIndicator, { backgroundColor: statusColor }]}>
              <MaterialIcons name={statusIcon} size={16} color="white" />
            </View>
          )}

          {/* TMDB Rating */}
          <View style={styles.tmdbRating}>
            <MaterialIcons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{item.vote_average?.toFixed(1) || "N/A"}</Text>
          </View>

          {/* Personal Rating Overlay */}
          {hasPersonalRating && (
            <View style={styles.personalRatingOverlay}>{renderRatingStars()}</View>
          )}
        </View>

        <Card.Content style={styles.content}>
          <Text variant="titleSmall" numberOfLines={2} style={styles.title}>
            {title}
          </Text>

          <Text variant="bodySmall" style={styles.year}>
            {releaseYear} • {mediaType === "movie" ? "Movie" : "TV Show"}
          </Text>

          {/* Watchlist Status Chip */}
          {isInWatchlist && (
            <Chip
              icon={statusIcon}
              style={[styles.statusChip, { backgroundColor: statusColor + "20" }]}
              textStyle={{ color: statusColor, fontSize: 10 }}
              compact>
              {statusText}
            </Chip>
          )}

          {/* Added Date */}
          {isInWatchlist && formattedAddedDate && (
            <Text variant="bodySmall" style={styles.addedDate}>
              {formattedAddedDate}
            </Text>
          )}

          {/* Add to Watchlist Button */}
          {showAddButton && (
            <View style={styles.buttonContainer}>
              <AddToWatchlistButton
                tmdbData={item}
                mediaType={mediaType}
                variant="chip"
                size="small"
                showStatus={false}
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
    flex: 1,
    margin: 4,
    maxWidth: '48%',
  },
  pressable: {
    flex: 1,
  },
  posterContainer: {
    position: 'relative',
    aspectRatio: 2/3,
  },
  poster: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  
  // Status indicator
  statusIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // TMDB rating
  tmdbRating: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  ratingText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Personal rating overlay
  personalRatingOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  personalRating: {
    flexDirection: 'row',
    gap: 1,
  },
  
  // Content
  content: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 16,
  },
  year: {
    color: '#666',
    marginBottom: 6,
  },
  
  // Status chip
  statusChip: {
    alignSelf: 'flex-start',
    height: 20,
    marginBottom: 4,
  },
  addedDate: {
    color: '#999',
    fontSize: 10,
    marginBottom: 6,
  },
  
  // Button
  buttonContainer: {
    marginTop: 'auto',
  },
});
