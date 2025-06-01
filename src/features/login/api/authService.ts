import { createCustomerApiRoot } from './password-flow-client';
import { useUserStore } from '@/common/store/user-store';
import { mapSdkAddresses } from '@/features/userPage/ui/Addresses/addresses-mapper';
import { AuthService } from '@/common/types/auth-types';

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const { email, getApiRoot } = useUserStore.getState();

  if (!email) {
    throw new Error('Not authenticated');
  }

  const apiRoot = getApiRoot() || createCustomerApiRoot(email, currentPassword);

  try {
    const me = await apiRoot.me().get().execute();
    await apiRoot
      .me()
      .password()
      .post({
        body: {
          version: me.body.version,
          currentPassword,
          newPassword,
        },
      })
      .execute();

    useUserStore.getState().updateUserInfo({ password: newPassword });
    sessionStorage.setItem('authPassword', newPassword);

    const newApiRoot = createCustomerApiRoot(email, newPassword);
    useUserStore.getState().setApiRoot(newApiRoot);
  } catch (error) {
    throw new Error('Failed to change password');
  }
};

export const createAuthService = (): AuthService => {
  return {
    async login(email, password, rememberMe = false) {
      const root = createCustomerApiRoot(email, password);
      const res = await root.me().get().execute();
      const customer = res.body;

      const user = {
        email: customer.email,
        password,
        firstName: customer.firstName ?? '',
        lastName: customer.lastName ?? '',
        dateOfBirth: customer.dateOfBirth ?? '',
        addresses: mapSdkAddresses(customer.addresses),
        defaultShippingAddress: customer.defaultShippingAddressId ?? '',
        defaultBillingAddress: customer.defaultBillingAddressId ?? '',
      };

      const store = useUserStore.getState();
      store.setApiRoot(root);
      store.setLoggedIn(user);

      if (rememberMe) {
        sessionStorage.setItem('authEmail', email);
        sessionStorage.setItem('authPassword', password);
      } else {
        sessionStorage.removeItem('authEmail');
        sessionStorage.removeItem('authPassword');
      }

      return user;
    },

    logout() {
      const store = useUserStore.getState();
      store.setApiRoot(null);
      store.setLoggedOut();
      sessionStorage.removeItem('authEmail');
      sessionStorage.removeItem('authPassword');
    },

    getApiRoot() {
      return useUserStore.getState().getApiRoot();
    },

    async restoreSession() {
      const email = sessionStorage.getItem('authEmail');
      const password = sessionStorage.getItem('authPassword');
      if (!email || !password) return null;

      try {
        const root = createCustomerApiRoot(email, password);
        const res = await root.me().get().execute();

        const customer = res.body;
        const user = {
          email: customer.email,
          password,
          firstName: customer.firstName ?? '',
          lastName: customer.lastName ?? '',
          dateOfBirth: customer.dateOfBirth ?? '',
          addresses: mapSdkAddresses(customer.addresses),
          defaultShippingAddress: customer.defaultShippingAddressId ?? '',
          defaultBillingAddress: customer.defaultBillingAddressId ?? '',
        };

        const store = useUserStore.getState();
        store.setApiRoot(root);
        store.setLoggedIn(user);

        return root;
      } catch {
        this.logout();
        return null;
      }
    },
  };
};

export const authService = createAuthService();
