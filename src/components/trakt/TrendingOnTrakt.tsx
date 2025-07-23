import { TraktTrendingMovies } from "@/components/trakt/TraktTrendingMovies";
import { TrakttrendingShows } from "@/components/trakt/TrakttrendingShows";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { TabScreen, Tabs, TabsProvider } from "react-native-paper-tabs";

export function TrendingOnTrakt() {
  const { colors } = useTheme();
  return (
    <TabsProvider
      defaultIndex={0}
      // onChangeIndex={handleChangeIndex} optional
    >
      <Tabs
        tabHeaderStyle={{
          marginBottom: 12,
        }}
        theme={{
          colors: {
            primary: colors.primary,
            background: colors.surface,
          },
        }}>
        <TabScreen label="Movies" icon="movie">
          <TraktTrendingMovies />
        </TabScreen>

        <TabScreen label="TV Shows" icon="television">
          <TrakttrendingShows />
        </TabScreen>
      </Tabs>
    </TabsProvider>
  );
}
const styles = StyleSheet.create({});
