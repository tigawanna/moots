import React from "react";
import { StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";

import { TestQueryList } from "./TestQueryList";

export function TestQueryScreen() {
  return (
    <Surface style={styles.container}>
      <Text variant="titleLarge">TestQueryFilters</Text>
      <TestQueryList />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  scrollContent: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  todoContainer: {
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
  },
  inputCard: {
    width: "100%",
    marginBottom: 16,
  },
  filterCard: {
    width: "100%",
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  input: {
    width: "100%",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    minWidth: 80,
  },
  todoList: {
    width: "100%",
    height: 400,
  },
  emptyState: {
    padding: 20,
  },
});
