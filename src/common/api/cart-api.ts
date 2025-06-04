import { apiRoot } from '@/common/config/api-client.ts';

export const getCart = () => {
  return apiRoot.me().activeCart().get().execute();
};

export const createCart = async () => {
  return await apiRoot
    .carts()
    .post({
      body: {
        currency: 'USD',
      },
    })
    .execute();
};

export const getCartById = async (cartId: string) => {
  return await apiRoot.carts().withId({ ID: cartId }).get().execute();
};

export const addLineItem = async (
  cartId: string,
  version: number,
  productId: string,
  quantity: number,
) => {
  return await apiRoot
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
