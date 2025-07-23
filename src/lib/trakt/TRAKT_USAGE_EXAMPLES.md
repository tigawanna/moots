# Trakt API Integration Usage Examples

This document provides comprehensive examples of how to use the Trakt API integration in our movie social app.

## Available Features

### 1. **Trending Content**
- Get currently trending movies and TV shows
- Based on real-time user engagement

### 2. **Search Functionality**
- Search across movies, TV shows, and other content
- Flexible filtering by content type
- Relevance-based results

### 3. **Popular Content with Genre Filtering**
- Get popular content with extensive filtering options
- Filter by genres, years, ratings, networks, etc.
- Perfect for discovery and recommendation systems

### 4. **Latest/Recently Updated Content**
- Get recently updated/added content
- Useful for "What's New" sections

## Basic Usage Examples

### Trending Content

```typescript
import { 
  useTraktTrendingShows, 
  useTraktTrendingMovies 
} from '@/lib/trakt/trakt-hooks';

function TrendingSection() {
  const { data: trendingShows, isLoading: showsLoading } = useTraktTrendingShows();
  const { data: trendingMovies, isLoading: moviesLoading } = useTraktTrendingMovies();
  
  if (showsLoading || moviesLoading) return <Loading />;
  
  return (
    <View>
      <Text>Trending Shows</Text>
      {trendingShows?.map(item => (
        <Text key={item.show.ids.trakt}>{item.show.title} ({item.watchers} watchers)</Text>
      ))}
      
      <Text>Trending Movies</Text>
      {trendingMovies?.map(item => (
        <Text key={item.movie.ids.trakt}>{item.movie.title} ({item.watchers} watchers)</Text>
      ))}
    </View>
  );
}
```

### Search Functionality

```typescript
import { 
  useTraktSearch, 
  useTraktSearchMovies, 
  useTraktSearchShows 
} from '@/lib/trakt/trakt-hooks';

function SearchScreen() {
  const [query, setQuery] = useState('');
  
  // Search everything
  const { data: allResults } = useTraktSearch({
    query,
    limit: 20
  });
  
  // Search only movies
  const { data: movieResults } = useTraktSearchMovies(query, 10);
  
  // Search only shows
  const { data: showResults } = useTraktSearchShows(query, 10);
  
  return (
    <View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search movies and shows..."
      />
      
      {allResults?.map(result => (
        <View key={`${result.type}-${result.movie?.ids.trakt || result.show?.ids.trakt}`}>
          <Text>{result.movie?.title || result.show?.title}</Text>
          <Text>Type: {result.type}</Text>
          <Text>Score: {result.score}</Text>
        </View>
      ))}
    </View>
  );
}
```

### Genre-Specific Content

```typescript
import { 
  useTraktPopularHorrorMovies,
  useTraktPopularHorrorShows,
  useTraktPopularDramaMovies,
  useTraktPopularMoviesByGenre,
  useTraktPopularShowsByGenre
} from '@/lib/trakt/trakt-hooks';

function GenreExploration() {
  // Use predefined genre hooks
  const { data: horrorMovies } = useTraktPopularHorrorMovies({ 
    limit: 20,
    years: "2020-2024" // Only recent horror movies
  });
  
  const { data: horrorShows } = useTraktPopularHorrorShows({ 
    limit: 15,
    ratings: "7.0-10.0" // Only highly rated horror shows
  });
  
  // Use generic genre hooks for any genre
  const { data: actionMovies } = useTraktPopularMoviesByGenre('action', {
    limit: 10,
    certifications: "pg-13,r"
  });
  
  const { data: comedyShows } = useTraktPopularShowsByGenre('comedy', {
    limit: 12,
    networks: "netflix,hulu,hbo"
  });
  
  return (
    <ScrollView>
      <Section title="Horror Movies" data={horrorMovies} />
      <Section title="Horror Shows" data={horrorShows} />
      <Section title="Action Movies" data={actionMovies} />
      <Section title="Comedy Shows" data={comedyShows} />
    </ScrollView>
  );
}
```

### Latest/Updated Content

```typescript
import { 
  useTraktLatestShows, 
  useTraktLatestMovies 
} from '@/lib/trakt/trakt-hooks';

function WhatsNewSection() {
  const { data: latestShows } = useTraktLatestShows({ limit: 15 });
  const { data: latestMovies } = useTraktLatestMovies({ limit: 15 });
  
  return (
    <View>
      <Text>Recently Updated Shows</Text>
      {latestShows?.map(show => (
        <View key={show.ids.trakt}>
          <Text>{show.title} ({show.year})</Text>
          <Text>Rating: {show.rating}/10</Text>
          <Text>Genres: {show.genres.join(', ')}</Text>
        </View>
      ))}
      
      <Text>Recently Updated Movies</Text>
      {latestMovies?.map(movie => (
        <View key={movie.ids.trakt}>
          <Text>{movie.title} ({movie.year})</Text>
          <Text>Rating: {movie.rating}/10</Text>
          <Text>Genres: {movie.genres.join(', ')}</Text>
        </View>
      ))}
    </View>
  );
}
```

