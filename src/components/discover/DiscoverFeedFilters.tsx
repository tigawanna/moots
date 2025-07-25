import {
    COMMON_GENRES,
    getAvailableSortOptions,
    getCurrentYear,
    useDiscoverFiltersStore,
} from '@/lib/tanstack/operations/discover/discover-fliters-store';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
    Button,
    Chip,
    IconButton,
    Modal,
    Portal,
    SegmentedButtons,
    Surface,
    Text,
    TextInput,
    useTheme,
} from 'react-native-paper';


interface DiscoverFeedFiltersProps {
  visible: boolean;
  onDismiss: () => void;
}

export function DiscoverFeedFilters({ visible, onDismiss }: DiscoverFeedFiltersProps) {
  const theme = useTheme();

  
  const {
    filters,
    setFilters,
    resetFilters,
    selectedGenres,
    toggleGenre,
    clearGenres,
  } = useDiscoverFiltersStore();

  const [localYear, setLocalYear] = useState(filters.year || '');
  const [localMinRating, setLocalMinRating] = useState(filters['vote_average.gte'] || 0);
  const [localMinVotes, setLocalMinVotes] = useState(filters['vote_count.gte'] || 0);
  const [localMinRuntime, setLocalMinRuntime] = useState(filters['with_runtime.gte'] || 0);
  const [localMaxRuntime, setLocalMaxRuntime] = useState(filters['with_runtime.lte'] || 300);

  const availableSortOptions = getAvailableSortOptions(filters.mediaType);
  const currentYear = getCurrentYear();

  // Update local state when filters change
  useEffect(() => {
    setLocalYear(filters.year || '');
    setLocalMinRating(filters['vote_average.gte'] || 0);
    setLocalMinVotes(filters['vote_count.gte'] || 0);
    setLocalMinRuntime(filters['with_runtime.gte'] || 0);
    setLocalMaxRuntime(filters['with_runtime.lte'] || 300);
  }, [filters]);

  const handleApplyFilters = () => {
    setFilters({
      year: localYear || undefined,
      'vote_average.gte': localMinRating > 0 ? localMinRating : undefined,
      'vote_count.gte': localMinVotes > 0 ? localMinVotes : undefined,
      'with_runtime.gte': localMinRuntime > 0 ? localMinRuntime : undefined,
      'with_runtime.lte': localMaxRuntime < 300 ? localMaxRuntime : undefined,
    });
    onDismiss();
  };

  const handleReset = () => {
    resetFilters();
    setLocalYear('');
    setLocalMinRating(0);
    setLocalMinVotes(0);
    setLocalMinRuntime(0);
    setLocalMaxRuntime(300);
  };

  const styles = StyleSheet.create({
    modal: {
      backgroundColor: theme.colors.surface,
      margin: 20,
      borderRadius: 12,
      maxHeight: '90%',
    },
    surface: {
      flex: 1,
      borderRadius: 12,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    content: {
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      marginBottom: 12,
    },
    horizontalScroll: {
      flexDirection: 'row',
      gap: 8,
    },
    genreHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    genreContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    sliderContainer: {
      marginBottom: 16,
    },
    sliderLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    runtimeSection: {
      gap: 16,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outline,
      gap: 12,
    },
    footerButton: {
      flex: 1,
    },
  });

  // Simple slider component replacement
  const SimpleSlider = ({ 
    value, 
    onValueChange, 
    minimumValue, 
    maximumValue, 
    step = 1,
    label 
  }: {
    value: number;
    onValueChange: (value: number) => void;
    minimumValue: number;
    maximumValue: number;
    step?: number;
    label: string;
  }) => {
    const handleIncrease = () => {
      const newValue = Math.min(value + step, maximumValue);
      onValueChange(newValue);
    };

    const handleDecrease = () => {
      const newValue = Math.max(value - step, minimumValue);
      onValueChange(newValue);
    };

    return (
      <View style={styles.sliderContainer}>
        <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
          {label}: {value}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Button mode="outlined" onPress={handleDecrease} compact>
            -
          </Button>
          <Text variant="bodyLarge" style={{ minWidth: 60, textAlign: 'center' }}>
            {value}
          </Text>
          <Button mode="outlined" onPress={handleIncrease} compact>
            +
          </Button>
        </View>
        <View style={styles.sliderLabels}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {minimumValue}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {maximumValue}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <Surface style={styles.surface}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="headlineSmall">Filters</Text>
            <IconButton icon="close" onPress={onDismiss} />
          </View>

          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              {/* Media Type Selection */}
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Content Type
                </Text>
                <SegmentedButtons
                  value={filters.mediaType}
                  onValueChange={(value) => setFilters({ mediaType: value as 'movie' | 'tv' | 'both' })}
                  buttons={[
                    { value: 'both', label: 'Both' },
                    { value: 'movie', label: 'Movies' },
                    { value: 'tv', label: 'TV Shows' },
                  ]}
                />
              </View>

              {/* Sort Options */}
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Sort By
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.horizontalScroll}>
                    {availableSortOptions.map((option) => (
                      <Chip
                        key={option.value}
                        selected={filters.sort_by === option.value}
                        onPress={() => setFilters({ sort_by: option.value })}
                        mode={filters.sort_by === option.value ? 'flat' : 'outlined'}
                      >
                        {option.label}
                      </Chip>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Genres */}
              <View style={styles.section}>
                <View style={styles.genreHeader}>
                  <Text variant="titleMedium">Genres</Text>
                  {selectedGenres.length > 0 && (
                    <Button mode="text" onPress={clearGenres} compact>
                      Clear All
                    </Button>
                  )}
                </View>
                <View style={styles.genreContainer}>
                  {COMMON_GENRES.map((genre) => (
                    <Chip
                      key={genre.id}
                      selected={selectedGenres.includes(genre.id)}
                      onPress={() => toggleGenre(genre.id)}
                      mode={selectedGenres.includes(genre.id) ? 'flat' : 'outlined'}
                    >
                      {genre.name}
                    </Chip>
                  ))}
                </View>
              </View>

              {/* Year Filter */}
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Release Year
                </Text>
                <TextInput
                  mode="outlined"
                  label="Year (e.g., 2023)"
                  value={localYear}
                  onChangeText={setLocalYear}
                  keyboardType="numeric"
                  placeholder={`1900 - ${currentYear}`}
                  right={
                    localYear ? (
                      <TextInput.Icon icon="close" onPress={() => setLocalYear('')} />
                    ) : undefined
                  }
                />
              </View>

              {/* Rating Filter */}
              <View style={styles.section}>
                <SimpleSlider
                  label="Minimum Rating"
                  value={localMinRating}
                  onValueChange={setLocalMinRating}
                  minimumValue={0}
                  maximumValue={10}
                  step={0.5}
                />
              </View>

              {/* Vote Count Filter */}
              <View style={styles.section}>
                <SimpleSlider
                  label="Minimum Votes"
                  value={localMinVotes}
                  onValueChange={setLocalMinVotes}
                  minimumValue={0}
                  maximumValue={5000}
                  step={100}
                />
              </View>

              {/* Runtime Filter */}
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Runtime: {localMinRuntime}min - {localMaxRuntime}min
                </Text>
                <View style={styles.runtimeSection}>
                  <SimpleSlider
                    label="Minimum Runtime (minutes)"
                    value={localMinRuntime}
                    onValueChange={setLocalMinRuntime}
                    minimumValue={0}
                    maximumValue={300}
                    step={15}
                  />
                  <SimpleSlider
                    label="Maximum Runtime (minutes)"
                    value={localMaxRuntime}
                    onValueChange={setLocalMaxRuntime}
                    minimumValue={60}
                    maximumValue={300}
                    step={15}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <Button mode="outlined" onPress={handleReset} style={styles.footerButton}>
              Reset
            </Button>
            <Button mode="contained" onPress={handleApplyFilters} style={styles.footerButton}>
              Apply Filters
            </Button>
          </View>
        </Surface>
      </Modal>
    </Portal>
  );
}

// Filter trigger button component
interface FilterButtonProps {
  onPress: () => void;
  hasActiveFilters?: boolean;
}

export function FilterButton({ onPress, hasActiveFilters = false }: FilterButtonProps) {
  const theme = useTheme();
  
  return (
    <IconButton
      icon="filter-variant"
      mode={hasActiveFilters ? 'contained' : 'outlined'}
      onPress={onPress}
      iconColor={hasActiveFilters ? theme.colors.onPrimary : theme.colors.primary}
      containerColor={hasActiveFilters ? theme.colors.primary : 'transparent'}
    />
  );
}

// Hook to check if filters are active
export function useHasActiveFilters() {
  const { filters, selectedGenres } = useDiscoverFiltersStore();
  
  return (
    filters.mediaType !== 'both' ||
    filters.sort_by !== 'popularity.desc' ||
    selectedGenres.length > 0 ||
    !!filters.year ||
    !!filters['vote_average.gte'] ||
    !!filters['vote_count.gte'] ||
    !!filters['with_runtime.gte'] ||
    !!filters['with_runtime.lte']
  );
}
