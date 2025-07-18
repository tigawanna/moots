import { useLocalUserStore } from "@/store/user-store";
import { events,tables } from "../lib/livestore/simple-schema";
import { queryDb } from "@livestore/livestore";
import { useQuery, useStore } from "@livestore/react";



export function useTodos() {
  const { user } = useLocalUserStore();
  const { store } = useStore();
  const userId = user?.id || null;

  // Query todos for current user, excluding deleted ones
  const todosQuery = queryDb(() => {
    const todosRows = tables.todos.select().orderBy("id", "desc");
    if (userId) {
      todosRows.where({ userId, deletedAt: null });
    } else {
      todosRows.where({ deletedAt: null });
    }
    return todosRows;
  });

  const todos = useQuery(todosQuery);

  const addTodo = (text: string) => {
    if (!userId) return;

    const id = `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    store.commit(
      events.todoCreated({
        id,
        userId,
        text,
      })
    );
  };

  const toggleTodo = (id: string) => {
    if (!userId) return;
    store.commit(
      events.todoCompleted({
        id,
        userId,
      })
    );
  };

  const deleteTodo = (id: string) => {
    if (!userId) return;

    store.commit(
      events.todoDeleted({
        id,
        userId,
        deletedAt: new Date(),
      })
    );
  };

  const clearCompleted = () => {
    if (!userId) return;

    store.commit(
      events.todoClearedCompleted({
        userId,
        deletedAt: new Date(),
      })
    );
  };

  const stats = {
    total: todos?.length || 0,
    completed: todos?.filter((t) => t.completed).length || 0,
    active: todos?.filter((t) => !t.completed).length || 0,
  };

  return {
    todos: todos || [],
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    stats,
    isLoading: !todos && !!userId,
  };
}
