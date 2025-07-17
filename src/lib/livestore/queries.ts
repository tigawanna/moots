import { tables } from './schema'

// Simple queries that can be used with store.query()
// For UI state (form inputs, filters, etc.)
export const uiStateQuery = tables.uiState

// For todos with different filters
export const todosQuery = tables.todos
export const activeTodosQuery = () => tables.todos.where({ completed: false, deletedAt: null })
export const completedTodosQuery = () => tables.todos.where({ completed: true, deletedAt: null })
export const allTodosQuery = () => tables.todos.where({ deletedAt: null })

// Count queries
export const activeTodosCountQuery = () => tables.todos.where({ completed: false, deletedAt: null }).count()
export const completedTodosCountQuery = () => tables.todos.where({ completed: true, deletedAt: null }).count()
export const allTodosCountQuery = () => tables.todos.where({ deletedAt: null }).count()

// Helper function to get filtered todos based on current filter
export const getFilteredTodosQuery = (filter: 'all' | 'active' | 'completed') => {
  switch (filter) {
    case 'all':
      return allTodosQuery()
    case 'active':
      return activeTodosQuery()
    case 'completed':
      return completedTodosQuery()
    default:
      return allTodosQuery()
  }
}
