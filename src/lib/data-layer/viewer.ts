import { useLocalUserStore } from "@/store/user-store";
import { queryDb } from "@livestore/livestore";
import { useQuery } from "@livestore/react";
import { tables } from "../livestore/simple-schema";

export function useViewer() {
  const { user } = useLocalUserStore();
  const currentUser = queryDb(
    (get) => {
      return tables.users.where({ id: user?.id }).first();
    },
    {
      label: "currentUser",
    }
  );
  const { username, id } = useQuery(currentUser);
  return {
    user: {
      id,
      username,
    },
  };
}

// import { queryDb } from '@livestore/livestore'
// import { useQuery } from '@livestore/react'
// import React from 'react'
// import { FlatList } from 'react-native'

// import { uiState$ } from '../livestore/queries.ts'
// import { tables } from '../livestore/schema.ts'
// import { Todo } from './Todo.tsx'

// const visibleTodos$ = queryDb(
//   (get) => {
//     const { filter } = get(uiState$)
//     return tables.todos.where({
//       deletedAt: null,
//       completed: filter === 'all' ? undefined : filter === 'completed',
//     })
//   },
//   { label: 'visibleTodos' },
// )

// export const ListTodos: React.FC = () => {
//   const visibleTodos = useQuery(visibleTodos$)
