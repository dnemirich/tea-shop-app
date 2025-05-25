import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type UserState = {
  isLoggedIn: boolean;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  setLoggedIn: (user: { email: string; firstName: string; lastName: string }) => void;
  setLoggedOut: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      email: null,
      firstName: null,
      lastName: null,
      setLoggedIn: ({ email, firstName, lastName }) =>
        set({ isLoggedIn: true, email, firstName, lastName }),
      setLoggedOut: () => set({ isLoggedIn: false, email: null, firstName: null, lastName: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
