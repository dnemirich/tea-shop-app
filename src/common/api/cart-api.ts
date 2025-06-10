import { anonymousApiRoot } from '@/features/login/api/anonymous-client';
import { authService } from '@/features/login/api/authService';
import { Cart, CartUpdateAction } from '@commercetools/platform-sdk';
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
  console.log(
    `Adding item to cart: cartId=${cartId}, productId=${productId}, variantId=${variantId}, quantity=${quantity}`,
  );
  const updatedCart = await updateCart(cartId, cartVersion, [
    {
      action: 'addLineItem',
      productId,
      variantId,
      quantity,
    },
  ]);
  console.log('Item added successfully', updatedCart);
  return updatedCart;
};

//удаление LineItem из корзины
export const removeLineItem = async (
  cartId: string,
  cartVersion: number,
  lineItemId: string,
  quantity?: number,
): Promise<Cart> => {
  return await updateCart(cartId, cartVersion, [
    {
      action: 'removeLineItem',
      lineItemId,
      ...(quantity && quantity > 0 ? { quantity } : {}),
    },
  ]);
};

//изменить количество lineItem
export const changeLineItemQuantity = async (
  cartId: string,
  cartVersion: number,
  lineItemId: string,
  quantity: number,
): Promise<Cart> => {
  const safeQuantity = quantity < 0 ? 0 : quantity;

  return await updateCart(cartId, cartVersion, [
    {
      action: 'changeLineItemQuantity',
      lineItemId,
      quantity: safeQuantity,
    },
  ]);
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
  return await updateCart(cartId, cartVersion, [
    {
      action: 'addDiscountCode',
      code: discountCode,
    },
  ]);
};

//удалить скидку
export const removeDiscountCode = async (
  cartId: string,
  cartVersion: number,
  discountCodeId: string,
): Promise<Cart> => {
  return await updateCart(cartId, cartVersion, [
    {
      action: 'removeDiscountCode',
      discountCode: {
        typeId: 'discount-code',
        id: discountCodeId,
      },
    },
  ]);
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

//обновить корзину
export const updateCart = async (
  cartId: string,
  cartVersion: number,
  actions: CartUpdateAction[],
): Promise<Cart> => {
  const apiRoot = getSafeApiRoot();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await apiRoot
        .carts()
        .withId({ ID: cartId })
        .post({
          body: {
            version: cartVersion,
            actions,
          },
        })
        .execute();

      return response.body;
    } catch (error: any) {
      if (error.statusCode === 409 && attempt < MAX_RETRIES) {
        const freshCart = await getActiveCart();
        if (!freshCart) throw new Error('Cart not found during retry');
        cartVersion = freshCart.version;
      } else {
        console.error('Cart update failed:', error);
        throw error;
      }
    }
  }

  throw new Error('Failed to update cart after retries');
};
