import { viewerQueryOptions } from '@/lib/tanstack/operations/user';
import { useQuery } from '@tanstack/react-query';
import { StyleSheet } from 'react-native'
import { Text,Surface } from 'react-native-paper';
 
export function HomeScreenComponent(){
  const { data, isPending } = useQuery(viewerQueryOptions());
return (
<Surface style={{ ...styles.container }}>
    <Text variant='titleLarge'>HomeScreenComponent</Text>
    <Text variant='bodyLarge'>{data?.email}</Text>
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
  gap: 10,
}
})
