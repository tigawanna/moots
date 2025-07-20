# Store Architecture

This app uses a modular store architecture with Zustand for state management:

## Stores

### 1. TraktStore (`/src/store/trakt-store.ts`)
Manages Trakt authentication tokens and API rate limits.

**State:**
- `tokens`: Trakt access and refresh tokens with expiry
- `rateLimits`: API rate limits from Trakt
- `isAuthenticated`: Authentication status

**Actions:**
- `login()`: Store tokens and rate limits
- `logout()`: Clear all auth data
- `setTokens()`: Update tokens
- `refreshTokenIfNeeded()`: Handle token refresh (TODO: implement)

### 2. UserInfoStore (`/src/store/user-info-store.ts`)
Manages user profile information for UI display.

**State:**
- `userInfo`: User profile data (username, name, avatar, etc.)

**Actions:**
- `setFromTraktUser()`: Convert Trakt user data to app format
- `updateUserInfo()`: Update profile info
- `clearUserInfo()`: Clear user data

### 3. SettingsStore (`/src/store/settings-store.ts`)
Manages app settings and preferences.

**State:**
- `theme`: Dark/light theme preference
- `dynamicColors`: Dynamic color setting
- `localBackupPath`: Backup directory
- `lastBackup`: Last backup timestamp

### 4. AuthUtils (`/src/store/auth-utils.ts`)
Provides unified authentication helpers.

**Hooks:**
- `useLogout()`: Clears all auth-related stores
- `useAuthState()`: Provides overall auth status

## Migration from Legacy User Store

The old `user-store.ts` has been refactored into:
- **TraktStore**: For authentication tokens and API limits
- **UserInfoStore**: For user profile display data
- **AuthUtils**: For unified auth operations

This separation allows better:
- Token management and refresh logic
- User profile updates without affecting auth
- Clear separation of concerns
- More granular state updates
