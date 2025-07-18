import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = {
  id: string;
  username: string;
  email?: string;
};

type UserStoreType = {
  user: User | null;
  
  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
};

export const useLocalUserStore = create<UserStoreType>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      
      // Actions
      setUser: (user) => 
        set({ user }),
      
      updateUser: (updates) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        })),
      
      clearUser: () => 
        set({ user: null})
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the user data and auth state
      partialize: (state) => ({
        user: state.user
      }),
    }
  )
);




