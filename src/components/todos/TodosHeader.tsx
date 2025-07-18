import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

type TodosHeaderProps = {
  totalCount: number;
  completedCount: number;
  onClearCompleted: () => void;
};

export function TodosHeader({ totalCount, completedCount, onClearCompleted }: TodosHeaderProps) {
  const activeCount = totalCount - completedCount;
  
  return (
    <View style={styles.container}>
      <View style={styles.stats}>
        <Text variant="titleMedium">
          {activeCount} active, {completedCount} completed
        </Text>
      </View>
      {completedCount > 0 && (
        <Button 
          mode="text" 
          onPress={onClearCompleted}
          compact
        >
          Clear completed
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  stats: {
    flex: 1,
  },
});