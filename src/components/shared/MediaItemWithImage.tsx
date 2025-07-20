import { getCachedTMDBImages } from '@/lib/images/tmdb-images';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Surface, Text, useTheme } from 'react-native-paper';

interface MediaItemWithImageProps {
  title: string;
  year: number;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  watchers?: number;
  playCount?: number;
  onPress?: () => void;
  showImages?: boolean; // Control whether to load images
}

export function MediaItemWithImage({
  title,
  year,
  tmdbId,
  mediaType,
  watchers,
  playCount,
  onPress,
  showImages = false,
}: MediaItemWithImageProps) {
  const { colors } = useTheme();
  const [images, setImages] = useState<{ poster: string | null; backdrop: string | null }>({
    poster: null,
    backdrop: null,
  });
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (showImages && tmdbId) {
      setImageLoading(true);
      getCachedTMDBImages(tmdbId, mediaType)
        .then(setImages)
        .finally(() => setImageLoading(false));
    }
  }, [showImages, tmdbId, mediaType]);

  return (
    <Card style={styles.card} onPress={onPress} mode="contained">
      {showImages && images.poster && (
        <Image
          source={{ uri: images.poster }}
          style={styles.posterImage}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk" // Enable caching
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }} // Generic blurhash
        />
      )}
      
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" numberOfLines={2}>
          {title}
        </Text>
        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
          {year}
        </Text>
        
        {(watchers || playCount) && (
          <View style={styles.statsContainer}>
            {watchers && (
              <Text variant="labelSmall" style={{ color: colors.primary }}>
                👁 {watchers} watching
              </Text>
            )}
            {playCount && (
              <Text variant="labelSmall" style={{ color: colors.secondary }}>
                ▶️ {playCount} plays
              </Text>
            )}
          </View>
        )}
        
        {showImages && imageLoading && (
          <Surface style={styles.imagePlaceholder}>
            <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
              Loading image...
            </Text>
          </Surface>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 16,
  },
  posterImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    minHeight: 80,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 4,
  },
  imagePlaceholder: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 8,
  },
});
