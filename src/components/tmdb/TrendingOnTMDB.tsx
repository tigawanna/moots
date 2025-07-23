import { TMDBTrendingMovies } from "@/components/tmdb/TMDBTrendingMovies";
import { TMDBTrendingTV } from "@/components/tmdb/TMDBTrendingTV";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { TabScreen, Tabs, TabsProvider } from "react-native-paper-tabs";

export function TrendingOnTMDB() {
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
          <TMDBTrendingMovies />
        </TabScreen>

        <TabScreen label="TV Shows" icon="television">
          <TMDBTrendingTV />
        </TabScreen>
      </Tabs>
    </TabsProvider>
  );
}

const styles = StyleSheet.create({});