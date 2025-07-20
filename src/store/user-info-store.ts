import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User as TraktUser } from "../lib/pb/types/trakt-meta-types";

type UserInfo = {
  id: string;
  username: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  isPrivate?: boolean;
  vip?: boolean;
  joinedAt?: string;
};

type UserInfoStoreType = {
  userInfo: UserInfo | null;
  
  // Actions
  setUserInfo: (userInfo: UserInfo) => void;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
  clearUserInfo: () => void;
  setFromTraktUser: (traktUser: TraktUser, email?: string) => void;
};

export const useUserInfoStore = create<UserInfoStoreType>()(
  persist(
    (set) => ({
      // State
      userInfo: null,

      // Actions
      setUserInfo: (userInfo) => set({ userInfo }),

      updateUserInfo: (updates) =>
        set((state) => ({
          userInfo: state.userInfo ? { ...state.userInfo, ...updates } : null,
        })),

      clearUserInfo: () => set({ userInfo: null }),

      setFromTraktUser: (traktUser, email) => {
        const userInfo: UserInfo = {
          id: traktUser.ids.uuid,
          username: traktUser.username,
          name: traktUser.name,
          email: email,
          avatarUrl: traktUser.images?.avatar?.full,
          isPrivate: traktUser.private,
          vip: traktUser.vip,
          joinedAt: traktUser.joined_at,
        };
        set({ userInfo });
      },
    }),
    {
      name: "user-info-store",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the user info
      partialize: (state) => ({
        userInfo: state.userInfo,
      }),
    }
  )
);
