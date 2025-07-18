import { Events, makeSchema, Schema, State, } from "@livestore/livestore";

// You can model your state as SQLite tables (https://docs.livestore.dev/reference/state/sqlite-schema)
export const tables = {
  todos: State.SQLite.table({
    name: "todos",
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      userId: State.SQLite.text(),
      text: State.SQLite.text({ default: "" }),
      completed: State.SQLite.boolean({ default: false }),
      deletedAt: State.SQLite.integer({
        nullable: true,
        schema: Schema.DateFromNumber,
      }),
    },
  }),
  // Client documents can be used for local-only state (e.g. form inputs)
  users: State.SQLite.table({
    name: "users",
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      username: State.SQLite.text({ default: "" }),
    },
  }),
};

// Events describe data changes (https://docs.livestore.dev/reference/events)
export const events = {
  todoCreated: Events.synced({
    name: "v1.TodoCreated",
    schema: Schema.Struct({
      id: Schema.String,
      userId: Schema.String,
      text: Schema.String,
    }),
  }),
  todoCompleted: Events.synced({
    name: "v1.TodoCompleted",
    schema: Schema.Struct({ id: Schema.String, userId: Schema.String }),
  }),
  todoUncompleted: Events.synced({
    name: "v1.TodoUncompleted",
    schema: Schema.Struct({ id: Schema.String, userId: Schema.String }),
  }),
  todoDeleted: Events.synced({
    name: "v1.TodoDeleted",
    schema: Schema.Struct({ id: Schema.String, userId: Schema.String, deletedAt: Schema.Date }),
  }),
  todoClearedCompleted: Events.synced({
    name: "v1.TodoClearedCompleted",
    schema: Schema.Struct({ userId: Schema.String, deletedAt: Schema.Date }),
  }),
  userCreated: Events.synced({
    name: "v1.UserCreated",
    schema: Schema.Struct({
      id: Schema.String,
      username: Schema.String,
    }),
  }),
};

// Materializers are used to map events to state (https://docs.livestore.dev/reference/state/materializers)
const materializers = State.SQLite.materializers(events, {
  "v1.TodoCreated": ({ id, userId, text }) =>
    tables.todos.insert({ id, userId, text, completed: false }),
  "v1.TodoCompleted": ({ id, userId }) =>
    tables.todos.update({ completed: true }).where({ id, userId }),
  "v1.TodoUncompleted": ({ id, userId }) =>
    tables.todos.update({ completed: false }).where({ id, userId }),
  "v1.TodoDeleted": ({ id, userId, deletedAt }) =>
    tables.todos.update({ deletedAt }).where({ id, userId }),
  "v1.TodoClearedCompleted": ({ userId, deletedAt }) =>
    tables.todos.update({ deletedAt }).where({ completed: true, userId }),
  "v1.UserCreated": ({ id, username }) => tables.users.insert({ id, username }),
});

const state = State.SQLite.makeState({ tables, materializers });

export const schema = makeSchema({ events, state });

export type UserColumnType = typeof tables.users.Type
export type TodoColumnType = typeof tables.todos.Type
