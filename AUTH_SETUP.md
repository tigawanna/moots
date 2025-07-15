# Authentication Setup Guide

This project includes a complete authentication system using Appwrite with React Native, featuring:

## 🔐 Features

- **Email/Password Authentication**: Traditional signup and signin
- **Google OAuth**: Sign in with Google
- **Password Recovery**: Forgot password functionality
- **Email Verification**: Email verification system
- **Profile Management**: User profile with account information
- **Session Management**: Sign out from current device or all devices
- **Form Validation**: Zod schema validation with react-hook-form
- **Global Snackbar**: Centralized notification system
- **Type Safety**: Full TypeScript support with TanStack Query

## 📁 File Structure

```
src/
├── lib/
│   ├── appwrite/
│   │   └── client.ts              # Appwrite client configuration
│   ├── tanstack/
│   │   ├── client.ts              # TanStack Query client configuration
│   │   └── auth/
│   │       └── auth.ts            # Authentication mutations and queries
│   └── env.ts                     # Environment variables validation
├── app/
│   ├── (container)/
│   │   ├── signin.tsx             # Sign in screen
│   │   ├── signup.tsx             # Sign up screen
│   │   ├── reset-password.tsx     # Password reset screen
│   │   ├── verify-email.tsx       # Email verification screen
│   │   └── (protected)/
│   │       └── profile.tsx        # User profile screen
│   └── _layout.tsx                # Root layout with providers
├── components/
│   └── react-native-paper/
│       └── snackbar/
│           ├── global-snackbar-store.ts    # Global snackbar state
│           └── GlobalSnackbar.tsx          # Global snackbar component
└── store/
    └── settings-store.ts          # App settings store
```

## 🚀 Setup Instructions

### 1. Environment Configuration

1. Copy `.env.example` to `.env`
2. Fill in your Appwrite project details:

```env
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
```

### 2. Appwrite Configuration

#### Create Project
1. Go to [Appwrite Cloud Console](https://cloud.appwrite.io/)
2. Create a new project
3. Copy the project ID to your `.env` file

#### Configure Authentication
1. Go to **Auth** → **Settings**
2. Enable **Email/Password** authentication
3. Configure **Google OAuth**:
   - Enable Google provider
   - Add your OAuth credentials
   - Set redirect URLs for your app

#### Configure Platforms
1. Go to **Settings** → **Platforms**
2. Add your platform (iOS/Android/Web)
3. Set the appropriate bundle ID/package name

### 3. Deep Linking Setup

For password recovery and email verification to work properly, you need to configure deep linking:

#### Expo Configuration
In your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "scheme": "your-app-scheme",
    "platforms": ["ios", "android", "web"]
  }
}
```

#### Update URLs in Auth Functions
Update the URLs in the authentication functions to match your app's scheme:

```typescript
// In signin.tsx
successUrl: "your-app-scheme://auth/callback",
failureUrl: "your-app-scheme://auth/error",

// In password recovery
url: "your-app-scheme://auth/reset-password",

// In email verification
url: "your-app-scheme://auth/verify-email",
```

## 🔧 Available Functions

### Authentication Queries
- `viewerQueryOptions()` - Get current user
- `sessionQueryOptions()` - Get current session

### Authentication Mutations
- `signUpMutationOptions()` - Create new account
- `signInMutationOptions()` - Sign in with email/password
- `signOutMutationOptions()` - Sign out current session
- `signOutAllMutationOptions()` - Sign out all sessions
- `googleSignInMutationOptions()` - Google OAuth sign in
- `createPasswordRecoveryMutationOptions()` - Send password reset email
- `updatePasswordRecoveryMutationOptions()` - Reset password
- `createEmailVerificationMutationOptions()` - Send verification email
- `verifyEmailMutationOptions()` - Verify email
- `updateProfileMutationOptions()` - Update user profile

## 📱 Usage Examples

### Sign Up
```typescript
const signUpMutation = useMutation(signUpMutationOptions());

signUpMutation.mutate({
  name: "John Doe",
  email: "john@example.com",
  password: "secure123"
});
```

### Sign In
```typescript
const signInMutation = useMutation(signInMutationOptions());

signInMutation.mutate({
  email: "john@example.com",
  password: "secure123"
});
```

### Get Current User
```typescript
const { data: user, isLoading } = useQuery(viewerQueryOptions());
```

### Global Snackbar
```typescript
const { showSnackbar } = useSnackbar();

showSnackbar("Success message!", {
  duration: 5000,
  action: {
    label: "UNDO",
    onPress: () => console.log("Undo pressed")
  }
});
```

## 🛠️ Customization

### Adding New OAuth Providers
1. Enable the provider in Appwrite console
2. Add the provider to `googleSignInMutationOptions()` or create a new mutation
3. Update the UI to include the new provider button

### Customizing Validation
Update the Zod schemas in each form component to match your requirements:

```typescript
const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  // Add more fields as needed
});
```

### Styling
All components use React Native Paper for consistent Material Design styling. Customize the theme in your app's theme configuration.

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` files to version control
2. **Deep Links**: Validate all deep link parameters
3. **Session Management**: Implement proper session timeout handling
4. **Error Handling**: Don't expose sensitive error details to users
5. **Form Validation**: Always validate on both client and server side

## 🐛 Troubleshooting

### Common Issues

1. **OAuth not working**: Check your redirect URLs in Appwrite console
2. **Email verification failing**: Ensure your app can handle deep links
3. **User not found**: Check if the user exists in Appwrite console
4. **Session expired**: Implement proper session refresh logic

### Debug Tips

1. Enable debug logging in development
2. Check Appwrite console logs for detailed error messages
3. Use React Query devtools for query debugging
4. Test deep links with development URLs first

## 📚 Documentation

- [Appwrite Authentication Docs](https://appwrite.io/docs/authentication)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
