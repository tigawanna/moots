import { Snackbar } from 'react-native-paper';
import { useSnackbar } from './global-snackbar-store';
 
export function GlobalSnackbar(){
  const { visible, message, duration, action, hideSnackbar } = useSnackbar();
return (
  <Snackbar
    visible={visible}
    onDismiss={hideSnackbar}
    duration={duration}
 
    action={action}>
    {message}
  </Snackbar>
);
}

