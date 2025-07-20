# Store Architecture

This app uses a modular store architecture with Zustand for state management:

## Stores

### 1. TraktStore (`/src/store/trakt-store.ts`)
Manages Trakt authentication tokens and API rate limits.

**State:**
- `tokens`: Trakt access and refresh tokens with expiry
- `rateLimits`: API rate limits from Trakt
- `isAuthenticated`: Authentication status
- `isValidatingTokens`: Loading state during token validation/refresh

**Actions:**
- `login()`: Store tokens and rate limits
- `logout()`: Clear all auth data
- `setTokens()`: Update tokens
- `refreshTokenIfNeeded()`: Handle token refresh (TODO: implement)
- `isTokensPresent()`: **Streamlined token validation with auto-refresh**

**Token Validation Flow (`isTokensPresent`):**
1. **Both tokens exist & not expired** → Return `true`
2. **Access token expired but refresh token exists** → Try refresh → Return result
3. **No access token but refresh token exists** → Try refresh → Return result
4. **No tokens at all** → Return `false`
5. **Only access token exists** → Check if expired → Return result

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

## Usage Examples

### Making Authenticated API Calls with Loading States
```typescript
import { useTraktAPI } from "@/hooks/useTraktAPI";
import { useAuthState } from "@/store/auth-utils";

const { makeAuthenticatedRequest, isValidatingTokens } = useTraktAPI();
const { isAuthenticated } = useAuthState();

// Show loading indicator during token validation
if (isValidatingTokens) {
  return <LoadingIndicator text="Validating tokens..." />;
}

// Example API call with automatic token validation
const fetchWatchlist = async () => {
  return await makeAuthenticatedRequest(async () => {
    const headers = await getTraktHeaders();
    return fetch('https://api.trakt.tv/sync/watchlist', { headers });
  });
};
```

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
