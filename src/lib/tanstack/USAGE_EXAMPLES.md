# Movie Social App - Usage Examples

## Basic Hook Usage Examples

### 1. Display User's Watchlists
```typescript
import { useUserWatchlists, useAuth } from '@/lib/hooks';

export function UserWatchlistsScreen() {
  const { user } = useAuth();
  const { data: watchlists, isLoading, error } = useUserWatchlists(user?.id ?? '', {
    includePrivate: true
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <FlatList
      data={watchlists?.items}
      renderItem={({ item }) => <WatchlistCard watchlist={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
```

### 2. Watchlist Detail with Items
```typescript
import { useWatchlist, useWatchlistItems } from '@/lib/tanstack/watchlist-hooks';

export function WatchlistDetailScreen({ watchlistId }: { watchlistId: string }) {
  const { data: watchlist, isLoading: watchlistLoading } = useWatchlist(watchlistId, {
    expandItems: true,
    expandLikes: true,
    expandComments: true
  });
  
  const { data: items, isLoading: itemsLoading } = useWatchlistItems(watchlistId, {
    sort: ['order', 'created']
  });

  if (watchlistLoading || itemsLoading) return <LoadingSpinner />;

  return (
    <ScrollView>
      <WatchlistHeader watchlist={watchlist} />
      <WatchlistItems items={items} />
      <WatchlistComments watchlistId={watchlistId} />
    </ScrollView>
  );
}
```

### 3. Public Discovery Feed
```typescript
import { usePublicWatchlists } from '@/lib/tanstack/watchlist-hooks';

export function DiscoveryScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  
  const { data: watchlists, isLoading, fetchNextPage, hasNextPage } = usePublicWatchlists({
    category: selectedCategory,
    sort: ['-created']
  });

  return (
    <View>
      <CategoryFilter 
        selected={selectedCategory} 
        onSelect={setSelectedCategory} 
      />
      <FlatList
        data={watchlists?.items}
        renderItem={({ item }) => <PublicWatchlistCard watchlist={item} />}
        onEndReached={() => hasNextPage && fetchNextPage()}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
```

### 4. Like/Unlike Functionality
```typescript
import { useIsWatchlistLiked, useLikeWatchlist, useUnlikeWatchlist } from '@/lib/tanstack/watchlist-hooks';

export function LikeButton({ watchlistId, userId }: { watchlistId: string; userId: string }) {
  const { data: isLiked, isLoading } = useIsWatchlistLiked(watchlistId, userId);
  const likeMutation = useLikeWatchlist();
  const unlikeMutation = useUnlikeWatchlist();

  const handleToggleLike = () => {
    if (isLiked) {
      unlikeMutation.mutate({ watchlistId, userId });
    } else {
      likeMutation.mutate({ watchlistId, userId });
    }
  };

  if (isLoading) return <ActivityIndicator />;

  return (
    <TouchableOpacity 
      onPress={handleToggleLike}
      disabled={likeMutation.isPending || unlikeMutation.isPending}
    >
      <HeartIcon filled={isLiked} />
    </TouchableOpacity>
  );
}
```

### 5. Add Item to Watchlist
```typescript
import { useAddWatchlistItem } from '@/lib/tanstack/watchlist-hooks';

export function AddToWatchlistModal({ 
  movie, 
  watchlistId, 
  onClose 
}: { 
  movie: Movie; 
  watchlistId: string; 
  onClose: () => void; 
}) {
  const addItemMutation = useAddWatchlistItem();

  const handleAdd = () => {
    addItemMutation.mutate({
      watchlist: watchlistId,
      mediaType: 'movie',
      traktId: movie.ids.trakt,
      tmdbId: movie.ids.tmdb,
      imdbId: movie.ids.imdb,
      title: movie.title,
      year: movie.year,
      status: 'plan_to_watch',
    }, {
      onSuccess: () => {
        showSnackbar('Added to watchlist!');
        onClose();
      },
      onError: (error) => {
        showSnackbar('Failed to add to watchlist');
      }
    });
  };

  return (
    <Modal visible>
      <View>
        <Text>Add "{movie.title}" to watchlist?</Text>
        <Button 
          onPress={handleAdd} 
          loading={addItemMutation.isPending}
        >
          Add to Watchlist
        </Button>
      </View>
    </Modal>
  );
}
```

