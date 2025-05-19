import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type UserState = {
  isLoggedIn: boolean;
  email: string | null;
  setLoggedIn: (email: string) => void;
  setLoggedOut: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      email: null,
      setLoggedIn: (email) => set({ isLoggedIn: true, email }),
      setLoggedOut: () => set({ isLoggedIn: false, email: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
