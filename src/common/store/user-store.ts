import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Address } from '../types/user-types';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

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

  apiRoot: ByProjectKeyRequestBuilder | null;
  setApiRoot: (api: ByProjectKeyRequestBuilder | null) => void;
  getApiRoot: () => ByProjectKeyRequestBuilder | null;

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
    (set, get) => ({
      isLoggedIn: false,
      email: null,
      password: null,
      firstName: null,
      lastName: null,
      dateOfBirth: null,
      addresses: null,
      defaultShippingAddress: null,
      defaultBillingAddress: null,
      apiRoot: null,

      setApiRoot: (api) => set(() => ({ apiRoot: api })),
      getApiRoot: () => get().apiRoot,

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
          apiRoot: null,
        }),

      updateUserInfo: (data) => set((state) => ({ ...state, ...data })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) =>
        Object.fromEntries(Object.entries(state).filter(([key]) => !['apiRoot'].includes(key))),
    },
  ),
);
