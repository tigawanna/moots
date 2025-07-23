import { TraktSearch } from "@/components/search/TraktSearch";
import { SearchResults } from "@/components/trakt/TrakSearch";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import {
  TabsProvider,
  Tabs,
  TabScreen,
  useTabIndex,
  useTabNavigation,
} from "react-native-paper-tabs";

export default function Search() {
  const theme = useTheme();
  const searchQuery = "uwu"
  return (
    <TabsProvider
      defaultIndex={0}
      // onChangeIndex={handleChangeIndex} optional
    >
      <Tabs style={{ width: "99%" }} theme={theme}>
        <TabScreen label="Shows" icon="">
          <SearchResults query={searchQuery} />
        </TabScreen>
        <TabScreen label="Movies" icon="" disabled>
          <View style={{ backgroundColor: "black", flex: 1 }}>
            <Text>movies</Text>
          </View>
        </TabScreen>
      </Tabs>
    </TabsProvider>
  );
}
const styles = StyleSheet.create({});
