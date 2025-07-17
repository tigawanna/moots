import { nanoid } from '@livestore/livestore'
import { useQuery, useStore } from '@livestore/react'
import React from 'react'
import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { Button, Card, Chip, List, Surface, Text, TextInput, useTheme } from 'react-native-paper'

import { activeTodosCount$, completedTodosCount$, totalTodosCount$, uiState$, visibleTodos$ } from '../../../lib/livestore/queries'
import { events } from '../../../lib/livestore/schema'

export function TestQueryScreen() {
  const theme = useTheme()
  const { store } = useStore()
  
  // Use LiveStore reactive queries with useQuery hook
  const uiState = useQuery(uiState$)
  const visibleTodos = useQuery(visibleTodos$)
  const activeTodosCount = useQuery(activeTodosCount$)
  const completedTodosCount = useQuery(completedTodosCount$)
  const totalTodosCount = useQuery(totalTodosCount$)

  const inputRef = React.useRef<any>(null)

  // Get the current UI state value (client documents return an array)
  const currentUiState = uiState?.[0]?.value || { newTodoText: '', filter: 'all' }

  const updatedNewTodoText = (text: string) => {
    store.commit(events.uiStateSet({ newTodoText: text }))
  }

  const todoCreated = () => {
    const todoText = currentUiState.newTodoText?.trim()
    if (!todoText) return
    
    store.commit(
      events.todoCreated({ id: nanoid(), text: todoText }),
      events.uiStateSet({ newTodoText: '' })
    )
  }

  const addRandom50 = () => {
    const todoEvents = Array.from({ length: 50 }, (_, i) => 
      events.todoCreated({ id: nanoid(), text: `Random Todo ${i + 1}` })
    )
    store.commit(...todoEvents)
  }

  const reset = () => {
    store.commit(events.todoClearedCompleted({ deletedAt: new Date() }))
  }

  const toggleTodo = (id: string, completed: boolean) => {
    const event = completed ? events.todoUncompleted({ id }) : events.todoCompleted({ id })
    store.commit(event)
  }

  const deleteTodo = (id: string) => {
    store.commit(events.todoDeleted({ id, deletedAt: new Date() }))
  }

  const setFilter = (filter: 'all' | 'active' | 'completed') => {
    store.commit(events.uiStateSet({ filter }))
  }

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text variant='headlineMedium' style={{ marginBottom: 8, color: theme.colors.onSurface, textAlign: 'center' }}>
          LiveStore Todo Demo
        </Text>
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <Chip mode="outlined" compact>Total: {totalTodosCount || 0}</Chip>
          <Chip mode="outlined" compact>Active: {activeTodosCount || 0}</Chip>
          <Chip mode="outlined" compact>Done: {completedTodosCount || 0}</Chip>
        </View>
        
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss()
            inputRef.current?.blur()
          }}
        >
          <View style={styles.todoContainer}>
            {/* Input Section */}
            <Card style={styles.inputCard}>
              <Card.Content>
                <TextInput
                  ref={inputRef}
                  mode="outlined"
                  label="New Todo"
                  value={currentUiState.newTodoText || ''}
                  onChangeText={updatedNewTodoText}
                  onSubmitEditing={todoCreated}
                  style={styles.input}
                  contentStyle={{ fontSize: 16 }}
                  returnKeyType="done"
                />
                
                <View style={styles.buttonContainer}>
                  <Button 
                    mode="contained" 
                    onPress={todoCreated}
                    style={styles.button}
                    disabled={!currentUiState.newTodoText?.trim()}
                  >
                    Add Todo
                  </Button>
                  
                  <Button 
                    mode="outlined" 
                    onPress={addRandom50}
                    style={styles.button}
                  >
                    Add 50 Random
                  </Button>
                  
                  <Button 
                    mode="text" 
                    onPress={reset}
                    style={styles.button}
                    textColor={theme.colors.error}
                  >
                    Clear Completed
                  </Button>
                </View>
              </Card.Content>
            </Card>

            {/* Filter Section */}
            <Card style={styles.filterCard}>
              <Card.Content>
                <Text variant="titleSmall" style={{ marginBottom: 8 }}>Filter</Text>
                <View style={styles.filterContainer}>
                  <Chip 
                    mode={currentUiState.filter === 'all' ? 'flat' : 'outlined'}
                    onPress={() => setFilter('all')}
                    selected={currentUiState.filter === 'all'}
                  >
                    All
                  </Chip>
                  <Chip 
                    mode={currentUiState.filter === 'active' ? 'flat' : 'outlined'}
                    onPress={() => setFilter('active')}
                    selected={currentUiState.filter === 'active'}
                  >
                    Active
                  </Chip>
                  <Chip 
                    mode={currentUiState.filter === 'completed' ? 'flat' : 'outlined'}
                    onPress={() => setFilter('completed')}
                    selected={currentUiState.filter === 'completed'}
                  >
                    Completed
                  </Chip>
                </View>
              </Card.Content>
            </Card>

            {/* Todo List */}
            <Card style={styles.todoList}>
              <Card.Title 
                title={`${currentUiState.filter === 'all' ? 'All' : currentUiState.filter === 'active' ? 'Active' : 'Completed'} Todos`}
                subtitle={`${visibleTodos?.length || 0} items`}
              />
              <Card.Content>
                {visibleTodos && visibleTodos.length > 0 ? (
                  visibleTodos.map((todo: any) => (
                    <List.Item
                      key={todo.id}
                      title={todo.text}
                      titleStyle={{
                        textDecorationLine: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? theme.colors.onSurfaceVariant : theme.colors.onSurface
                      }}
                      left={() => (
                        <Button
                          mode={todo.completed ? "contained" : "outlined"}
                          onPress={() => toggleTodo(todo.id, todo.completed)}
                          compact
                          style={{ marginRight: 8 }}
                          icon={todo.completed ? "check" : "circle-outline"}
                        >
                          {todo.completed ? "" : ""}
                        </Button>
                      )}
                      right={() => (
                        <Button
                          mode="text"
                          onPress={() => deleteTodo(todo.id)}
                          textColor={theme.colors.error}
                          compact
                          icon="delete"
                        >
                          Delete
                        </Button>
                      )}
                      style={{
                        opacity: todo.completed ? 0.7 : 1,
                        backgroundColor: todo.completed ? theme.colors.surfaceVariant : 'transparent',
                        borderRadius: 8,
                        marginVertical: 2
                      }}
                    />
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                      {currentUiState.filter === 'all' 
                        ? 'No todos yet. Add one above!' 
                        : `No ${currentUiState.filter} todos.`
                      }
                    </Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </Surface>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  todoContainer: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  inputCard: {
    width: '100%',
    marginBottom: 16,
  },
  filterCard: {
    width: '100%',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  input: {
    width: '100%',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    minWidth: 80,
  },
  todoList: {
    width: '100%',
    maxHeight: 500,
  },
  emptyState: {
    padding: 20,
  },
})
