import { MutationCache, QueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";


export const queryKeyPrefixes = {
  viewer: "viewer",
  auth: "auth",
  trakt_tokens_state: "trakt_tokens_state",
  trakt: "trakt",
  watchlist: "watchlist",
  user: "user",
} as const;

type QueryKey = [keyof typeof queryKeyPrefixes, ...readonly unknown[]];

interface MyMeta extends Record<string, unknown> {
    invalidates?: [QueryKey[0], ...readonly unknown[]][];
    [key: string]: unknown;
}

declare module "@tanstack/react-query" {
  interface Register {
    queryKey: QueryKey;
    mutationKey: QueryKey;
    queryMeta: MyMeta;
    mutationMeta: MyMeta;
  }
}

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: async (_, __, ___, mutation) => {
      if (Array.isArray(mutation.meta?.invalidates)) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        mutation.meta?.invalidates.forEach((queryKey) => {
          return queryClient.invalidateQueries({
            queryKey,
          });
        });
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});



