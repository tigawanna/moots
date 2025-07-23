import { TraktPopularMovies, TraktPopularShows } from "@/components/trakt/TraktPopularContent";
import { TraktSearchResults } from "@/components/trakt/TraktSearchResults";
import { TraktTrendingMovies } from "@/components/trakt/TraktTrendingMovies";
import { TrakttrendingShows } from "@/components/trakt/TrakttrendingShows";
import { useTraktPopularDramaShows, useTraktPopularHorrorMovies, useTraktSearch } from "@/lib/trakt/trakt-hooks";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, Searchbar, Surface, useTheme } from "react-native-paper";
import { TabScreen, Tabs, TabsProvider } from "react-native-paper-tabs";

// On this screen we'll render trending movies and shows from Trakt API
// It has nested material tabs that show trending movies and shows
// Images will be loaded on-demand from TMDB using expo-image caching

export default function ExploreScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <TabsProvider
      defaultIndex={0}
      // onChangeIndex={handleChangeIndex} optional
    >
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search movies and shows..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
        </View>

        <Tabs
          style={styles.tabs}
          theme={{
            colors: {
              primary: colors.primary,
              background: colors.surface,
            },
          }}>
          <TabScreen label="Trending" icon="trending-up">
            <TrendingContent />
          </TabScreen>

          <TabScreen label="Movies" icon="movie">
            <TraktTrendingMovies />
          </TabScreen>

          <TabScreen label="TV Shows" icon="television">
            <TrakttrendingShows />
          </TabScreen>

          <TabScreen label="Popular" icon="star">
            <PopularContent />
          </TabScreen>

          {/* {searchQuery.length >= 2 && (
            <TabScreen label="Search" icon="magnify">
              <SearchResults query={searchQuery} />
            </TabScreen>
          )} */}
        </Tabs>
      </View>
    </TabsProvider>
  );
}

function TrendingContent() {
  return (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <TraktTrendingMovies />
      </View>
    </ScrollView>
  );
}

function PopularContent() {
  const { data: horrorMovies, isLoading: loadingMovies, error: movieError } = useTraktPopularHorrorMovies({ limit: 10 });
  const { data: dramaShows, isLoading: loadingShows, error: showError } = useTraktPopularDramaShows({ limit: 10 });

  return (
    // <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <View style={styles.section}>
          <TraktPopularMovies 
            movies={horrorMovies} 
            isLoading={loadingMovies} 
            error={movieError}
            title="Popular Horror Movies"
          />
        </View>
        
        <View style={styles.section}>
          <TraktPopularShows 
            shows={dramaShows} 
            isLoading={loadingShows} 
            error={showError}
            title="Popular Drama Shows"
          />
        </View>
      </View>
    // </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    elevation: 2,
  },
  tabs: {
    flex: 1,
    marginTop: 8,
  },
  tabContent: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  genreChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
});
