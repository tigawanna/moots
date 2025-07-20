import { GlobalSnackbar } from "@/components/react-native-paper/snackbar/GlobalSnackbar";
import { LoadingFallback } from "@/components/screens/state-screens/LoadingFallback";
import { useThemeSetup } from "@/hooks/theme/use-theme-setup";
import { viewerQueryOptions } from "@/lib/tanstack/operations/user";
import { useAuthState } from "@/store/auth-utils";
import { useSettingsStore } from "@/store/settings-store";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

// this grouped routes  (contaner) layout exists because tanstcak query provider is defined in the root layout making it hard to useQuery to check for logged i user in that layout

export default function ContainerLayout() {
  const { dynamicColors } = useSettingsStore();
  const { colorScheme, paperTheme } = useThemeSetup(dynamicColors);
  const { data, isPending } = useQuery(viewerQueryOptions());

  const { isValidatingTokens, isTokensPresent } = useAuthState();
  const { isPending: isVerifyingTokens, data: isVerifyingTokensData } = useQuery({
    queryKey: ["trakt_tokens_state"],
    queryFn: () => isTokensPresent(),
  });

  if (isPending || isValidatingTokens || isVerifyingTokens) {
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <PaperProvider theme={paperTheme}>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <LoadingFallback />
        </PaperProvider>
      </ThemeProvider>
    );
  }

  // User is authenticated if they have either PocketBase auth or Trakt auth
  const isAuthenticated = !!data?.id || !!isVerifyingTokensData;

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
