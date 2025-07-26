import { MaterialIcons } from '@expo/vector-icons';
// import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  Divider,
  Menu,
  Modal,
  Portal,
  Searchbar,
  Text
} from 'react-native-paper';
import { WATCHED_STATUSES } from '../../lib/tanstack/operations/watchlist-items/watchlist-types';
import { useWatchlistFilters } from '../../store/watchlist-store';

// TMDB genre mapping (simplified - you'd get this from TMDB API)
const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

interface WatchlistFiltersProps {
  onSearchFocus?: () => void;
  onSearchBlur?: () => void;
}

export function WatchlistFilters({ onSearchFocus, onSearchBlur }: WatchlistFiltersProps) {
  const {
    searchQuery,
    statusFilter,
    genreFilter,
    ratingFilter,
    sortBy,
    sortOrder,
    hasActiveFilters,
    setSearchQuery,
    setStatusFilter,
    setGenreFilter,
    setRatingFilter,
    setSortBy,
    setSortOrder,
    resetFilters,
  } = useWatchlistFilters();
  
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [tempRatingFilter, setTempRatingFilter] = useState(ratingFilter || { min: 0, max: 10 });
  
  // Get genre name by ID
  const getGenreName = (genreId: number) => {
    return GENRES.find(g => g.id === genreId)?.name || 'Unknown';
  };
  
  // Sort options
  const sortOptions = [
    { key: 'added_date', label: 'Date Added', icon: 'schedule' },
    { key: 'title', label: 'Title', icon: 'sort-by-alpha' },
    { key: 'release_date', label: 'Release Date', icon: 'calendar-today' },
    { key: 'vote_average', label: 'TMDB Rating', icon: 'star' },
    { key: 'personal_rating', label: 'My Rating', icon: 'favorite' },
  ];
  
  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      // Toggle order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy as any);
      setSortOrder('desc'); // Default to desc for new fields
    }
    setSortMenuVisible(false);
  };
  
  const handleApplyRatingFilter = () => {
    setRatingFilter(
      tempRatingFilter.min === 0 && tempRatingFilter.max === 10 
        ? null 
        : tempRatingFilter
    );
    setFilterModalVisible(false);
  };
  
  const handleResetRatingFilter = () => {
    setTempRatingFilter({ min: 0, max: 10 });
    setRatingFilter(null);
  };
  
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search your watchlist..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={onSearchFocus}
        onBlur={onSearchBlur}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
        icon="magnify"
        clearIcon="close"
      />
      
      {/* Filter Chips Row */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersRow}
        contentContainerStyle={styles.filtersContent}
      >
        {/* Sort Menu */}
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <Chip
              icon={() => (
                <View style={styles.sortChipContent}>
                  <MaterialIcons name="sort" size={16} color="#666" />
                  {sortOrder === 'desc' && (
                    <MaterialIcons name="arrow-downward" size={12} color="#666" />
                  )}
                  {sortOrder === 'asc' && (
                    <MaterialIcons name="arrow-upward" size={12} color="#666" />
                  )}
                </View>
              )}
              onPress={() => setSortMenuVisible(true)}
              style={styles.filterChip}
            >
              {sortOptions.find(opt => opt.key === sortBy)?.label || 'Sort'}
            </Chip>
          }
        >
          {sortOptions.map((option) => (
            <Menu.Item
              key={option.key}
              onPress={() => handleSortChange(option.key)}
              title={option.label}
              leadingIcon={option.icon}
              trailingIcon={
                sortBy === option.key 
                  ? (sortOrder === 'desc' ? 'arrow-downward' : 'arrow-upward')
                  : undefined
              }
            />
          ))}
        </Menu>
        
        {/* Status Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', ...WATCHED_STATUSES].map((status) => (
            <Chip
              key={status}
              selected={statusFilter === status}
              onPress={() => setStatusFilter(status as any)}
              style={[
                styles.filterChip,
                statusFilter === status && styles.selectedChip
              ]}
              textStyle={statusFilter === status ? styles.selectedChipText : undefined}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Chip>
          ))}
        </ScrollView>
        
        {/* Genre Filter */}
        {genreFilter && (
          <Chip
            selected
            onPress={() => setGenreFilter(null)}
            onClose={() => setGenreFilter(null)}
            style={[styles.filterChip, styles.selectedChip]}
            textStyle={styles.selectedChipText}
          >
            {getGenreName(genreFilter)}
          </Chip>
        )}
        
        {/* Rating Filter */}
        {ratingFilter && (
          <Chip
            selected
            onPress={() => setFilterModalVisible(true)}
            onClose={() => setRatingFilter(null)}
            style={[styles.filterChip, styles.selectedChip]}
            textStyle={styles.selectedChipText}
          >
            Rating {ratingFilter.min}-{ratingFilter.max}
          </Chip>
        )}
        
        {/* More Filters Button */}
        <Chip
          icon="tune"
          onPress={() => setFilterModalVisible(true)}
          style={styles.filterChip}
        >
          Filters
        </Chip>
        
        {/* Clear Filters */}
        {hasActiveFilters && (
          <Chip
            icon="close"
            onPress={resetFilters}
            style={[styles.filterChip, styles.clearChip]}
            textStyle={styles.clearChipText}
          >
            Clear
          </Chip>
        )}
      </ScrollView>
      
      {/* Advanced Filters Modal */}
      <Portal>
        <Modal
          visible={filterModalVisible}
          onDismiss={() => setFilterModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Card>
            <Card.Title title="Filter Options" />
            <Card.Content>
              {/* Genre Selection */}
              <Text variant="titleSmall" style={styles.sectionTitle}>
                Genre
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.genreScroll}
              >
                <Chip
                  selected={!genreFilter}
                  onPress={() => setGenreFilter(null)}
                  style={styles.genreChip}
                >
                  All Genres
                </Chip>
                {GENRES.map((genre) => (
                  <Chip
                    key={genre.id}
                    selected={genreFilter === genre.id}
                    onPress={() => setGenreFilter(genre.id)}
                    style={styles.genreChip}
                  >
                    {genre.name}
                  </Chip>
                ))}
              </ScrollView>
              
              <Divider style={styles.divider} />
              
              {/* Rating Range */}
              <Text variant="titleSmall" style={styles.sectionTitle}>
                TMDB Rating Range
              </Text>
              <View style={styles.ratingContainer}>
                <Text variant="bodyMedium">
                  {tempRatingFilter.min} - {tempRatingFilter.max}
                </Text>
                <Text variant="bodySmall" style={styles.sliderPlaceholder}>
                  Rating slider will be implemented when @react-native-community/slider is installed
                </Text>
              </View>
            </Card.Content>
            
            <Card.Actions>
              <Button onPress={handleResetRatingFilter}>Reset</Button>
              <Button onPress={() => setFilterModalVisible(false)}>Cancel</Button>
              <Button mode="contained" onPress={handleApplyRatingFilter}>
                Apply
              </Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingBottom: 8,
  },
  searchbar: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  searchInput: {
    fontSize: 16,
  },
  filtersRow: {
    maxHeight: 50,
  },
  filtersContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: '#2196F3',
  },
  selectedChipText: {
    color: 'white',
  },
  clearChip: {
    backgroundColor: '#F44336',
  },
  clearChipText: {
    color: 'white',
  },
  sortChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  
  // Modal styles
  modalContent: {
    margin: 20,
  },
  sectionTitle: {
    marginBottom: 8,
    marginTop: 8,
  },
  genreScroll: {
    maxHeight: 50,
  },
  genreChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  ratingContainer: {
    paddingVertical: 8,
  },
  sliderPlaceholder: {
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
});
