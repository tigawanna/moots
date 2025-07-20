import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Limits } from "../lib/pb/types/trakt-meta-types";

type TraktTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number; // Unix timestamp
};

type TraktStoreType = {
  tokens: TraktTokens | null;
  rateLimits: Limits | null;
  isAuthenticated: boolean;
  isValidatingTokens: boolean;

  // Actions
  setTokens: (tokens: TraktTokens) => void;
  updateTokens: (updates: Partial<TraktTokens>) => void;
  setRateLimits: (limits: Limits) => void;
  clearAuth: () => void;
  login: (tokens: TraktTokens, rateLimits?: Limits) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
  refreshTokenIfNeeded: () => Promise<boolean>;
  isTokensPresent: () => Promise<boolean>;
};

export const useTraktStore = create<TraktStoreType>()(
  persist(
    (set, get) => ({
      // State
      tokens: null,
      rateLimits: null,
      isAuthenticated: false,
      isValidatingTokens: false,

      // Actions
      setTokens: (tokens) => set({ tokens, isAuthenticated: true }),

      updateTokens: (updates) =>
        set((state) => ({
          tokens: state.tokens ? { ...state.tokens, ...updates } : null,
        })),

      setRateLimits: (rateLimits) => set({ rateLimits }),

      clearAuth: () => set({ tokens: null, rateLimits: null, isAuthenticated: false, isValidatingTokens: false }),

      login: (tokens, rateLimits) =>
        set({
          tokens,
          rateLimits: rateLimits || null,
          isAuthenticated: true,
        }),

      logout: () => set({ tokens: null, rateLimits: null, isAuthenticated: false, isValidatingTokens: false }),

      isTokenExpired: () => {
        const state = get();
        if (!state.tokens?.expiresAt) return false;
        return Date.now() >= state.tokens.expiresAt;
      },

      refreshTokenIfNeeded: async () => {
        const state = get();
        if (!state.tokens || !state.isTokenExpired()) return true;

        try {
          // TODO: Implement token refresh logic with Trakt API
          // This is a placeholder for the actual refresh implementation
          console.warn("Token refresh not implemented yet");
          return false;
        } catch (error) {
          console.error("Failed to refresh token:", error);
          state.logout();
          return false;
        }
      },

      isTokensPresent: async () => {
        const state = get();
        const tokens = state.tokens;

        // Set loading state
        set({ isValidatingTokens: true });

        try {
          // Case 1: Both tokens exist and access token is not expired - return true
          if (tokens?.accessToken && tokens?.refreshToken && !state.isTokenExpired()) {
            return true;
          }

          // Case 2: Access token expired but refresh token exists - try to refresh
          if (tokens?.refreshToken && state.isTokenExpired()) {
            return await state.refreshTokenIfNeeded();
          }

          // Case 3: No access token but refresh token exists - try to refresh
          if (!tokens?.accessToken && tokens?.refreshToken) {
            return await state.refreshTokenIfNeeded();
          }

          // Case 4: No tokens at all - return false
          if (!tokens?.accessToken && !tokens?.refreshToken) {
            return false;
          }

          // Case 5: Only access token exists (no refresh token) - check if expired
          if (tokens?.accessToken && !tokens?.refreshToken) {
            return !state.isTokenExpired();
          }

          return false;
        } finally {
          // Always clear loading state
          set({ isValidatingTokens: false });
        }
      },
    }),
    {
      name: "trakt-store",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the tokens, rate limits, and auth state (not loading states)
      partialize: (state) => ({
        tokens: state.tokens,
        rateLimits: state.rateLimits,
        isAuthenticated: state.isAuthenticated,
        // Don't persist isValidatingTokens as it's a transient state
      }),
    }
  )
);
