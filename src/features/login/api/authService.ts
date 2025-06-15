/*import { createCustomerApiRoot } from './password-flow-client';
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
*/

//мое

import { createCustomerApiRoot } from './password-flow-client';
import { useUserStore } from '@/common/store/user-store';
import { mapSdkAddresses } from '@/features/userPage/ui/Addresses/addresses-mapper';
import { AuthService } from '@/common/types/auth-types';
import { anonymousApiRoot } from './anonymous-client';
import { addLineItem } from '@/common/config/cart-api';

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
    async login(email: string, password: string, rememberMe = false) {
      try {
        const anonymousId = localStorage.getItem('anonymousId');
        let anonymousCart = null;

        //получаем анонимную корзину перед логином
        if (anonymousId) {
          try {
            const response = await anonymousApiRoot
              .carts()
              .get({ queryArgs: { where: `anonymousId="${anonymousId}"`, limit: 1 } })
              .execute();
            anonymousCart = response.body.results[0] ?? null;
          } catch (error) {
            console.error('Error fetching anonymous cart:', error);
          }
        }

        //выполняем логин с указанием стратегии мержа
        const loginResponse = await anonymousApiRoot
          .me()
          .login()
          .post({
            body: {
              email,
              password,
              activeCartSignInMode: 'MergeWithExistingCustomerCart',
              updateProductData: true,
            },
          })
          .execute();

        if (!loginResponse.body.customer) {
          throw new Error('Login failed');
        }

        const customer = loginResponse.body.customer;
        const apiRoot = createCustomerApiRoot(email, password);

        //получаем текущую корзину пользователя
        let customerCart = null;
        try {
          customerCart = await apiRoot
            .me()
            .activeCart()
            .get()
            .execute()
            .then((res) => res.body);
        } catch (error: any) {
          if (error.statusCode !== 404) {
            console.error('Error fetching customer cart:', error);
          }
        }

        //мерж корзин
        if (anonymousCart && anonymousCart?.lineItems?.length > 0) {
          //если у кастомера нет корзины присваиваем ему анонимную корзину
          if (!customerCart) {
            console.log('No customer cart found, converting anonymous cart');
            try {
              //обновляем корзину, устанавливаем customerId
              const updatedCart = await apiRoot
                .carts()
                .withId({ ID: anonymousCart.id })
                .post({
                  body: {
                    version: anonymousCart.version,
                    actions: [
                      {
                        action: 'setCustomerId',
                        customerId: customer.id,
                      },
                    ],
                  },
                })
                .execute();
              customerCart = updatedCart.body;
            } catch (error) {
              console.error('Failed to convert anonymous cart:', error);
            }
          }
          //если у пользователя есть корзина делаем мерж
          else {
            console.log('Starting cart merge');
            try {
              //добавляем товары из анонимной корзины
              for (const item of anonymousCart.lineItems) {
                const existingItem = customerCart.lineItems.find(
                  (li) => li.productId === item.productId && li.variant.id === item.variant.id,
                );

                if (!existingItem) {
                  try {
                    await addLineItem(
                      customerCart.id,
                      customerCart.version,
                      item.productId,
                      item.variant.id,
                      item.quantity,
                      item.custom?.fields?.selectedWeightVariant,
                      item.price?.value,
                    );
                    //обновляем версию корзины
                    customerCart = await apiRoot
                      .me()
                      .activeCart()
                      .get()
                      .execute()
                      .then((res) => res.body);
                  } catch (error) {
                    console.error(`Failed to merge item ${item.productId}:`, error);
                  }
                }
              }
            } catch (error) {
              console.error('Cart merge failed:', error);
            }

            //удаляем анонимную корзину после мержа
            try {
              await anonymousApiRoot
                .carts()
                .withId({ ID: anonymousCart.id })
                .delete({
                  queryArgs: {
                    version: anonymousCart.version,
                  },
                })
                .execute();
            } catch (error) {
              console.error('Failed to delete anonymous cart:', error);
            }
          }
        }

        //сохраняем сессию кастомера
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
        store.setApiRoot(apiRoot);
        store.setLoggedIn(user);

        if (rememberMe) {
          sessionStorage.setItem('authEmail', email);
          sessionStorage.setItem('authPassword', password);
        }

        return user;
      } catch (error) {
        console.error('Login error:', error);
        throw new Error('Login failed. Please check your credentials.');
      }
    },

    logout() {
      console.log('Logout');
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
      if (!email || !password) {
        return null;
      }

      try {
        const root = createCustomerApiRoot(email, password);
        const res = await root.me().get().execute();

        if (!res.body) {
          throw new Error('Empty response');
        }

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
      } catch (error) {
        console.error('Session restore failed:', error);
        authService.logout();
        return null;
      }
    },
  };
};

export const authService = createAuthService();