### 6. Create New Watchlist
```typescript
import { useCreateWatchlist } from '@/lib/tanstack/watchlist-hooks';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createWatchlistSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  category: z.enum(['movies', 'tv_shows', 'mixed']).optional(),
});

export function CreateWatchlistScreen() {
  const { user } = useAuth();
  const createMutation = useCreateWatchlist();
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createWatchlistSchema),
    defaultValues: {
      title: '',
      description: '',
      isPublic: false,
    }
  });

  const onSubmit = (data: z.infer<typeof createWatchlistSchema>) => {
    createMutation.mutate({
      ...data,
      owner: user!.id,
    }, {
      onSuccess: (newWatchlist) => {
        router.push(\`/watchlists/\${newWatchlist.id}\`);
      }
    });
  };

  return (
    <ScrollView>
      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <TextInput
            label="Watchlist Title"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.title?.message}
          />
        )}
      />
      
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <TextInput
            label="Description"
            value={field.value}
            onChangeText={field.onChange}
            multiline
          />
        )}
      />

      <Button 
        onPress={handleSubmit(onSubmit)}
        loading={createMutation.isPending}
      >
        Create Watchlist
      </Button>
    </ScrollView>
  );
}
```

### 7. Search with Debouncing
```typescript
import { useSearchWatchlists } from '@/lib/tanstack/watchlist-hooks';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';

export function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 300);
  
  const { data: searchResults, isLoading } = useSearchWatchlists(debouncedQuery, {
    publicOnly: true
  });

  return (
    <View>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search watchlists..."
      />
      
      {isLoading && <LoadingSpinner />}
      
      <FlatList
        data={searchResults?.items}
        renderItem={({ item }) => <WatchlistSearchResult watchlist={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          searchQuery.length > 2 ? <EmptySearchResults /> : null
        }
      />
    </View>
  );
}
```

### 8. Follow/Unfollow Users
```typescript
import { useIsFollowing, useFollowUser, useUnfollowUser } from '@/lib/tanstack/watchlist-hooks';

export function FollowButton({ 
  targetUserId, 
  currentUserId 
}: { 
  targetUserId: string; 
  currentUserId: string; 
}) {
  const { data: isFollowing, isLoading } = useIsFollowing(currentUserId, targetUserId);
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const handleToggleFollow = () => {
    if (isFollowing) {
      unfollowMutation.mutate({ 
        followerId: currentUserId, 
        followingId: targetUserId 
      });
    } else {
      followMutation.mutate({ 
        followerId: currentUserId, 
        followingId: targetUserId 
      });
    }
  };

  if (isLoading) return <ActivityIndicator />;

  return (
    <Button
      onPress={handleToggleFollow}
      variant={isFollowing ? 'outline' : 'solid'}
      loading={followMutation.isPending || unfollowMutation.isPending}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
}
```

## Key Features

### Type Safety
- All operations are fully typed with PocketBase schema
- Automatic type inference for expanded relations
- Compile-time error checking for invalid queries

### Optimistic Updates
- Immediate UI feedback with proper rollback on errors
- Smart cache invalidation
- Optimistic mutations for better UX

### Efficient Data Loading
- Selective field loading to minimize bandwidth
- Automatic relation expansion when needed
- Proper pagination support

### Real-time Features
- Built-in support for PocketBase real-time subscriptions
- Automatic cache updates when data changes
- Optimistic updates with rollback capability

This architecture provides a solid foundation for building a responsive, type-safe movie social application with excellent developer experience and user performance.
