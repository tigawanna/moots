import { makeAdapter } from "@livestore/adapter-node";
import { createStorePromise, Events, makeSchema, Schema, State, } from "@livestore/livestore";
import { eq } from "drizzle-orm";
import { query, toDrizzleTables } from "./drizzle-livestore";

const events = {
  todoCreated: Events.synced({
    name: "v1.TodoCreated",
    schema: Schema.Struct({
      id: Schema.Int,
      text: Schema.String,
      date: Schema.Date,
    }),
  }),
  todoCompleted: Events.synced({
    name: "v1.TodoCompleted",
    schema: Schema.Struct({
      id: Schema.Int,
      date: Schema.Date,
    }),
  }),
  todoUncompleted: Events.synced({
    name: "v1.TodoUncompleted",
    schema: Schema.Struct({
      id: Schema.Int,
      date: Schema.Date,
    }),
  }),
};

const tables = {
  todos: State.SQLite.table({
    name: "todos",
    columns: {
      id: State.SQLite.integer({ primaryKey: true }),
      text: State.SQLite.text({ default: "" }),
      completed: State.SQLite.boolean({ default: false }),
      lastModified: State.SQLite.integer({
        schema: Schema.DateFromNumber,
      }),
    },
  }),
  category: State.SQLite.table({
    name: "category",
    columns: {
      id: State.SQLite.integer({ primaryKey: true }),
      name: State.SQLite.text({ default: "" }),
    },

  }),
}

const materializers = State.SQLite.materializers(events, {
  "v1.TodoCreated": ({ id, text, date }) => {
    return tables.todos.insert({
      id,
      completed: false,
      text,
      lastModified: date,
    });
  },
  "v1.TodoCompleted": ({ id, date }) => {
    return tables.todos
      .update({
        completed: true,
        lastModified: date,
      })
      .where({ id });
  },
  "v1.TodoUncompleted": ({ id, date }) => {
    return tables.todos
      .update({
        completed: false,
        lastModified: date,
      })
      .where({ id });
  },
});

const schema = makeSchema({
  events,
  state: State.SQLite.makeState({
    tables,
    materializers,
  }),
});

// This is how you do  nodejs adapter , don't worry about t were using expo this is ajust an example
const adapter = makeAdapter({
  storage: {
    type: "fs",
    baseDirectory: "tmp",
  },
});

const controller = new AbortController();
// @ts-expect-error : its just an example
const store = await createStorePromise({
  adapter,
  schema,
  storeId: "todos-store",
  signal: controller.signal,
});

// normal queries
// store.commit(
//   events.todoCreated({
//     id: 0,
//     text: "Make a video about livestore",
//     date: new Date(),
//   }),
//   events.todoCreated({
//     id: 1,
//     text: "Indulge the side-quest of making a drizzle query builder adapter for livestore",
//     date: new Date(),
//   }),
// )

// store.commit(
//   events.todoUncompleted({
//     id: 1,
//     date: new Date(),
//   }),
// )

// const maybeTodo = store.query(
//   tables.todos.where({
//     id: 1,
//   }).first({
//     fallback: () => undefined,
//   }),
// )

// console.log(maybeTodo)

const { todos, category } = toDrizzleTables(tables);
 // queries with drizzle wrapper
const rows = query(store, (qb) => qb.select().from(todos).where(eq(todos.id, 1)))

console.log(rows);

controller.abort();

// SQL schema definition #fetch https://docs.livestore.dev/reference/state/sqlite-schema/
// SQL queries docs #fetch https://docs.livestore.dev/reference/state/sql-queries/
// SQL joins example https://github.com/livestorejs/livestore/discussions/400
 // Objective is to create a drizzle-orm adapter for Livestore that will allow us to use drizzle-orm's query builder especially relations to model the livestore data and maybe output a livestore compatible schema
