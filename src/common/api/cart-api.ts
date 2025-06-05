import { authService } from '@/features/login/api/authService';
import { useUserStore } from '../store/user-store';

const getUserApiRoot = () => {
  const apiRoot = authService.getApiRoot();
  if (!apiRoot) {
    throw new Error('User is not authenticated');
  }
  return apiRoot;
};

export const getCart = () => {
  const apiRoot = useUserStore.getState().getApiRoot();
  if (!apiRoot) throw new Error('API root is not set');
  return apiRoot.me().activeCart().get().execute();
};

export const createCart = () => {
  const apiRoot = getUserApiRoot();
  return apiRoot
    .me()
    .carts()
    .post({
      body: {
        currency: 'USD',
      },
    })
    .execute();
};

export const getCartById = (cartId: string) => {
  const apiRoot = getUserApiRoot();
  return apiRoot.me().carts().withId({ ID: cartId }).get().execute();
};

export const addLineItem = (
  cartId: string,
  version: number,
  productId: string,
  quantity: number,
) => {
  const apiRoot = getUserApiRoot();
  return apiRoot
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version,
        actions: [
          {
            action: 'addLineItem',
            productId,
            quantity,
          },
        ],
      },
    })
    .execute();
};

export const removeLineItem = (cartId: string, version: number, lineItemId: string) => {
  const apiRoot = getUserApiRoot();
  return apiRoot
    .me()
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version,
        actions: [
          {
            action: 'removeLineItem',
            lineItemId,
          },
        ],
      },
    })
    .execute();
};
