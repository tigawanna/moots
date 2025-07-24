import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Avatar, Button, Divider, Surface, Text, useTheme } from 'react-native-paper';

interface UserProfileProps {
  user?: {
    id: string;
    username: string;
    email: string;
    profilePicture?: string;
    bio?: string;
    interests?: string[];
    isPublic: boolean;
    followersCount: number;
    followingCount: number;
    listsCount: number;
    createdAt: number;
  };
  isCurrentUser?: boolean;
  isFollowing?: boolean;
  isLoading?: boolean;
  onFollowPress?: () => void;
  onEditProfilePress?: () => void;
  onViewListsPress?: () => void;
}

export function UserProfile({
  user,
  isCurrentUser = false,
  isFollowing = false,
  isLoading = false,
  onFollowPress,
  onEditProfilePress,
  onViewListsPress
}: UserProfileProps) {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Surface style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </Surface>
    );
  }

  if (!user) {
    return (
      <Surface style={styles.container}>
        <Text>User not found</Text>
      </Surface>
    );
  }

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <Surface style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          {user.profilePicture ? (
            <Avatar.Image 
              size={80} 
              source={{ uri: user.profilePicture }} 
            />
          ) : (
            <Avatar.Text 
              size={80} 
              label={getInitials(user.username)} 
            />
          )}
          
          <Text variant="headlineMedium" style={styles.username}>
            {user.username}
          </Text>
          
          {user.bio && (
            <Text style={styles.bio}>{user.bio}</Text>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text variant="titleLarge">{user.listsCount}</Text>
            <Text>Lists</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="titleLarge">{user.followersCount}</Text>
            <Text>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="titleLarge">{user.followingCount}</Text>
            <Text>Following</Text>
          </View>
        </View>

        {user.interests && user.interests.length > 0 && (
          <View style={styles.interestsContainer}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestTags}>
              {user.interests.map((interest, index) => (
                <View key={index} style={[styles.interestTag, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Text style={{ color: theme.colors.onPrimaryContainer }}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Divider style={styles.divider} />

        <View style={styles.actionsContainer}>
          {isCurrentUser ? (
            <Button 
              mode="contained" 
              onPress={onEditProfilePress}
              style={styles.actionButton}
            >
              Edit Profile
            </Button>
          ) : (
            <Button 
              mode={isFollowing ? "outlined" : "contained"} 
              onPress={onFollowPress}
              style={styles.actionButton}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
          
          <Button 
            mode="outlined" 
            onPress={onViewListsPress}
            style={styles.actionButton}
          >
            View Lists
          </Button>
        </View>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  username: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  bio: {
    marginTop: 8,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  interestsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  divider: {
    marginBottom: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  }
});