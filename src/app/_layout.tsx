import "../polyfill.ts";

import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";

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
        <Slot />
    </LivestoreProvider>
  );
}
