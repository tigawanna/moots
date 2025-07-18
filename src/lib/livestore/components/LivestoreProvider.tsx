import { View, unstable_batchedUpdates as batchUpdates } from "react-native";
import { Button, Text } from "react-native-paper";

import { makePersistedAdapter } from "@livestore/adapter-expo";
// import { nanoid } from "@livestore/livestore";
import { LiveStoreProvider } from "@livestore/react";
import { makeCfSync } from "@livestore/sync-cf";
import { useState } from "react";
import { envVariables } from "../../env";

import { schema } from "../simple-schema";
import { LivestoreErrorScreen, LivestoreLoadingScreen } from "./LivestoreStatesScreens";

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
      renderLoading={(_) => <LivestoreLoadingScreen />}
      renderError={(error: any) => <LivestoreErrorScreen error={error.toString()} />}
      renderShutdown={() => {
        return (
          <View>
            <Text>LiveStore Shutdown</Text>
            <Button onPress={() => rerender({})}>Reload</Button>
          </View>
        );
      }}
      boot={(store) => {

      }}
      batchUpdates={batchUpdates}>
      {children}
    </LiveStoreProvider>
  );
}

