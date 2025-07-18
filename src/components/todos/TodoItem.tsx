import { TodoColumnType } from '@/lib/livestore/simple-schema';
import { StyleSheet } from 'react-native';
import { Card, Checkbox, IconButton, Text } from 'react-native-paper';


type TodoItemProps = {
  todo: TodoColumnType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content style={styles.content}>
        <Checkbox
          status={todo.completed ? 'checked' : 'unchecked'}
          onPress={() => onToggle(todo.id)}
        />
        <Text 
          variant="bodyLarge" 
          style={[
            styles.text,
            todo.completed && styles.completedText
          ]}
        >
          {todo.text}
        </Text>
        <IconButton
          icon="delete"
          size={20}
          onPress={() => onDelete(todo.id)}
        />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  text: {
    flex: 1,
    marginLeft: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
});
