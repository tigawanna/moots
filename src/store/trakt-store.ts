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
  
  // Actions
  setTokens: (tokens: TraktTokens) => void;
  updateTokens: (updates: Partial<TraktTokens>) => void;
  setRateLimits: (limits: Limits) => void;
  clearAuth: () => void;
  login: (tokens: TraktTokens, rateLimits?: Limits) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
  refreshTokenIfNeeded: () => Promise<boolean>;
};

export const useTraktStore = create<TraktStoreType>()(
  persist(
    (set, get) => ({
      // State
      tokens: null,
      rateLimits: null,
      isAuthenticated: false,

      // Actions
      setTokens: (tokens) => set({ tokens, isAuthenticated: true }),

      updateTokens: (updates) =>
        set((state) => ({
          tokens: state.tokens ? { ...state.tokens, ...updates } : null,
        })),

      setRateLimits: (rateLimits) => set({ rateLimits }),

      clearAuth: () => set({ tokens: null, rateLimits: null, isAuthenticated: false }),

      login: (tokens, rateLimits) => set({ 
        tokens, 
        rateLimits: rateLimits || null, 
        isAuthenticated: true 
      }),

      logout: () => set({ tokens: null, rateLimits: null, isAuthenticated: false }),

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
    }),
    {
      name: "trakt-store",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the tokens, rate limits, and auth state
      partialize: (state) => ({
        tokens: state.tokens,
        rateLimits: state.rateLimits,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);




