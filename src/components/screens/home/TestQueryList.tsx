import { FlatList, StyleSheet, View } from "react-native";
import { Text, Surface, List, useTheme, Button, MD3Theme } from "react-native-paper";
import {
  uiState$,
  visibleTodos$,
} from "@/lib/livestore/queries";
import { useQuery, useStore } from "@livestore/react";
import { events } from "@/lib/livestore/schema";
import { useState } from "react";

export function TestQueryList() {
  const visibleTodos = useQuery(visibleTodos$);
  const theme = useTheme();
  const keyExtractor = (item: any) => item.id;
  const uiState = useQuery(uiState$);

  const { store } = useStore();

  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const toggleTodo = (id: string, completed: boolean) => {
    setToggling(true);
    const event = completed ? events.todoUncompleted({ id }) : events.todoCompleted({ id });
    store.commit(event);
    setToggling(false);
  };

  const deleteTodo = (id: string) => {
    setDeleting(true);
    store.commit(events.todoDeleted({ id, deletedAt: new Date() }));
    setDeleting(false);
  };
  const currentUiState = uiState?.[0]?.value || { newTodoText: "", filter: "all" };
  return (
    <Surface style={{ ...styles.container }}>
      <FlatList
        data={visibleTodos || []}
        renderItem={({ item }) => (
          <RenderTodoItem
            item={item}
            theme={theme}
            deleteTodo={deleteTodo}
            toggleTodo={toggleTodo}
            deleting={deleting}
            toggling={toggling}
          />
        )}
        keyExtractor={keyExtractor}
        windowSize={20}

        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={{ padding: 20 }}>
            <Text style={{ textAlign: "center", color: theme.colors.onSurfaceVariant }}>
              {currentUiState.filter === "all"
                ? "No todos yet. Add one above!"
                : `No ${currentUiState.filter} todos.`}
            </Text>
          </View>
        )}
        contentContainerStyle={
          visibleTodos && visibleTodos.length === 0
            ? { flex: 1, justifyContent: "center" }
            : undefined
        }
      />
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

function RenderTodoItem({
  item: todo,
  theme,
  deleting,
  toggling,
  deleteTodo,
  toggleTodo,
}: {
  item: any;
  theme: MD3Theme;
  deleting: boolean;
  toggling: boolean;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string, completed: boolean) => void;
}) {

  return (
    <List.Item
      title={todo.text}
      titleStyle={{
        textDecorationLine: todo.completed ? "line-through" : "none",
        color: todo.completed ? theme.colors.onSurfaceVariant : theme.colors.onSurface,
      }}
      left={() => (
        <Button
          mode={todo.completed ? "contained" : "outlined"}
          onPress={() => toggleTodo(todo.id, todo.completed)}
          compact
          style={{ marginRight: 8 }}
          icon={toggling ? "loading" : todo.completed ? "check" : "circle-outline"}>
          {todo.completed ? "" : ""}
        </Button>
      )}
      right={() => (
        <Button
          mode="text"
          onPress={() => deleteTodo(todo.id)}
          textColor={theme.colors.error}
          compact
          icon={deleting ? "loading" : "delete"}>
          {deleting ? "" : "Delete"}
        </Button>
      )}
      style={{
        opacity: todo.completed ? 0.7 : 1,
        backgroundColor: todo.completed ? theme.colors.surfaceVariant : "transparent",
        borderRadius: 8,
        marginVertical: 2,
      }}
    />
  );
}
