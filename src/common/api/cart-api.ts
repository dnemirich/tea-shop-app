import { anonymousApiRoot } from '@/features/login/api/anonymous-client';
import { authService } from '@/features/login/api/authService';
import { Cart } from '@commercetools/platform-sdk';
import { ClientResponse } from '@commercetools/ts-client';
import { useUserStore } from '../store/user-store';

//получить корзину по customerId
export const getCartByCustomerId = async (customerId: string) => {
  const apiRoot = authService.getApiRoot();
  if (!apiRoot) {
    throw new Error('User not authenticated');
  }

  return await apiRoot.carts().get({ queryArgs: { customerId } }).execute();
};

//создать анонимную корзину
export const createAnonymousCart = async (currency = 'USD'): Promise<ClientResponse<Cart>> => {
  let anonymousId = localStorage.getItem('anonymousId');
  if (!anonymousId) {
    anonymousId = crypto.randomUUID();
    localStorage.setItem('anonymousId', anonymousId);
  }

  return await anonymousApiRoot
    .carts()
    .post({
      body: {
        currency,
        anonymousId,
      },
    })
    .execute();
};

//создать корзину залогиненного юзера
export const createAuthenticatedCart = async (currency = 'USD'): Promise<ClientResponse<Cart>> => {
  const apiRoot = authService.getApiRoot();
  if (!apiRoot) {
    throw new Error('User not authenticated');
  }

  return apiRoot
    .me()
    .carts()
    .post({
      body: {
        currency,
      },
    })
    .execute();
};

//общая обертка для создания корзины - либо анонимная, либо залогиненная
export const createCart = async (currency = 'USD') => {
  const isLoggedIn = useUserStore.getState().isLoggedIn;
  if (isLoggedIn) {
    return await createAuthenticatedCart(currency);
  } else {
    return await createAnonymousCart(currency);
  }
};

//доабвление LineItem
export const addLineItem = async (
  cartId: string,
  cartVersion: number,
  productId: string,
  variantId: number,
  quantity = 1,
): Promise<Cart> => {
  const isLoggedIn = useUserStore.getState().isLoggedIn;
  const apiRoot = isLoggedIn ? authService.getApiRoot() : anonymousApiRoot;

  if (!apiRoot) {
    throw new Error('apiRoot is not initialized');
  }

  const response = await apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: cartVersion,
        actions: [
          {
            action: 'addLineItem',
            productId,
            variantId,
            quantity,
          },
        ],
      },
    })
    .execute();

  return response.body;
};

//удаление LineItem из корзины
export const removeLineItem = async (
  cartId: string,
  cartVersion: number,
  lineItemId: string,
  quantity?: number,
): Promise<Cart> => {
  const isLoggedIn = useUserStore.getState().isLoggedIn;
  const apiRoot = isLoggedIn ? authService.getApiRoot() : anonymousApiRoot;

  if (!apiRoot) {
    throw new Error('apiRoot is not initialized');
  }

  const action: any = {
    action: 'removeLineItem',
    lineItemId,
  };

  if (quantity !== undefined) {
    action.quantity = quantity;
  }

  const response = await apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: cartVersion,
        actions: [action],
      },
    })
    .execute();

  return response.body;
};

/*
//Текущая активная корзина
export const getActiveCart = async (): Promise<ClientResponse<Cart>> => {
  try {
    const apiRoot = getSafeApiRoot();
    return await apiRoot.me().activeCart().get().execute();
  } catch (error) {
    console.error('Failed to fetch active cart:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('Failed to fetch cart');
  }
};


//обновить корзину
export const updateLineItemQuantity = async (
  lineItemId: string,
  quantity: number,
  cartId?: string,
): Promise<ClientResponse<Cart>> => {
  try {
    const apiRoot = getSafeApiRoot();
    const targetCartId = cartId || (await getActiveCart()).body.id;
    const { body: cart } = await getCartById(targetCartId);

    return await apiRoot
      .me()
      .carts()
      .withId({ ID: targetCartId })
      .post({
        body: {
          version: cart.version,
          actions: [
            {
              action: 'changeLineItemQuantity',
              lineItemId,
              quantity,
            },
          ],
        },
      })
      .execute();
  } catch (error: any) {
    console.error('Failed to update item quantity:', error);
    if (error?.statusCode === 409) {
      return updateLineItemQuantity(lineItemId, quantity, cartId);
    }
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('Failed to update item quantity');
  }
};

//очистить корзину
export const clearCart = async (cartId?: string): Promise<ClientResponse<Cart>> => {
  try {
    const apiRoot = getSafeApiRoot();
    const targetCartId = cartId || (await getActiveCart()).body.id;
    const { body: cart } = await getCartById(targetCartId);

    const actions = cart.lineItems.map((item) => ({
      action: 'removeLineItem' as const,
      lineItemId: item.id,
    }));

    return await apiRoot
      .me()
      .carts()
      .withId({ ID: targetCartId })
      .post({
        body: {
          version: cart.version,
          actions,
        },
      })
      .execute();
  } catch (error: any) {
    console.error('Failed to clear cart:', error);
    if (error?.statusCode === 409) {
      return clearCart(cartId);
    }
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('Failed to clear cart');
  }
};
*/
