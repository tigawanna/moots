import React from 'react'
import { StyleSheet, View, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { Text, Surface, TextInput, Button, useTheme, Card, List } from 'react-native-paper'
import { nanoid } from '@livestore/livestore'
import { useStore } from '@livestore/react'

import { tables, events } from '../../../lib/livestore/schema'

export function TestQueryScreen() {
  const theme = useTheme()
  const { store } = useStore()
  
  // Use store queries directly and create reactive state
  const [uiState, setUiState] = React.useState<any>(null)
  const [todos, setTodos] = React.useState<any[]>([])

  // Subscribe to changes
  React.useEffect(() => {
    // Query for UI state
    const uiStateResult = store.query(tables.uiState)
    setUiState(uiStateResult)

    // Query for todos
    const todosResult = store.query(tables.todos.where({ deletedAt: null }))
    setTodos(Array.isArray(todosResult) ? todosResult : [])

    // Set up a subscription for changes
    // const unsubscribe = store.subscribe(() => {
    //   const newUiState = store.query(tables.uiState)
    //   const newTodos = store.query(tables.todos.where({ deletedAt: null }))
    //   setUiState(newUiState)
    //   setTodos(Array.isArray(newTodos) ? newTodos : [])
    // },{})

    // return unsubscribe
  }, [store])

  const inputRef = React.useRef<any>(null)

  const updatedNewTodoText = (text: string) => {
    store.commit(events.uiStateSet({ newTodoText: text }))
  }

  const todoCreated = () => {
    if (!uiState?.newTodoText?.trim()) return
    store.commit(
      events.todoCreated({ id: nanoid(), text: uiState.newTodoText }),
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

  return (
    <Surface style={styles.container}>
      <Text variant='headlineMedium' style={{ marginBottom: 20, color: theme.colors.onSurface }}>
        LiveStore Todo Demo
      </Text>
      
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss()
          inputRef.current?.blur()
        }}
      >
        <View style={styles.todoContainer}>
          <TextInput
            ref={inputRef}
            mode="outlined"
            label="New Todo"
            value={uiState?.newTodoText || ''}
            onChangeText={updatedNewTodoText}
            onSubmitEditing={todoCreated}
            style={styles.input}
            contentStyle={{ fontSize: 16 }}
          />
          
          <View style={styles.buttonContainer}>
            <Button 
              mode="contained" 
              onPress={todoCreated}
              style={styles.button}
              disabled={!uiState?.newTodoText?.trim()}
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

          {/* Todo List */}
          <Card style={styles.todoList}>
            <Card.Title title={`Todos (${todos.length})`} />
            <Card.Content>
              {todos.length > 0 ? (
                todos.map((todo: any) => (
                  <List.Item
                    key={todo.id}
                    title={todo.text}
                    left={() => (
                      <Button
                        mode={todo.completed ? "contained" : "outlined"}
                        onPress={() => toggleTodo(todo.id, todo.completed)}
                        compact
                        style={{ marginRight: 8 }}
                      >
                        {todo.completed ? "✓" : "○"}
                      </Button>
                    )}
                    right={() => (
                      <Button
                        mode="text"
                        onPress={() => deleteTodo(todo.id)}
                        textColor={theme.colors.error}
                        compact
                      >
                        Delete
                      </Button>
                    )}
                    style={{
                      opacity: todo.completed ? 0.6 : 1,
                      backgroundColor: todo.completed ? theme.colors.surfaceVariant : 'transparent'
                    }}
                  />
                ))
              ) : (
                <Text style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                  No todos yet. Add one above!
                </Text>
              )}
            </Card.Content>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    </Surface>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  todoContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 16,
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
    marginBottom: 20,
  },
  button: {
    minWidth: 80,
  },
  todoList: {
    width: '100%',
    maxHeight: 400,
  },
})
