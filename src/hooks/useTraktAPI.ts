import { useTraktStore } from "@/store/trakt-store";
import { useCallback } from "react";

/**
 * Hook for making authenticated Trakt API requests with loading states
 * This hook handles token validation, refresh, and provides loading indicators
 */
export const useTraktAPI = () => {
  const { isTokensPresent, tokens, isValidatingTokens } = useTraktStore();

  const makeAuthenticatedRequest = useCallback(async (apiCall: () => Promise<any>) => {
    // Check if tokens are present and valid (will auto-refresh if needed)
    const hasValidTokens = await isTokensPresent();
    
    if (!hasValidTokens) {
      throw new Error("No valid tokens available. Please login again.");
    }

    // Proceed with the API call
    return await apiCall();
  }, [isTokensPresent]);

  const getTraktHeaders = useCallback(async () => {
    const hasValidTokens = await isTokensPresent();
    
    if (!hasValidTokens || !tokens?.accessToken) {
      throw new Error("No valid access token available");
    }

    return {
      'Authorization': `Bearer ${tokens.accessToken}`,
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': process.env.EXPO_PUBLIC_TRAKT_CLIENT_ID,
    };
  }, [isTokensPresent, tokens]);

  return {
    makeAuthenticatedRequest,
    getTraktHeaders,
    isTokensPresent,
    isValidatingTokens, // Expose loading state for UI components
  };
};
