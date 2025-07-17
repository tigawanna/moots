import { makeSchema, State } from "@livestore/livestore";
import { events } from "./events";
import { materializers } from "./materializers";
import { tables } from "./tables";

// Export all components for easy access
export * from "./events";
export * from "./materializers";
export * from "./tables";

// Create the state with tables and materializers
const state = State.SQLite.makeState({ tables, materializers });

// Export the complete schema for the movie social app
export const schema = makeSchema({ events, state });
