import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Address } from '../types/user-types';

type UserState = {
  isLoggedIn: boolean;
  email: string | null;
  password: string | null;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  addresses: Address[] | null;
  defaultShippingAddress: string | null;
  defaultBillingAddress: string | null;

  setLoggedIn: (user: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    addresses: Address[];
    defaultShippingAddress: string;
    defaultBillingAddress: string;
  }) => void;
  setLoggedOut: () => void;

  updateUserInfo: (
    data: Partial<Omit<UserState, 'setLoggedIn' | 'setLoggedOut' | 'updateUserInfo'>>,
  ) => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      email: null,
      password: null,
      firstName: null,
      lastName: null,
      dateOfBirth: null,
      addresses: null,
      defaultShippingAddress: null,
      defaultBillingAddress: null,
      setLoggedIn: ({
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        addresses,
        defaultShippingAddress,
        defaultBillingAddress,
      }) =>
        set({
          isLoggedIn: true,
          email,
          password,
          firstName,
          lastName,
          dateOfBirth,
          addresses,
          defaultShippingAddress,
          defaultBillingAddress,
        }),
      setLoggedOut: () =>
        set({
          isLoggedIn: false,
          email: null,
          password: null,
          firstName: null,
          lastName: null,
          dateOfBirth: null,
          addresses: null,
          defaultShippingAddress: null,
          defaultBillingAddress: null,
        }),

      updateUserInfo: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
