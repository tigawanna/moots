import { LoadingFallback } from "@/components/screens/state-screens/LoadingFallback";
import { viewerQueryOptions } from "@/lib/tanstack/auth/auth";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";

// this grouped routes  (contaner) layout exists because tanstcak query provider is defined in the root layout making it hard to useQuery to check for logged i user in that layout

export default function ContainerLayout() {
  const { data, isPending } = useQuery(viewerQueryOptions());

  if (isPending) {
    return <LoadingFallback />;
  }
  const isAuthenticated = !!data?.$id;
  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="signin" options={{ headerShown: true }} />
    </Stack>
  );
}
