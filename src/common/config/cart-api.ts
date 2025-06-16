import { anonymousApiRoot } from '@/features/login/api/anonymous-client';
import { authService } from '@/features/login/api/authService';
import { Cart, CartUpdateAction, Order } from '@commercetools/platform-sdk';
import { ClientResponse } from '@commercetools/ts-client';
import { useUserStore } from '../store/user-store';
import { OUNCE_SIZE } from '@/common/config/constants.ts';

const MAX_RETRIES = 3;

export const getSafeApiRoot = () => {
  const isLoggedIn = useUserStore.getState().isLoggedIn;
  if (isLoggedIn) {
    const apiRoot = authService.getApiRoot();
    if (!apiRoot) throw new Error('API root unavailable');
    return apiRoot;
  }
  if (!anonymousApiRoot) throw new Error('Anonymous API root unavailable');
  return anonymousApiRoot;
};

export const getCartTotal = (cart: Cart): number => {
  if (cart.totalPrice?.centAmount != null) {
    return cart.totalPrice.centAmount / 100;
  }
  return 0;
};

export const getCartByCustomerId = async (customerId: string) => {
  const apiRoot = authService.getApiRoot();
  if (!apiRoot) {
    throw new Error('User not authenticated');
  }

  return await apiRoot.carts().get({ queryArgs: { customerId } }).execute();
};

export const createAnonymousCart = async (currency = 'EUR'): Promise<ClientResponse<Cart>> => {
  let anonymousId = localStorage.getItem('anonymousId');
  if (!anonymousId) {
    anonymousId = crypto.randomUUID();
    localStorage.setItem('anonymousId', anonymousId);
  }

  console.log('Creating anonymous cart with anonymousId:', anonymousId);
  return await anonymousApiRoot
    .me()
    .carts()
    .post({
      body: {
        currency,
        priceMode: 'ExternalPrice',
        anonymousId,
      } as any,
    })
    .execute();
};

export const createAuthenticatedCart = async (currency = 'EUR'): Promise<ClientResponse<Cart>> => {
  const apiRoot = authService.getApiRoot();
  if (!apiRoot) {
    throw new Error('User not authenticated');
  }

  console.log('Creating authenticated cart');
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

export const getOrCreateCart = async (currency = 'EUR'): Promise<Cart> => {
  const apiRoot = getSafeApiRoot();
  try {
    const existing = await apiRoot.me().activeCart().get().execute();
    return existing.body;
  } catch (e: any) {
    if (e.statusCode === 404) {
      const created = await apiRoot
        .me()
        .carts()
        .post({ body: { currency, priceMode: 'ExternalPrice' } as any })
        .execute();
      return created.body;
    }
    throw e;
  }
};

export const addLineItem = async (
  cartId: string,
  cartVersion: number,
  productId: string,
  variantId: number,
  quantity = 1,
  selectedWeightVariant?: string,
  externalPrice?: { currencyCode: string; centAmount: number },
): Promise<Cart> => {
  console.log(
    `Adding line item to cart ${cartId}, product ${productId}, variant ${variantId}, quantity ${quantity}`,
  );

  let weightInOunces: number | undefined;

  if (selectedWeightVariant) {
    const grams = parseInt(selectedWeightVariant.replace('g', ''));
    // console.log('Selected weight variant:', selectedWeightVariant, 'grams:', grams);
    if (!isNaN(grams)) {
      weightInOunces = +(grams / OUNCE_SIZE).toFixed(2);
    } else {
      weightInOunces = OUNCE_SIZE
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

export const removeLineItem = async (
  cartId: string,
  cartVersion: number,
  lineItemId: string,
  quantity?: number,
): Promise<Cart> => {
  console.log(`Removing line item ${lineItemId} from cart ${cartId}`);
  return await updateCart(cartId, cartVersion, [
    {
      action: 'removeLineItem',
      lineItemId,
      ...(quantity && quantity > 0 ? { quantity } : {}),
    },
  ]);
};

export const changeLineItemQuantity = async (
  cartId: string,
  cartVersion: number,
  lineItemId: string,
  quantity: number,
  externalPrice?: { currencyCode: string; centAmount: number },
): Promise<Cart> => {
  const actions: CartUpdateAction[] = [
    {
      action: 'changeLineItemQuantity',
      lineItemId,
      quantity: Math.max(1, quantity),
      ...(externalPrice ? { externalPrice } : {}),
    },
  ];

  return await updateCart(cartId, cartVersion, actions);
};

export const getActiveCart = async (): Promise<Cart> => {
  const apiRoot = getSafeApiRoot();
  return await apiRoot
    .me()
    .activeCart()
    .get()
    .execute()
    .then((res) => res.body);
};

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

export const deleteActiveCart = async (): Promise<void> => {
  console.log('Deleting active cart');
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
      return;
    }
    await apiRoot
      .carts()
      .withId({ ID: cartId })
      .delete({ queryArgs: { version: cartVersion, anonymousId } })
      .execute();
  }
};

export const updateCart = async (
  cartId: string,
  cartVersion: number,
  actions: CartUpdateAction[],
): Promise<Cart> => {
  console.log(`Updating cart ${cartId} (version ${cartVersion}) with actions:`, actions);
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
        throw error;
      }
    }
  }

  throw new Error('Failed to update cart after retries');
};

export const createOrderFromCart = async (cartId: string, cartVersion: number): Promise<Order> => {
  console.log(`Creating order from cart ${cartId}`);
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
  console.log('Order created successfully');
  return response.body;
};
