// import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
// import { createCustomerApiRoot } from './password-flow-client';
//
//
// type AuthService = {
//   login: (
//     email: string,
//     password: string,
//     rememberMe?: boolean,
//   ) => Promise<ByProjectKeyRequestBuilder>;
//   logout: () => void;
//   getCurrentUser: () => { email: string; apiRoot: ByProjectKeyRequestBuilder } | null;
//   restoreSession: () => Promise<ByProjectKeyRequestBuilder | null>;
//   checkAuth: () => Promise<boolean>;
// };
//
// export const createAuthService = (): AuthService => {
//   let currentUser: { email: string; apiRoot: ByProjectKeyRequestBuilder } | null = null;
//
//   return {
//     async login(email, password, rememberMe = false) {
//       if (currentUser?.email === email) {
//         return currentUser.apiRoot;
//       }
//
//       const apiRoot = createCustomerApiRoot(email, password);
//       await apiRoot.me().get().execute();
//
//       currentUser = { email, apiRoot };
//       if (rememberMe) {
//         sessionStorage.setItem('authEmail', email);
//       } else {
//         sessionStorage.removeItem('authEmail');
//       }
//
//       return apiRoot;
//     },
//
//     logout() {
//       currentUser = null;
//       sessionStorage.removeItem('authEmail');
//     },
//
//     getCurrentUser() {
//       return currentUser;
//     },
//
//     async restoreSession() {
//       const email = sessionStorage.getItem('authEmail');
//       if (!email) return null;
//
//       try {
//         const apiRoot = createCustomerApiRoot(email, '');
//         await apiRoot.me().get().execute();
//         currentUser = { email, apiRoot };
//         return apiRoot;
//       } catch {
//         this.logout();
//         return null;
//       }
//     },
//
//     async checkAuth() {
//       if (this.getCurrentUser()) return true;
//
//       try {
//         const apiRoot = await this.restoreSession();
//         return !!apiRoot;
//       } catch {
//         return false;
//       }
//     },
//   };
// };
//
// export const authService = createAuthService();

import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { createCustomerApiRoot } from './password-flow-client';
import { useUserStore } from '@/common/store/user-store';

export type AuthService = {
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<ByProjectKeyRequestBuilder>;
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
      await root.me().get().execute();

      apiRoot = root;
      setLoggedIn(email);

      if (rememberMe) {
        sessionStorage.setItem('authEmail', email);
      } else {
        sessionStorage.removeItem('authEmail');
      }

      return root;
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
        await root.me().get().execute();

        apiRoot = root;
        setLoggedIn(email);
        return root;
      } catch {
        this.logout();
        return null;
      }
    },
  };
};

export const authService = createAuthService();
