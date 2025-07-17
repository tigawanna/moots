# LiveStore Implementation Guide & Key Takeaways

This document summarizes the key patterns and best practices for implementing LiveStore in React Native/Expo apps based on the official documentation.

## Core Concepts

### 1. Reactivity System
LiveStore uses a fine-grained reactivity system similar to Signals that provides:
- High performance with instant, synchronous query results
- No need for `useEffect` and `isLoading` checks
- Transactional state transitions
- Automatic re-rendering when data changes

### 2. Three Types of Reactive State
- **Reactive SQL queries** (`queryDb()`) - Query SQLite state with dependency tracking
- **Signals** (`signal()`) - Reactive state values for non-materialized data
- **Computed values** (`computed()`) - Derived reactive state

## Schema Design Patterns

### Event Definitions
```typescript
export const events = {
  todoCreated: Events.synced({
    name: 'v1.TodoCreated', // Use versioned names
    schema: Schema.Struct({ id: Schema.String, text: Schema.String }),
  }),
  // Use past-tense event names (todoCreated vs todoCreate)
  // Use soft deletes instead of DELETE events to avoid concurrency issues
}
```

### State Tables
```typescript
export const tables = {
  todos: State.SQLite.table({
    name: 'todos',
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      text: State.SQLite.text({ default: '' }),
      completed: State.SQLite.boolean({ default: false }),
      deletedAt: State.SQLite.integer({ nullable: true, schema: Schema.DateFromNumber }),
    },
  }),
  // Client documents for UI-only state
  uiState: State.SQLite.clientDocument({
    name: 'uiState',
    schema: Schema.Struct({ 
      newTodoText: Schema.String, 
      filter: Schema.Literal('all', 'active', 'completed') 
    }),
    default: { id: SessionIdSymbol, value: { newTodoText: '', filter: 'all' } },
  }),
}
```

### Materializers
```typescript
const materializers = State.SQLite.materializers(events, {
  'v1.TodoCreated': ({ id, text }) => tables.todos.insert({ id, text, completed: false }),
  'v1.TodoCompleted': ({ id }) => tables.todos.update({ completed: true }).where({ id }),
  // Map events to state changes
})
```

## React Integration Patterns

### 1. Provider Setup
```typescript
<LiveStoreProvider
  schema={schema}
  adapter={adapter}
  storeId={storeId}
  syncPayload={{ authToken: "token" }}
  renderLoading={(_) => <LoadingScreen />}
  renderError={(error) => <ErrorScreen error={error} />}
  batchUpdates={batchUpdates}
  boot={(store) => {
    // Initialize default data
    if (store.query(tables.todos.count()) === 0) {
      store.commit(events.todoCreated({ id: nanoid(), text: "Welcome!" }))
    }
  }}
>
  {children}
</LiveStoreProvider>
```

### 2. Reactive Queries
```typescript
// Define queries with queryDb for reactive dependency tracking
export const uiState$ = queryDb(tables.uiState, { label: 'uiState$' })

export const visibleTodos$ = queryDb(
  (get) => {
    const uiState = get(uiState$)
    const filter = uiState?.[0]?.value?.filter || 'all'
    
    switch (filter) {
      case 'active':
        return tables.todos.where({ completed: false, deletedAt: null })
      case 'completed':
        return tables.todos.where({ completed: true, deletedAt: null })
      default:
        return tables.todos.where({ deletedAt: null })
    }
  },
  { label: 'visibleTodos$' }
)
```

### 3. Component Usage
```typescript
export function TodoComponent() {
  const { store } = useStore()
  const uiState = useQuery(uiState$)
  const visibleTodos = useQuery(visibleTodos$)
  
  // Client documents return arrays, access first element
  const currentUiState = uiState?.[0]?.value || { /* defaults */ }
  
  const addTodo = (text: string) => {
    store.commit(
      events.todoCreated({ id: nanoid(), text }),
      events.uiStateSet({ newTodoText: '' })
    )
  }
  
  return (
    <View>
      {visibleTodos?.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </View>
  )
}
```

