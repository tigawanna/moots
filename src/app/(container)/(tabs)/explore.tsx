import { TraktTrendingMovies } from "@/components/explore/trakt/TraktTrendingMovies";
import { TrakttrendingShows } from "@/components/explore/trakt/TrakttrendingShows";
import { StyleSheet } from "react-native";
import { Surface, useTheme } from "react-native-paper";
import { TabScreen, Tabs } from "react-native-paper-tabs";

// On this screen we'll render trending movies and shows from Trakt API
// It has nested material tabs that show trending movies and shows
// Images will be loaded on-demand from TMDB using expo-image caching

export default function ExploreScreen() {
  const { colors } = useTheme();

  return (
    <Surface style={styles.container}>
      <Tabs
        style={styles.tabs}
        theme={{
          colors: {
            primary: colors.primary,
            background: colors.surface,
          },
        }}
      >
        <TabScreen label="Movies" icon="movie">
          <TraktTrendingMovies />
        </TabScreen>
        
        <TabScreen label="TV Shows" icon="television">
          <TrakttrendingShows />
        </TabScreen>
      </Tabs>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flex: 1,
  },
});
