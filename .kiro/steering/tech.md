# Technology Stack

## Core Framework
- **React Native**: 0.79.5 with React 19.0.0
- **Expo**: ~53.0.17 with Expo Router for navigation
- **TypeScript**: ~5.8.3 with strict mode enabled
- **Metro**: Bundler with package exports enabled

## Key Libraries

### UI & Navigation
- **React Native Paper**: 5.14.5 (Material Design components)
- **Expo Router**: File-based routing with typed routes
- **React Navigation**: Bottom tabs and native navigation
- **React Native Reanimated**: 3.17.4 for animations
- **React Native Gesture Handler**: Touch interactions

### State Management & Data
- **Zustand**: 5.0.6 for global state management
- **TanStack Query**: 5.83.0 for server state and caching
- **PocketBase**: Backend with typed client (@tigawanna/typed-pocketbase)
- **Zod**: 4.0.5 for schema validation
- **React Hook Form**: 7.60.0 with Hookform Resolvers

### External APIs
- **TMDB**: Movie/TV metadata and images
- **Trakt**: Social movie tracking and recommendations
- **React Native SSE**: Server-sent events for real-time updates

### Storage & Persistence
- **AsyncStorage**: Local data persistence
- **Expo Secure Store**: Sensitive data storage
- **Expo SQLite**: Local database for offline support

## Build System & Development

### Common Commands
```bash
# Development
pnpm start                    # Start Expo dev server
pnpm android                  # Run on Android
pnpm ios                      # Run on iOS  
pnpm web                      # Run on web

# Building
pnpm prebuild:android         # Clean prebuild for Android
pnpm build:android           # Build Android app
pnpm build-apk              # Build APK with EAS

# Database & Types
pnpm pb-types               # Generate PocketBase types
pnpm pb-seed                # Seed database with test data
pnpm pb-collections         # Update collection structure

# Code Quality
pnpm lint                   # Run ESLint
```

### Configuration Files
- **babel.config.js**: Expo preset with import meta transform
- **metro.config.js**: Package exports enabled for better-auth integration
- **tsconfig.json**: Strict TypeScript with path aliases (@/*)
- **app.json**: Expo configuration with new architecture enabled

## Architecture Patterns

### Path Aliases
- `@/*` → `./src/*`
- `@/assets/*` → `./assets/*`

### React Compiler
- Enabled experimentally for performance optimization
- Uses React Compiler babel plugin

### New Architecture
- React Native's new architecture enabled
- Fabric renderer and TurboModules support

## Development Environment
- **Package Manager**: pnpm with workspace support
- **Node Version**: Compatible with Expo SDK 53
- **Platform Support**: iOS, Android, Web
- **Hot Reload**: Fast Refresh enabled

## Development Guidelines

### Package Management
- Use `pnpm install <package>` to add new dependencies
- Leverage pnpm workspace features for monorepo support

### UI & Theming
- Use React Native Paper components for consistent Material Design
- Always use `useTheme()` hook for accessing theme colors
- Avoid inline colors unless absolutely necessary - prefer theme-based colors
- Example: `const { colors } = useTheme(); backgroundColor: colors.surface`

### Icons & SVGs
- Use `react-native-svg` package for all SVG rendering
- Import SVG components and use them as React components
- Prefer SVG icons over raster images for scalability

### Forms & Validation
- Use React Hook Form with `useForm` and `Controller` components
- Define validation schemas with Zod: `z.object({...})`
- Integrate forms with validation using `zodResolver` from `@hookform/resolvers/zod`
- Example pattern:
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema)
});
```

### Data Fetching with TanStack Query

#### Query Options Pattern
Always create `queryOptions` first, then use them in hooks, components, preloading, and invalidation:

```typescript
import { queryOptions } from '@tanstack/react-query';

// 1. Define query options
function groupOptions(id: number) {
  return queryOptions({
    queryKey: ['groups', id],
    queryFn: () => fetchGroups(id),
    staleTime: 5 * 1000,
  });
}

// 2. Use in various contexts
useQuery(groupOptions(1));
useSuspenseQuery(groupOptions(5));
useQueries({ queries: [groupOptions(1), groupOptions(2)] });
queryClient.prefetchQuery(groupOptions(23));
queryClient.setQueryData(groupOptions(42).queryKey, newGroups);
```

#### Component-Level Overrides
Override options at component level with type safety:
```typescript
const query = useQuery({
  ...groupOptions(1),
  select: (data) => data.groupName, // Type inference preserved
});
```

#### Infinite Queries
Use `infiniteQueryOptions` helper for infinite queries following the same pattern.

#### TypeSafe QueryClient Setup
Our queryClient ensures consistent behavior and automatic type-safe query invalidation:

```typescript
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
  testId: "testId"
} as const;

// Type-safe query keys and automatic invalidation
type QueryKey = [keyof typeof queryKeyPrefixes, ...readonly unknown[]];

interface MyMeta extends Record<string, unknown> {
  invalidates?: [QueryKey[0], ...readonly unknown[]][];
}

declare module "@tanstack/react-query" {
  interface Register {
    queryKey: QueryKey;
    mutationKey: QueryKey;
    queryMeta: MyMeta;
    mutationMeta: MyMeta;
  }
}

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: async (_, __, ___, mutation) => {
      if (Array.isArray(mutation.meta?.invalidates)) {
        mutation.meta?.invalidates.forEach((queryKey) => {
          return queryClient.invalidateQueries({ queryKey });
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
```

#### Mutation Invalidation
Use mutation meta to automatically invalidate related queries:
```typescript
const mutation = useMutation({
  mutationFn: updateWatchlist,
  meta: {
    invalidates: [['watchlist'], ['user', userId]],
  },
});
```

### Performance & Layout
- **Never nest FlatList inside ScrollView** - causes performance issues
- Use FlatList for large datasets, ScrollView for small content
- Consider using SectionList for grouped data

### Navigation & Headers
- Tab screens have safe area padding when using `headerShown: true`
- Use `headerShown: false` when header is not relevant or when implementing custom search
- For screens with search + FlatList, prefer `headerShown: false` and implement search in screen
- Manual safe area handling pattern:
```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { top } = useSafeAreaInsets();
return (
  <View style={{ flex: 1, paddingTop: top }}>
    {/* Screen content */}
  </View>
);
```

### Asset Management
- Use `@/` alias for all assets: `require("@/assets/images/icon.png")`
- Configured in tsconfig.json with `@/assets/*` → `./assets/*` mapping
- Prefer `@/` alias over relative paths for consistency