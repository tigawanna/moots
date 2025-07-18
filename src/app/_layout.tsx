import "../polyfill.ts";

import { useFonts } from "expo-font";
import { Slot } from "expo-router";

import "react-native-reanimated";

import { LivestoreProvider } from "@/lib/livestore/components/LivestoreProvider.tsx";
import { useAppState, useOnlineManager } from "@/lib/tanstack/react-native-setup-hooks";
import { focusManager, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { AppStateStatus, Platform } from "react-native";
import { queryClient } from "@/lib/tanstack/client.ts";

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
    <QueryClientProvider client={queryClient}>
      <LivestoreProvider>
        <Slot />
      </LivestoreProvider>
    </QueryClientProvider>
  );
}
