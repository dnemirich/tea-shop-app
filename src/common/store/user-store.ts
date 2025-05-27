import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Address } from '../types/user-types';

type UserState = {
  isLoggedIn: boolean;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  addresses: Address[] | null;
  setLoggedIn: (user: {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    addresses: Address[];
  }) => void;
  setLoggedOut: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      email: null,
      firstName: null,
      lastName: null,
      dateOfBirth: null,
      addresses: null,
      setLoggedIn: ({ email, firstName, lastName, dateOfBirth, addresses }) =>
        set({ isLoggedIn: true, email, firstName, lastName, dateOfBirth, addresses }),
      setLoggedOut: () =>
        set({
          isLoggedIn: false,
          email: null,
          firstName: null,
          lastName: null,
          dateOfBirth: null,
          addresses: null,
        }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