### Discovery Feed (Combined Content)

```typescript
import { useTraktDiscoveryFeed } from '@/lib/trakt/trakt-hooks';

function DiscoveryFeed() {
  const { trending, popular, isLoading } = useTraktDiscoveryFeed();
  
  if (isLoading) return <Loading />;
  
  return (
    <ScrollView>
      <Section title="Trending Now">
        <HorizontalList data={trending.shows} type="show" />
        <HorizontalList data={trending.movies} type="movie" />
      </Section>
      
      <Section title="Popular This Month">
        <HorizontalList data={popular.shows} type="show" />
        <HorizontalList data={popular.movies} type="movie" />
      </Section>
    </ScrollView>
  );
}
```

## Advanced Filtering Examples

### Year-Based Filtering

```typescript
// Get popular movies from the 2020s
const { data: recentMovies } = useTraktPopularMovies({
  years: "2020-2024",
  limit: 20
});

// Get classic movies from the 80s
const { data: classicMovies } = useTraktPopularMovies({
  years: "1980-1989",
  limit: 15
});
```

### Rating-Based Filtering

```typescript
// Get highly rated horror movies
const { data: topHorrorMovies } = useTraktPopularHorrorMovies({
  ratings: "8.0-10.0",
  limit: 10
});

// Get decent family movies
const { data: familyMovies } = useTraktPopularMoviesByGenre('family', {
  ratings: "6.0-10.0",
  certifications: "g,pg,pg-13"
});
```

### Network-Based Filtering (TV Shows)

```typescript
// Get popular Netflix shows
const { data: netflixShows } = useTraktPopularShows({
  networks: "netflix",
  limit: 20
});

// Get HBO and Showtime dramas
const { data: premiumDramas } = useTraktPopularDramaShows({
  networks: "hbo,showtime",
  limit: 15
});
```

### Runtime-Based Filtering

```typescript
// Get short movies (under 2 hours)
const { data: shortMovies } = useTraktPopularMovies({
  runtimes: "60-120",
  limit: 15
});

// Get long epic movies (over 2.5 hours)
const { data: epicMovies } = useTraktPopularMovies({
  runtimes: "150-300",
  limit: 10
});
```

## Integration with Watchlists

```typescript
import { useCreateWatchlistItem } from '@/lib/tanstack/watchlist-hooks';

function TraktContentCard({ content, type }: { content: any, type: 'movie' | 'show' }) {
  const createItem = useCreateWatchlistItem();
  
  const addToWatchlist = async (watchlistId: string) => {
    await createItem.mutateAsync({
      watchlist: watchlistId,
      mediaType: type,
      traktId: content.ids.trakt,
      tmdbId: content.ids.tmdb,
      imdbId: content.ids.imdb,
      title: content.title,
      year: content.year,
      status: ['plan_to_watch']
    });
  };
  
  return (
    <View>
      <Text>{content.title} ({content.year})</Text>
      {content.genres && <Text>Genres: {content.genres.join(', ')}</Text>}
      <Button 
        title="Add to Watchlist" 
        onPress={() => addToWatchlist(selectedWatchlistId)} 
      />
    </View>
  );
}
```

## Error Handling

```typescript
function RobustTrendingSection() {
  const { 
    data: trendingShows, 
    isLoading, 
    error,
    refetch 
  } = useTraktTrendingShows();
  
  if (isLoading) return <Loading />;
  
  if (error) {
    return (
      <View>
        <Text>Failed to load trending shows</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }
  
  return (
    <View>
      {trendingShows?.map(item => (
        <TraktContentCard 
          key={item.show.ids.trakt}
          content={item.show}
          type="show"
        />
      ))}
    </View>
  );
}
```

## Performance Optimization

### Pagination

```typescript
function PaginatedMovies() {
  const [page, setPage] = useState(1);
  
  const { data: movies, isLoading } = useTraktPopularMovies({
    page,
    limit: 20
  });
  
  return (
    <View>
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard movie={item} />}
        keyExtractor={(item) => item.ids.trakt.toString()}
      />
      
      <View>
        <Button 
          title="Previous" 
          onPress={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        />
        <Text>Page {page}</Text>
        <Button 
          title="Next" 
          onPress={() => setPage(p => p + 1)}
        />
      </View>
    </View>
  );
}
```

### Conditional Loading

```typescript
function ConditionalSearch() {
  const [query, setQuery] = useState('');
  const [shouldSearch, setShouldSearch] = useState(false);
  
  // Only search when explicitly triggered
  const { data: results, isLoading } = useTraktSearch({
    query,
    limit: 10
  });
  
  // The query option already includes: enabled: !!query && query.length >= 2
  
  return (
    <View>
      <TextInput
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          setShouldSearch(text.length >= 2);
        }}
        placeholder="Search..."
      />
      
      {isLoading && <Loading />}
      {results && <SearchResults results={results} />}
    </View>
  );
}
```

This integration provides a comprehensive set of tools for discovering and searching content via the Trakt API, with strong type safety and performance optimizations.
