import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button, Surface, Switch, Text, TextInput, useTheme } from 'react-native-paper';
import { z } from 'zod';

// Define validation schema using zod
const updateProfileSchema = z.object({
  profilePicture: z.string().optional(),
  bio: z.string().max(200, "Bio must be 200 characters or less").optional(),
  interests: z.string().optional(), // Will be split into array
  isPublic: z.boolean().default(true).optional(),
});

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

interface UpdateUserProfileFormProps {
  initialData?: {
    profilePicture?: string;
    bio?: string;
    interests?: string[];
    isPublic: boolean;
  };
  onSubmit?: (data: any) => void;
}

export function UpdateUserProfileForm({ 
  initialData = { isPublic: true },
  onSubmit: onSubmitProp 
}: UpdateUserProfileFormProps) {
  const theme = useTheme();
  const { control, handleSubmit, formState: { errors } } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      profilePicture: initialData.profilePicture || '',
      bio: initialData.bio || '',
      interests: initialData.interests?.join(', ') || '',
      isPublic: initialData.isPublic,
    }
  });

  const onSubmit = (data: UpdateProfileFormData) => {
    // Convert comma-separated interests to array
    const formattedData = {
      ...data,
      interests: data.interests ? data.interests.split(',').map(item => item.trim()) : []
    };
    
    console.log('Profile updated:', formattedData);
    if (onSubmitProp) {
      onSubmitProp(formattedData);
    }
    // Example: dispatch userEvents.userProfileUpdated event
  };

  return (
    <Surface style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Update Profile</Text>
      
      <View style={styles.form}>
        <Controller
          control={control}
          name="profilePicture"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Profile Picture URL"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={styles.input}
              error={!!errors.profilePicture}
              mode="outlined"
            />
          )}
        />
        {errors.profilePicture && (
          <Text style={{ color: theme.colors.error }}>{errors.profilePicture.message}</Text>
        )}

        <Controller
          control={control}
          name="bio"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Bio"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={styles.input}
              error={!!errors.bio}
              mode="outlined"
              multiline
              numberOfLines={4}
            />
          )}
        />
        {errors.bio && (
          <Text style={{ color: theme.colors.error }}>{errors.bio.message}</Text>
        )}

        <Controller
          control={control}
          name="interests"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Interests (comma separated)"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={styles.input}
              error={!!errors.interests}
              mode="outlined"
              placeholder="action, drama, sci-fi"
            />
          )}
        />
        {errors.interests && (
          <Text style={{ color: theme.colors.error }}>{errors.interests.message}</Text>
        )}

        <View style={styles.switchContainer}>
          <Text>Public Profile</Text>
          <Controller
            control={control}
            name="isPublic"
            render={({ field: { onChange, value } }) => (
              <Switch value={value} onValueChange={onChange} />
            )}
          />
        </View>

        <Button 
          mode="contained" 
          onPress={handleSubmit(onSubmit)} 
          style={styles.button}
        >
          Update Profile
        </Button>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
  }
});
