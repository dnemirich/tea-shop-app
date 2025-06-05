import { anonymousApiRoot } from '@/features/login/api/anonymous-client';
import { authService } from '@/features/login/api/authService';
import { Cart } from '@commercetools/platform-sdk';
import { ClientResponse } from '@commercetools/ts-client';
import { useUserStore } from '../store/user-store';

export const getSafeApiRoot = () => {
  const isLoggedIn = useUserStore.getState().isLoggedIn;
  const apiRoot = isLoggedIn ? authService.getApiRoot() : anonymousApiRoot;
  if (!apiRoot) throw new Error('API root unavailable');
  return apiRoot;
};

//расчет итоговой стоимости
export const getCartTotal = (cart: Cart): number => {
  if (cart.totalPrice?.centAmount != null) {
    return cart.totalPrice.centAmount / 100;
  }

  return 0;
};

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
  const apiRoot = getSafeApiRoot();

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
  const apiRoot = getSafeApiRoot();

  if (!apiRoot) {
    throw new Error('apiRoot is not initialized');
  }

  const action: {
    action: 'removeLineItem';
    lineItemId: string;
    quantity?: number;
  } = {
    action: 'removeLineItem',
    lineItemId,
  };

  if (quantity !== undefined && quantity > 0) {
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

//изменить количество lineItem
export const changeLineItemQuantity = async (
  cartId: string,
  cartVersion: number,
  lineItemId: string,
  quantity: number,
): Promise<Cart> => {
  const safeQuantity = quantity < 0 ? 0 : quantity;

  const apiRoot = getSafeApiRoot();

  if (!apiRoot) {
    throw new Error('API client not available');
  }

  const response = await apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: cartVersion,
        actions: [
          {
            action: 'changeLineItemQuantity',
            lineItemId,
            quantity: safeQuantity,
          },
        ],
      },
    })
    .execute();

  return response.body;
};

//Текущая активная корзина для анонимной и залогиненной корзины кастомера
export const getActiveCart = async (): Promise<Cart | null> => {
  const isLoggedIn = useUserStore.getState().isLoggedIn;

  const apiRoot = isLoggedIn ? authService.getApiRoot() : anonymousApiRoot;
  if (!apiRoot) throw new Error('API client not available');

  try {
    if (isLoggedIn) {
      const response = await apiRoot.me().activeCart().get().execute();
      return response.body;
    } else {
      const anonymousId = localStorage.getItem('anonymousId');
      if (!anonymousId) return null;

      const response = await apiRoot.carts().get({ queryArgs: { anonymousId } }).execute();

      return response.body.results[0] ?? null;
    }
  } catch (error) {
    console.error('Failed to fetch active cart:', error);
    return null;
  }
};

//применение скидок
//добавить скидку
export const addDiscountCode = async (
  cartId: string,
  cartVersion: number,
  discountCode: string,
): Promise<Cart> => {
  const apiRoot = getSafeApiRoot();

  const response = await apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: cartVersion,
        actions: [
          {
            action: 'addDiscountCode',
            code: discountCode,
          },
        ],
      },
    })
    .execute();

  return response.body;
};

//удалить скидку
export const removeDiscountCode = async (
  cartId: string,
  cartVersion: number,
  discountCode: string,
): Promise<Cart> => {
  const apiRoot = getSafeApiRoot();

  const response = await apiRoot
    .carts()
    .withId({ ID: cartId })
    .post({
      body: {
        version: cartVersion,
        actions: [
          {
            action: 'removeDiscountCode',
            discountCode: {
              typeId: 'discount-code',
              id: discountCode,
            },
          },
        ],
      },
    })
    .execute();

  return response.body;
};

//удалить корзину
export const deleteActiveCart = async (): Promise<void> => {
  const apiRoot = getSafeApiRoot();
  if (!apiRoot) {
    throw new Error('API client not available');
  }

  const activeCart = await getActiveCart(); //это активная корзина, текущая

  if (!activeCart) {
    console.log('No active cart to delete');
    return;
  }

  const cartId = activeCart.id;
  const cartVersion = activeCart.version;

  await apiRoot
    .carts()
    .withId({ ID: cartId })
    .delete({ queryArgs: { version: cartVersion } })
    .execute();

  console.log(`Cart deleted successfully`);
};
