import { StyleSheet, View,unstable_batchedUpdates as batchUpdates, } from "react-native";
import { Text,Button } from "react-native-paper";

import { makePersistedAdapter } from "@livestore/adapter-expo";
import { nanoid } from "@livestore/livestore";
import { LiveStoreProvider } from "@livestore/react";
import { makeCfSync } from "@livestore/sync-cf";
import { events, schema, tables } from "./schema";
import { useState } from "react";
import { envVariables } from "../env";

const storeId = envVariables.EXPO_PUBLIC_LIVESTORE_STORE_ID
const syncUrl = envVariables.EXPO_PUBLIC_LIVESTORE_SYNC_URL;

const adapter = makePersistedAdapter({
  sync: { backend: syncUrl ? makeCfSync({ url: syncUrl }) : undefined },
});

export function LivestoreProvider({ children }: { children: React.ReactNode }) {
    const [, rerender] = useState({});
  return (
    <LiveStoreProvider
      schema={schema}
      adapter={adapter}
      storeId={storeId}
      syncPayload={{ authToken: "insecure-token-change-me" }}
      renderLoading={(_) => <Text>Loading LiveStore ({_.stage})...</Text>}
      renderError={(error: any) => <Text>Error: {error.toString()}</Text>}
      renderShutdown={() => {
        return (
          <View>
            <Text>LiveStore Shutdown</Text>
            <Button onPress={() => rerender({})} >Reload</Button>
          </View>
        );
      }}
      boot={(store) => {
        if (store.query(tables.todos.count()) === 0) {
          store.commit(events.todoCreated({ id: nanoid(), text: "Make coffee" }));
        }
      }}
      batchUpdates={batchUpdates}>
      {children}
    </LiveStoreProvider>
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