## Key Patterns & Best Practices

### 1. Event-Driven Architecture
- Use events to describe what happened (past tense)
- Commit multiple related events atomically
- Avoid DELETE events, use soft deletes instead
- Version event names for schema evolution

### 2. Reactive Query Design
- Use `queryDb` with dependency tracking for dynamic queries
- Define queries in separate files for reusability
- Use proper labeling for debugging
- Let LiveStore handle reactivity, avoid manual subscriptions

### 3. Client Document Handling
- Client documents return arrays, always access `[0]?.value`
- Use for UI-only state (form inputs, filters, etc.)
- Provide default values for robustness

### 4. Performance Optimization
- LiveStore provides instant, synchronous results
- No need for loading states with reactive queries
- Use `batchUpdates` for React integration
- Queries automatically optimize based on dependencies

## Advanced Patterns

### 1. Multi-Store Architecture
- Split data models across multiple stores for large apps
- Each store has its own eventlog and SQLite database
- Use for workspace/tenant isolation or domain separation

### 2. Workspace Pattern
```typescript
// User store (per user)
const userEvents = {
  workspaceCreated: Events.synced({
    name: 'v1.WorkspaceCreated',
    schema: Schema.Struct({ workspaceId: Schema.String }),
  }),
  workspaceJoined: Events.synced({
    name: 'v1.WorkspaceJoined', 
    schema: Schema.Struct({ workspaceId: Schema.String }),
  }),
}

// Workspace store (per workspace)
const workspaceEvents = {
  todoAdded: Events.synced({
    name: 'v1.TodoAdded',
    schema: Schema.Struct({ id: Schema.String, text: Schema.String }),
  }),
  userJoined: Events.synced({
    name: 'v1.UserJoined',
    schema: Schema.Struct({ userId: Schema.String }),
  }),
}
```

### 3. Signals for Non-Persisted State
```typescript
const now$ = signal(Date.now(), { label: 'now$' })
setInterval(() => {
  store.setSignal(now$, Date.now())
}, 1000)

const counter$ = signal(0, { label: 'counter$' })
const doubledCounter$ = computed((get) => get(counter$) * 2, { label: 'doubled$' })
```

## Development & Debugging

### 1. DevTools Usage
- Press `shift + m` in Expo terminal, select LiveStore Devtools
- Inspect database state, execute events, track performance
- Use `__debugLiveStore.default._dev` methods for debugging

### 2. Error Handling
- Implement proper error screens with retry functionality
- Handle loading and shutdown states gracefully
- Use TypeScript for compile-time safety

### 3. Database Access
```bash
# Expo Go
open $(find $(xcrun simctl get_app_container booted host.exp.Exponent data) -path "*/Documents/ExponentExperienceData/*livestore-expo*" -print -quit)/SQLite

# Development builds  
open $(xcrun simctl get_app_container booted [APP_BUNDLE_ID] data)/Documents/SQLite
```

## Future Extensibility Ideas

### Authentication & Authorization
- Integrate with auth providers (Clerk, Supabase, Firebase)
- Implement role-based access control
- Handle anonymous to authenticated user transitions

### Real-time Collaboration
- Set up sync backends (Cloudflare Workers, ElectricSQL)
- Implement presence and cursors
- Add conflict resolution strategies

### Rich Features
- Rich text editing with collaborative editing
- File management and attachments
- Offline-first capabilities
- Push notifications
- End-to-end encryption

### Advanced UI Patterns
- Undo/redo functionality
- Version control and history
- State machines for complex flows
- AI integration for smart features

## Migration & Schema Evolution

### Safe Schema Changes
- Add new fields with defaults or make them optional
- Remove unused fields safely
- Avoid changing existing field types
- Use versioned event names for major changes

### Data Migration Strategies
- Use materializers to transform legacy data
- Implement gradual rollouts for schema changes
- Maintain backward compatibility when possible
- Test migrations thoroughly in development

