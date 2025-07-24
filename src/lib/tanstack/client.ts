import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { MutationCache, QueryClient } from "@tanstack/react-query";


export const queryKeyPrefixes = {
  viewer: "viewer",
  auth: "auth",
  trakt_tokens_state: "trakt_tokens_state",
  trakt: "trakt",
  watchlist: "watchlist",
  watchlistItem: "watchlistItem",
  tmdb: "tmdb",
  user: "user",
  testId:"testId"
} as const;

type QueryKey = [keyof typeof queryKeyPrefixes, ...unknown[]] | unknown[];

interface MyMeta extends Record<string, unknown> {
    invalidates?: [QueryKey[0], ...unknown[]][];
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
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});



