import { StyleSheet } from 'react-native'
import { Text,Surface } from 'react-native-paper';
 
export function TestQueryFilters(){
return (
<Surface style={{ ...styles.container }}>
    <Text variant='titleLarge'>TestQueryFilters</Text>
</Surface>
);
}
const styles = StyleSheet.create({
container:{
  flex:1,
  height:'100%',
   width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}
})


//   // Use LiveStore reactive queries with useQuery hook
//   const uiState = useQuery(uiState$);
//   const visibleTodos = useQuery(visibleTodos$);
//   const activeTodosCount = useQuery(activeTodosCount$);
//   const completedTodosCount = useQuery(completedTodosCount$);
//   const totalTodosCount = useQuery(totalTodosCount$);

//   const inputRef = React.useRef<any>(null);

//   // Get the current UI state value (client documents return an array)
//   const currentUiState = uiState?.[0]?.value || { newTodoText: "", filter: "all" };

//   const updatedNewTodoText = (text: string) => {
//     store.commit(events.uiStateSet({ newTodoText: text }));
//   };

//   const todoCreated = () => {
//     const todoText = currentUiState.newTodoText?.trim();
//     if (!todoText) return;

//     store.commit(
//       events.todoCreated({ id: nanoid(), text: todoText }),
//       events.uiStateSet({ newTodoText: "" })
//     );
//   };

//   const addRandom50 = () => {
//     const todoEvents = Array.from({ length: 50 }, (_, i) =>
//       events.todoCreated({ id: nanoid(), text: `Random Todo ${i + 1}` })
//     );
//     store.commit(...todoEvents);
//   };

//   const reset = () => {
//     store.commit(events.todoClearedCompleted({ deletedAt: new Date() }));
//   };

//   const toggleTodo = (id: string, completed: boolean) => {
//     const event = completed ? events.todoUncompleted({ id }) : events.todoCompleted({ id });
//     store.commit(event);
//   };

//   const deleteTodo = (id: string) => {
//     store.commit(events.todoDeleted({ id, deletedAt: new Date() }));
//   };

//   const setFilter = (filter: "all" | "active" | "completed") => {
//     store.commit(events.uiStateSet({ filter }));
//   };
