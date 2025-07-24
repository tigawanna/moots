import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import { useTraktAPI } from "@/hooks/useTraktAPI";
import { useAuthState } from "@/store/auth-utils";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

/**
 * Example component showing how to handle token validation loading states
 */
export function TraktAPIExample() {
  const { colors } = useTheme();
  const { isAuthenticated, isValidatingTokens } = useAuthState();
  const { makeAuthenticatedRequest } = useTraktAPI();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlist = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await makeAuthenticatedRequest(async () => {
        // Simulate API call - token validation handled automatically by makeAuthenticatedRequest
        const response = await fetch('https://api.trakt.tv/sync/watchlist', {
          headers: {
            'Content-Type': 'application/json',
            'trakt-api-version': '2',
            // Authorization header will be added by getTraktHeaders()
          }
        });
        return response.json();
      });
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={{ padding: 16 }}>
        <Text variant="bodyLarge">Please login to continue</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Text variant="headlineSmall">Trakt API Example</Text>
      
      {/* Show token validation loading */}
      {isValidatingTokens && (
        <View style={{ alignItems: "center", padding: 16 }}>
          <LoadingIndicatorDots />
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, marginTop: 8 }}>
            Validating tokens...
          </Text>
        </View>
      )}
      
      {/* API call button - disabled during token validation */}
      <Button 
        mode="contained" 
        onPress={fetchWatchlist}
        disabled={isValidatingTokens || isLoading}
        loading={isLoading}
      >
        {isLoading ? "Loading Watchlist..." : "Fetch Watchlist"}
      </Button>
      
      {/* Error display */}
      {error && (
        <Text variant="bodyMedium" style={{ color: colors.error }}>
          Error: {error}
        </Text>
      )}
      
      {/* Data display */}
      {data && (
        <View>
          <Text variant="titleMedium">Watchlist Data:</Text>
          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            {JSON.stringify(data, null, 2)}
          </Text>
        </View>
      )}
    </View>
  );
}
