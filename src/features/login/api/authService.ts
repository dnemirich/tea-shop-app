import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { createCustomerApiRoot } from './password-flow-client';

type AuthService = {
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<ByProjectKeyRequestBuilder>;
  logout: () => void;
  getCurrentUser: () => { email: string; apiRoot: ByProjectKeyRequestBuilder } | null;
  restoreSession: () => Promise<ByProjectKeyRequestBuilder | null>;
};

export const createAuthService = (): AuthService => {
  let currentUser: { email: string; apiRoot: ByProjectKeyRequestBuilder } | null = null;

  return {
    async login(email, password, rememberMe = false) {
      if (currentUser?.email === email) {
        return currentUser.apiRoot;
      }

      const apiRoot = createCustomerApiRoot(email, password);
      await apiRoot.me().get().execute();

      currentUser = { email, apiRoot };
      if (rememberMe) {
        sessionStorage.setItem('authEmail', email);
      } else {
        sessionStorage.removeItem('authEmail');
      }

      return apiRoot;
    },

    logout() {
      currentUser = null;
      sessionStorage.removeItem('authEmail');
    },

    getCurrentUser() {
      return currentUser;
    },

    async restoreSession() {
      const email = sessionStorage.getItem('authEmail');
      if (!email) return null;

      try {
        const apiRoot = createCustomerApiRoot(email, '');
        await apiRoot.me().get().execute();
        currentUser = { email, apiRoot };
        return apiRoot;
      } catch {
        this.logout();
        return null;
      }
    },
  };
};

export const authService = createAuthService();
