import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { createCustomerApiRoot } from './password-flow-client';
import { useUserStore } from '@/common/store/user-store';
import { Address } from '@/common/types/user-types';
import { mapSdkAddresses } from '@/features/userPage/ui/Addresses/addresses-mapper';

type UserInfo = {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Address[];
};

export type AuthService = {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<UserInfo>;
  logout: () => void;
  getApiRoot: () => ByProjectKeyRequestBuilder | null;
  restoreSession: () => Promise<ByProjectKeyRequestBuilder | null>;
};

export const createAuthService = (): AuthService => {
  let apiRoot: ByProjectKeyRequestBuilder | null = null;
  const { setLoggedIn, setLoggedOut } = useUserStore.getState();

  return {
    async login(email, password, rememberMe = false) {
      const root = createCustomerApiRoot(email, password);

      const res = await root.me().get().execute();
      const customer = res.body;

      const user = {
        email: customer.email,
        firstName: customer.firstName ?? '',
        lastName: customer.lastName ?? '',
        dateOfBirth: customer.dateOfBirth ?? '',
        addresses: mapSdkAddresses(customer.addresses),
      };

      apiRoot = root;
      setLoggedIn(user);

      if (rememberMe) {
        sessionStorage.setItem('authEmail', email);
      } else {
        sessionStorage.removeItem('authEmail');
      }

      return user;
    },

    logout() {
      apiRoot = null;
      setLoggedOut();
      sessionStorage.removeItem('authEmail');
    },

    getApiRoot() {
      return apiRoot;
    },

    async restoreSession() {
      const email = sessionStorage.getItem('authEmail');
      if (!email) return null;

      try {
        const root = createCustomerApiRoot(email, '');
        const res = await root.me().get().execute();

        apiRoot = root;

        const customer = res.body;
        const user = {
          email: customer.email,
          firstName: customer.firstName ?? '',
          lastName: customer.lastName ?? '',
          dateOfBirth: customer.dateOfBirth ?? '',
          addresses: mapSdkAddresses(customer.addresses),
        };

        setLoggedIn(user);
        return root;
      } catch {
        this.logout();
        return null;
      }
    },
  };
};

export const authService = createAuthService();
