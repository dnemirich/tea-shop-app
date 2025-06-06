import { anonymousApiRoot } from '@/features/login/api/anonymous-client';
import { authService } from '@/features/login/api/authService';
import { Cart } from '@commercetools/platform-sdk';
import { ClientResponse } from '@commercetools/ts-client';
import { useUserStore } from '../store/user-store';

const MAX_RETRIES = 3;

export const getSafeApiRoot = () => {
  const isLoggedIn = useUserStore.getState().isLoggedIn;
  console.log('Is logged in:', isLoggedIn);
  console.log('Auth API root:', authService.getApiRoot());
  console.log('Anonymous API root:', anonymousApiRoot);

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
    .me()
    .carts()
    .post({
      body: {
        currency,
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
/*export const createCart = async (currency = 'USD') => {
  const isLoggedIn = useUserStore.getState().isLoggedIn;
  if (isLoggedIn) {
    return await createAuthenticatedCart(currency);
  } else {
    return await createAnonymousCart(currency);
  }
};*/
export const getOrCreateCart = async (currency = 'USD'): Promise<Cart | undefined> => {
  const isLoggedIn = useUserStore.getState().isLoggedIn;

  try {
    const existingCart = await getActiveCart();
    if (existingCart) {
      return existingCart as Cart;
    }

    if (isLoggedIn) {
      const response = await createAuthenticatedCart(currency);
      return response.body;
    } else {
      let anonymousId = localStorage.getItem('anonymousId');
      if (!anonymousId) {
        anonymousId = crypto.randomUUID();
        localStorage.setItem('anonymousId', anonymousId);
      }

      const response = await anonymousApiRoot.carts().get({ queryArgs: { anonymousId } }).execute();

      if (response.body.results.length > 0) {
        return response.body.results[0];
      }

      const createdCart = await createAnonymousCart(currency);
      return createdCart.body;
    }
  } catch (error: any) {
    if (error.message?.includes('anonymousId is already in use')) {
      localStorage.removeItem('anonymousId');
      location.reload();
    }
    throw error;
  }
};

//добавление LineItem
export const addLineItem = async (
  cartId: string,
  cartVersion: number,
  productId: string,
  variantId: number,
  quantity = 1,
): Promise<Cart> => {
  const apiRoot = getSafeApiRoot();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await apiRoot
        .me()
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
    } catch (error: any) {
      //если версии конфликтуют,  пробуем снова, обновляем версию
      if (error.statusCode === 409 && attempt < MAX_RETRIES) {
        const freshCart = await getActiveCart();
        if (!freshCart) throw new Error('Cart not found during retry');
        cartVersion = freshCart.version;
      } else {
        console.error('Failed to add line item', error);
        throw error;
      }
    }
  }
  throw new Error('Failed to add line item after retries');
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
    .me()
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
    .me()
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
  try {
    const apiRoot = getSafeApiRoot();
    if (!apiRoot) return null;

    if (useUserStore.getState().isLoggedIn) {
      const response = await apiRoot.me().activeCart().get().execute();
      return response.body ?? null;
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
  discountCodeId: string,
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
              id: discountCodeId,
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
    .me()
    .carts()
    .withId({ ID: cartId })
    .delete({ queryArgs: { version: cartVersion } })
    .execute();

  console.log(`Cart deleted successfully`);
};
