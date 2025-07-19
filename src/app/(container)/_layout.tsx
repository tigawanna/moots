import { useThemeSetup } from "@/hooks/theme/use-theme-setup";
import { useSettingsStore } from "@/store/settings-store";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { GlobalSnackbar } from "@/components/react-native-paper/snackbar/GlobalSnackbar";
import { useQuery } from "@tanstack/react-query";
import { viewerQueryOptions } from "@/lib/tanstack/operations/user";
import { LoadingFallback } from "@/components/screens/state-screens/LoadingFallback";

// this grouped routes  (contaner) layout exists because tanstcak query provider is defined in the root layout making it hard to useQuery to check for logged i user in that layout

export default function ContainerLayout() {
  const { dynamicColors } = useSettingsStore();
  const { colorScheme, paperTheme } = useThemeSetup(dynamicColors);
  const { data, isPending } = useQuery(viewerQueryOptions());
  
  if (isPending) {
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <PaperProvider theme={paperTheme}>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <LoadingFallback/>
        </PaperProvider>
      </ThemeProvider>
    );
  }
  
  const isAuthenticated = !!data?.id

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider theme={paperTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <Stack>
            <Stack.Protected guard={isAuthenticated}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack.Protected>
            {/* <Stack.Screen name="(auth)" options={{ headerShown: false }} /> */}
            <Stack.Protected guard={!isAuthenticated}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack.Protected>
            {/* <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} /> */}
          </Stack>
          <GlobalSnackbar />
        </GestureHandlerRootView>
      </PaperProvider>
    </ThemeProvider>
  );
}
