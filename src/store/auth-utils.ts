import { useTraktStore } from "./trakt-store";
import { useUserInfoStore } from "./user-info-store";

/**
 * Hook that provides a unified logout function that clears all auth-related stores
 */
export const useLogout = () => {
  const { logout: logoutTraktStore } = useTraktStore();
  const { clearUserInfo } = useUserInfoStore();

  const logout = () => {
    // Clear Trakt tokens and rate limits
    logoutTraktStore();
    
    // Clear user information
    clearUserInfo();
    
    console.log("User logged out successfully");
  };

  return { logout };
};

/**
 * Hook that provides the overall authentication state
 */
export const useAuthState = () => {
  const { isAuthenticated, tokens, isValidatingTokens,isTokensPresent } = useTraktStore();
  const { userInfo } = useUserInfoStore();

  return {
    isAuthenticated,
    hasTokens: Boolean(tokens?.accessToken),
    userInfo,
    isTokenExpired: useTraktStore().isTokenExpired(),
    isValidatingTokens,
    isTokensPresent,
  };
};
