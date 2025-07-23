import "../polyfill.ts";

import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import "react-native-reanimated";
import { useAppState, useOnlineManager } from "@/lib/tanstack/react-native-setup-hooks";
import { focusManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { AppStateStatus, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { asyncStoragePersister, queryClient } from "@/lib/tanstack/client.ts";

import { useThemeSetup } from "@/hooks/theme/use-theme-setup.tsx";
import { useSettingsStore } from "@/store/settings-store.ts";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalSnackbar } from "@/components/react-native-paper/snackbar/GlobalSnackbar.tsx";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useExtrenalDevTools } from "@/lib/tanstack/external-dev-tools.ts";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

// Define your copy function based on your platform

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
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider theme={paperTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}>
          {/* <QueryClientProvider client={queryClient}> */}
            <Slot />
          {/* </QueryClientProvider> */}
          </PersistQueryClientProvider>
          <GlobalSnackbar />
        </GestureHandlerRootView>
      </PaperProvider>
    </ThemeProvider>
  );
}
