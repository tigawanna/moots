import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, TextInput } from 'react-native-paper';

type AddTodoInputProps = {
  onAdd: (text: string) => void;
};

export function AddTodoInput({ onAdd }: AddTodoInputProps) {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Add a new todo..."
        mode="outlined"
        onSubmitEditing={handleAdd}
        returnKeyType="done"
      />
      <IconButton
        icon="plus"
        size={24}
        onPress={handleAdd}
        disabled={!text.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
});