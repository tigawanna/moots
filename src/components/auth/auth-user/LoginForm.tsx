import { signinMutationOption } from '@/lib/tanstack/operations/user';
import { useMutation } from '@tanstack/react-query';
import { StyleSheet, View } from 'react-native'
import { Text,Surface } from 'react-native-paper';
 
export function LoginForm(){
const mutation = useMutation(signinMutationOption());
return (
<View style={{ ...styles.container }}>
    <Text variant='titleLarge'>LoginForm</Text>
</View>
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
