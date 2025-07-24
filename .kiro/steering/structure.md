# Project Structure

## Root Directory Organization

```
├── src/                     # Main source code
├── assets/                  # Static assets (images, fonts, icons)
├── android/                 # Android-specific native code
├── docs/                    # Documentation files
├── scripts/                 # Build and utility scripts
└── .kiro/                   # Kiro IDE configuration
```

## Source Code Structure (`src/`)

### Application Layer (`src/app/`)
File-based routing with Expo Router:
```
src/app/
├── _layout.tsx              # Root layout with providers
├── +not-found.tsx           # 404 page
└── (container)/             # Main app container
    ├── _layout.tsx          # Container layout
    ├── (auth)/              # Authentication screens
    │   ├── signin.tsx
    │   └── signup.tsx
    ├── (tabs)/              # Tab navigation screens
    │   ├── index.tsx        # Home tab
    │   ├── explore.tsx      # Content discovery
    │   ├── community.tsx    # Social features
    │   ├── profile.tsx      # User profile
    │   └── settings.tsx     # App settings
    ├── [movie].tsx          # Dynamic movie detail page
    └── [show].tsx           # Dynamic show detail page
```

### Components (`src/components/`)
Organized by feature and reusability:
```
src/components/
├── default/                 # Expo default components
├── shared/                  # Reusable UI components
├── screens/                 # Screen-specific components
│   ├── auth/               # Authentication components
│   ├── home/               # Home screen components
│   ├── user/               # User management components
│   └── state-screens/      # Loading, error states
├── explore/                # Content discovery components
├── community/              # Social features components
├── watchlist/              # Watchlist management
├── tmdb/                   # TMDB API components
├── trakt/                  # Trakt API components
└── react-native-paper/     # Paper theme providers
```

### Library Layer (`src/lib/`)
External integrations and utilities:
```
src/lib/
├── pb/                     # PocketBase integration
│   ├── client.ts           # PB client setup
│   ├── types/              # Generated and custom types
│   ├── schemas/            # Zod validation schemas
│   ├── scripts/            # Type generation scripts
│   └── watchlist-api.ts    # Watchlist API functions
├── tanstack/               # TanStack Query setup
│   ├── client.ts           # Query client configuration
│   ├── operations/         # API operations
│   └── *-hooks.ts          # React Query hooks
├── tmdb/                   # TMDB API integration
├── trakt/                  # Trakt API integration
├── images/                 # Image utilities
└── env.ts                  # Environment configuration
```

### State Management (`src/store/`)
Zustand stores for global state:
```
src/store/
├── user-store.ts           # User authentication state
├── watchlist-store.ts      # Watchlist management
├── trakt-store.ts          # Trakt integration state
├── settings-store.ts       # App settings
└── auth-utils.ts           # Authentication utilities
```

### Hooks (`src/hooks/`)
Custom React hooks:
```
src/hooks/
├── theme/                  # Theme-related hooks
├── useColorScheme.ts       # Color scheme detection
├── useThemeColor.ts        # Theme color utilities
├── useTraktAPI.ts          # Trakt API hooks
└── useWatchlistStatus.ts   # Watchlist status management
```

## Naming Conventions

### Files & Directories
- **Components**: PascalCase (e.g., `MediaItemWithImage.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useTraktAPI.ts`)
- **Stores**: kebab-case with suffix (e.g., `user-store.ts`)
- **Types**: kebab-case with suffix (e.g., `pb-types.ts`)
- **API files**: kebab-case with suffix (e.g., `watchlist-api.ts`)

### Code Conventions
- **React Components**: PascalCase function declarations
- **Hooks**: camelCase starting with "use"
- **Constants**: SCREAMING_SNAKE_CASE
- **Interfaces/Types**: PascalCase
- **Variables**: camelCase

## Import Patterns

### Path Aliases
Use `@/` prefix for all internal imports:
```typescript
import { MediaItem } from '@/components/shared/MediaItem';
import { pb } from '@/lib/pb/client';
import { useUserStore } from '@/store/user-store';
```

### Import Organization
1. React and React Native imports
2. Third-party library imports
3. Internal imports (using @/ alias)
4. Relative imports (if any)

## Architecture Principles

### Component Organization
- **Feature-based**: Group related components by domain
- **Reusability**: Shared components in `shared/` directory
- **Screen-specific**: Components used by single screen in `screens/`

### Route Components (`src/app/`)
- **Keep route components minimal**: Maximum 25 lines of code
- **Extract logic**: Move complex logic to appropriate component folders
- **Single responsibility**: Route components should only handle routing and basic layout
- **Example structure**:
```typescript
// Good: Minimal route component
export default function ExploreScreen() {
  return <ExploreScreenContent />;
}

// Bad: Complex logic in route component
export default function ExploreScreen() {
  // 50+ lines of component logic...
}
```

### State Management
- **Local state**: React useState/useReducer for component state
- **Server state**: TanStack Query for API data
- **Global state**: Zustand stores for app-wide state
- **Persistent state**: AsyncStorage with Zustand persistence

### API Integration
- **Typed clients**: All API clients are fully typed
- **Hook-based**: Expose APIs through custom React hooks
- **Error handling**: Consistent error handling across all APIs
- **Caching**: TanStack Query for intelligent caching

### Performance Guidelines
- **List Components**: Never nest FlatList inside ScrollView
- **Large datasets**: Use FlatList with proper keyExtractor
- **Small content**: Use ScrollView for limited items
- **Grouped data**: Consider SectionList for categorized content