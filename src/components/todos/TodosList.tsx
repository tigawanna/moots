import { FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, Surface, Text } from "react-native-paper";
import { useTodos } from "../../hooks/useTodos";

import { AddTodoInput } from "./AddTodoInput";
import { TodoItem } from "./TodoItem";
import { TodosHeader } from "./TodosHeader";
import { useLocalUserStore } from "@/store/user-store";

export function TodosList() {
  const { user, isAuthenticated } = useLocalUserStore();
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    stats,
    isLoading,
  } = useTodos();

  if (!isAuthenticated || !user) {
    return (
      <Surface style={styles.container}>
        <Text variant="titleLarge">Please log in to view your todos</Text>
      </Surface>
    );
  }

  if (isLoading) {
    return (
      <Surface style={styles.container}>
        <ActivityIndicator size="large" />
        <Text variant="bodyLarge" style={styles.loadingText}>
          Loading your todos...
        </Text>
      </Surface>
    );
  }

  return (
    <Surface style={styles.surface}>
      <View style={styles.header}>
        <Text variant="headlineSmall">Hello, {user.username}!</Text>
      </View>

      <AddTodoInput onAdd={addTodo} />

      {todos.length > 0 && (
        <TodosHeader
          totalCount={stats.total}
          completedCount={stats.completed}
          onClearCompleted={clearCompleted}
        />
      )}

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} />
        )}
        style={styles.list}
        contentContainerStyle={
          todos.length === 0 ? styles.emptyContainer : undefined
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No todos yet. Add one above to get started!
            </Text>
          </View>
        }
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.6,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.6,
  },
});