This guide provides a solid foundation for building scalable, reactive applications with LiveStore while following official best practices and patterns.
├── queries.ts         # Reactive queries using queryDb()
└── LivestoreProvider.tsx  # Setup (already exists)
```

### Component Pattern
```typescript
export function MyComponent() {
  const { store } = useStore()
  
  // Reactive queries
  const todos = useQuery(allTodos$)
  const uiState = useQuery(uiState$)
  
  // Event handlers
  const createTodo = (text: string) => {
    store.commit(events.todoCreated({ id: nanoid(), text }))
  }
  
  // Render with live data
  return <TodoList todos={todos} onCreateTodo={createTodo} />
}
```

## 🎨 UI/UX Patterns

### 1. **Real-time Stats Display**
- Use count queries for live statistics
- Display active/completed/total counts with chips

### 2. **Filtering System**
- Implement filter state in client document
- Use dynamic queries that respond to filter changes
- Provide chip-based filter UI

### 3. **Optimistic Updates**
- Events are applied immediately to local state
- No loading states needed for local operations
- LiveStore handles sync in background

## 📱 React Native Paper Integration

### Design Patterns Used:
1. **Card-based layout** for logical grouping
2. **Proper theming** with `useTheme()` hook
3. **Material Design icons** for actions
4. **Chip filters** for selection states
5. **ScrollView** for overflow handling
6. **Proper accessibility** with semantic components

## 🚀 Performance Optimizations

### 1. **Reactive Queries**
- Only re-render when relevant data changes
- Fine-grained reactivity (not whole-app re-renders)
- Automatic dependency tracking

### 2. **Local-first Architecture**
- Instant local updates
- Background synchronization
- Offline-first functionality

### 3. **Efficient Filtering**
- Use `React.useMemo` for derived data
- Combine with LiveStore reactive queries
- Minimal re-computations

## 🔧 Best Practices

### 1. **Event Design**
```typescript
// ✅ Good: Past tense, descriptive
todoCreated: Events.synced({
  name: 'v1.TodoCreated',
  schema: Schema.Struct({ id: Schema.String, text: Schema.String }),
})

// ❌ Avoid: Present tense, vague
createTodo: Events.synced({...})
```

### 2. **Query Organization**
- Keep queries in separate file (`queries.ts`)
- Use descriptive labels for debugging
- Group related queries together

### 3. **Error Handling**
- LiveStore handles most errors automatically
- Focus on user input validation
- Use TypeScript for compile-time safety

### 4. **State Management**
- Use client documents for local UI state
- Use synced tables for shared data
- Prefer soft deletes over hard deletes

## 🎭 Advanced Features Ready to Implement

### 1. **Multi-user Collaboration**
- Already built-in with sync backend
- Real-time updates across devices
- Conflict resolution handled automatically

### 2. **Offline Support**
- Local SQLite persistence
- Queue events when offline
- Sync when connection restored

### 3. **Undo/Redo**
- Event sourcing enables time travel
- Can implement undo by applying inverse events
- Full history tracking

### 4. **Performance Monitoring**
- Built-in devtools for debugging
- Query performance tracking
- Event history inspection

## 🔮 Next Steps

1. **Add user authentication** with Appwrite integration
2. **Implement workspace/project separation**
3. **Add rich text editing** for todo descriptions
4. **Build collaborative features** (real-time cursors, presence)
5. **Add file attachments** with Appwrite storage
6. **Implement push notifications** for shared todos

## 📊 Metrics

This implementation provides:
- ✅ **100% type-safe** data access
- ✅ **Real-time reactivity** with minimal boilerplate
- ✅ **Offline-first** architecture
- ✅ **Multi-device sync** capability
- ✅ **Material Design** UI/UX
- ✅ **Extensible architecture** for future features

---

*This implementation serves as a solid foundation for building more complex collaborative applications with LiveStore.*
