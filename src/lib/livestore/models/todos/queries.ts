// import { queryDb } from '@livestore/livestore'
// import { tables } from './models/todos/schema'

// // Define reactive queries using queryDb
// export const uiState$ = queryDb(tables.uiState, { label: 'uiState$' })

// // Query for all todos (excluding deleted ones)
// export const allTodos$ = queryDb(
//   tables.todos.where({ deletedAt: null }).orderBy('id', 'desc'),
//   { label: 'allTodos$' }
// )

// // Query for active todos (not completed)
// export const activeTodos$ = queryDb(
//   tables.todos.where({ completed: false, deletedAt: null }).orderBy('id', 'desc'),
//   { label: 'activeTodos$' }
// )

// // Query for completed todos
// export const completedTodos$ = queryDb(
//   tables.todos.where({ completed: true, deletedAt: null }).orderBy('id', 'desc'),
//   { label: 'completedTodos$' }
// )

// // Dynamic query that depends on the filter state
// export const visibleTodos$ = queryDb(
//   (get) => {
//     const uiState = get(uiState$)
//     // uiState is an array for client documents, get the first item
//     const filter = uiState?.[0]?.value?.filter || 'all'
    
//     switch (filter) {
//       case 'active':
//         return tables.todos.where({ completed: false, deletedAt: null }).orderBy('id', 'desc')
//       case 'completed':
//         return tables.todos.where({ completed: true, deletedAt: null }).orderBy('id', 'desc')
//       case 'all':
//       default:
//         return tables.todos.where({ deletedAt: null }).orderBy('id', 'desc')
//     }
//   },
//   { label: 'visibleTodos$' }
// )

// // Count queries
// export const activeTodosCount$ = queryDb(
//   tables.todos.where({ completed: false, deletedAt: null }).count(),
//   { label: 'activeTodosCount$' }
// )

// export const completedTodosCount$ = queryDb(
//   tables.todos.where({ completed: true, deletedAt: null }).count(),
//   { label: 'completedTodosCount$' }
// )

// export const totalTodosCount$ = queryDb(
//   tables.todos.where({ deletedAt: null }).count(),
//   { label: 'totalTodosCount$' }
// )
