import { anonymousApiRoot } from '@/features/login/api/anonymous-client';
import { authService } from '@/features/login/api/authService';
import { Cart, CartUpdateAction, Order } from '@commercetools/platform-sdk';
import { ClientResponse } from '@commercetools/ts-client';
import { useUserStore } from '../store/user-store';

const MAX_RETRIES = 3;

/*export const getSafeApiRoot = () => {
  const isLoggedIn = useUserStore.getState().isLoggedIn;
  console.log('Is logged in:', isLoggedIn);
  console.log('Auth API root:', authService.getApiRoot());
  console.log('Anonymous API root:', anonymousApiRoot);

  const apiRoot = isLoggedIn ? authService.getApiRoot() : anonymousApiRoot;
  if (!apiRoot) throw new Error('API root unavailable');
  return apiRoot;
};*/
export const getSafeApiRoot = () => {
  const isLoggedIn = useUserStore.getState().isLoggedIn;

  if (isLoggedIn) {
    const apiRoot = authService.getApiRoot();
    if (!apiRoot) {
      throw new Error('Authenticated API root unavailable');
    }
    return apiRoot;
  }

  if (!anonymousApiRoot) {
    throw new Error('Anonymous API root unavailable');
  }

  return anonymousApiRoot;
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
export const createAnonymousCart = async (currency = 'EUR'): Promise<ClientResponse<Cart>> => {
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
        priceMode: 'ExternalPrice',
      } as any,
    })
    .execute();
};

//создать корзину залогиненного юзера
export const createAuthenticatedCart = async (currency = 'EUR'): Promise<ClientResponse<Cart>> => {
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
        priceMode: 'ExternalPrice',
      } as any,
    })
    .execute();
};

//общая обертка для создания корзины - либо анонимная, либо залогиненная
export const getOrCreateCart = async (currency = 'EUR'): Promise<Cart | undefined> => {
  const isLoggedIn = useUserStore.getState().isLoggedIn;

  try {
    // Пытаемся получить существующую корзину
    const existingCart = await getActiveCart();
    if (existingCart) {
      console.log('Existing cart found:', {
        id: existingCart.id,
        items: existingCart.lineItems.length,
      });
      return existingCart;
    }

    // Если корзины нет, создаём новую
    if (isLoggedIn) {
      console.log('Creating new authenticated cart');
      const response = await createAuthenticatedCart(currency);
      return response.body;
    } else {
      console.log('Creating new anonymous cart');
      const anonymousId = localStorage.getItem('anonymousId') || crypto.randomUUID();
      localStorage.setItem('anonymousId', anonymousId);

      // Проверяем, есть ли уже корзина для этого anonymousId
      try {
        const response = await anonymousApiRoot.me().activeCart().get().execute();
        if (response.body) {
          console.log('Found existing anonymous cart');
          return response.body;
        }
      } catch (error) {
        console.log('No existing anonymous cart, creating new one');
      }

      // Создаём новую анонимную корзину
      const createdCart = await createAnonymousCart(currency);
      return createdCart.body;
    }
  } catch (error: any) {
    console.log('Error in getOrCreateCart:', error);
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
  selectedWeightVariant?: string,
  externalPrice?: { currencyCode: string; centAmount: number },
): Promise<Cart> => {
  let weightInOunces: number | undefined;

  if (selectedWeightVariant) {
    const grams = parseInt(selectedWeightVariant.replace('g', ''));
    if (!isNaN(grams)) {
      weightInOunces = +(grams / 28.3495).toFixed(2);
    }
  }

  const customFields: Record<string, any> = {
    selectedWeightVariant,
  };
  if (weightInOunces !== undefined) {
    customFields.weightInOunces = weightInOunces;
  }

  const actions: CartUpdateAction[] = [
    {
      action: 'addLineItem',
      productId,
      variantId,
      quantity,
      ...(externalPrice ? { externalPrice } : {}),
      ...(selectedWeightVariant
        ? {
            custom: {
              type: {
                typeId: 'type',
                key: 'lineItemWeightType',
              },
              fields: customFields,
            },
          }
        : {}),
    },
  ];

  return await updateCart(cartId, cartVersion, actions);
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
/*export const getActiveCart = async (): Promise<Cart | null> => {
  try {
    const apiRoot = getSafeApiRoot();
    if (!apiRoot) return null;

    if (useUserStore.getState().isLoggedIn) {
      const response = await apiRoot.me().activeCart().get().execute();
      return response.body ?? null;
    } else {
      const anonymousId = localStorage.getItem('anonymousId');
      if (!anonymousId) return null;

      //const response = await apiRoot.carts().get({ queryArgs: { anonymousId } }).execute();
      //return response.body.results[0] ?? null;
      try {
        const response = await anonymousApiRoot.me().activeCart().get().execute();
        return response.body ?? null;
      } catch (error) {
        console.log('Failed to fetch anonymous active cart:', error);
        return null;
      }
    }
  } catch (error) {
    console.log('Failed to fetch active cart:', error);
    return null;
  }
};*/
export const getActiveCart = async (): Promise<Cart | null> => {
  try {
    const apiRoot = getSafeApiRoot();
    if (!apiRoot) return null;

    if (useUserStore.getState().isLoggedIn) {
      try {
        const response = await apiRoot.me().activeCart().get().execute();
        return response.body;
      } catch (error: any) {
        if (error.statusCode === 404) return null;
        throw error;
      }
    } else {
      const anonymousId = localStorage.getItem('anonymousId');
      if (!anonymousId) return null;

      try {
        const response = await anonymousApiRoot
          .carts()
          .get({
            queryArgs: {
              where: `anonymousId="${anonymousId}"`,
              limit: 1,
            },
          })
          .execute();
        return response.body.results[0] || null;
      } catch (error) {
        console.log('Error fetching anonymous cart:', error);
        return null;
      }
    }
  } catch (error) {
    console.log('Failed to get active cart:', error);
    return null;
  }
};

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

  const activeCart = await getActiveCart();
  if (!activeCart) {
    console.log('No active cart to delete');
    return;
  }

  const cartId = activeCart.id;
  const cartVersion = activeCart.version;

  if (useUserStore.getState().isLoggedIn) {
    await apiRoot
      .me()
      .carts()
      .withId({ ID: cartId })
      .delete({ queryArgs: { version: cartVersion } })
      .execute();
  } else {
    const anonymousId = localStorage.getItem('anonymousId');
    if (!anonymousId) {
      console.log('No anonymousId found');
      return;
    }
    await apiRoot
      .carts()
      .withId({ ID: cartId })
      .delete({ queryArgs: { version: cartVersion, anonymousId } })
      .execute();
  }

  console.log('Cart deleted successfully');
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
        console.log('Cart update failed:', error);
        throw error;
      }
    }
  }

  throw new Error('Failed to update cart after retries');
};

//создать заказ из корзины
export const createOrderFromCart = async (cartId: string, cartVersion: number): Promise<Order> => {
  const apiRoot = getSafeApiRoot();

  const response = await apiRoot
    .me()
    .orders()
    .post({
      body: {
        id: cartId,
        version: cartVersion,
      },
    })
    .execute();

  return response.body;
};
