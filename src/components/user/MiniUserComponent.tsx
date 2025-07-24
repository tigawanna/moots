import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';

interface MiniUserComponentProps {
  user: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
}

export function MiniUserComponent({
  user,
  subtitle,
  onPress,
  rightComponent
}: MiniUserComponentProps) {
  const theme = useTheme();

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.avatarContainer}>
        {user.profilePicture ? (
          <Avatar.Image 
            size={40} 
            source={{ uri: user.profilePicture }} 
          />
        ) : (
          <Avatar.Text 
            size={40} 
            label={getInitials(user.username)} 
          />
        )}
      </View>
      
      <View style={styles.textContainer}>
        <Text variant="bodyLarge" style={styles.username}>
          {user.username}
        </Text>
        {subtitle && (
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightComponent && (
        <View style={styles.rightComponent}>
          {rightComponent}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    width: '100%',
  },
  avatarContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  username: {
    fontWeight: '500',
  },
  rightComponent: {
    marginLeft: 8,
  }
});