import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { GlobalSnackbar } from "@/components/react-native-paper/snackbar/GlobalSnackbar";
import { useThemeSetup } from "@/hooks/theme/use-theme-setup";
import { queryClient } from "@/lib/tanstack/client";
import { useAppState, useOnlineManager } from "@/lib/tanstack/react-native-setup-hooks";
import { useSettingsStore } from "@/store/settings-store";
import { focusManager, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { AppStateStatus, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { LivestoreProvider } from "@/lib/livestore/LivestoreProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export default function RootLayout() {
  useOnlineManager();
  useAppState(onAppStateChange);

  const { dynamicColors } = useSettingsStore();
  const { colorScheme, paperTheme } = useThemeSetup(dynamicColors);
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <LivestoreProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider theme={paperTheme}>
              <ThemeProvider value={paperTheme as any}>
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { flex: 1, backgroundColor: "transparent" },
                  }}>
                  <Stack.Screen name="(container)" options={{ headerShown: false }} />
                </Stack>
                <GlobalSnackbar />
              </ThemeProvider>
            </PaperProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </QueryClientProvider>
    </LivestoreProvider>
  );
}
