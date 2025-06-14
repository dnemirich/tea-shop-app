import { anonymousApiRoot } from '@/features/login/api/anonymous-client';
import { authService } from '@/features/login/api/authService';
import { Cart, CartUpdateAction, Order } from '@commercetools/platform-sdk';
import { ClientResponse } from '@commercetools/ts-client';
import { useUserStore } from '../store/user-store';

const MAX_RETRIES = 3;

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

export const getOrCreateCart = async (currency = 'EUR'): Promise<Cart | null> => {
  const isLoggedIn = useUserStore.getState().isLoggedIn;

  try {
    const existingCart = await getActiveCart();
    if (existingCart) {
      console.log('Existing cart found:', {
        id: existingCart.id,
        version: existingCart.version,
        items: existingCart.lineItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          name: item.name?.['en'] || 'No name',
          quantity: item.quantity,
        })),
      });
      return existingCart;
    }

    if (isLoggedIn) {
      try {
        const response = await createAuthenticatedCart(currency);

        if (!response.body) {
          throw new Error('Failed to create cart - empty response');
        }

        console.log('Authenticated cart created successfully:', {
          id: response.body.id,
          version: response.body.version,
          items: response.body.lineItems?.length || 0,
        });

        return response.body;
      } catch (error) {
        throw new Error('Failed to create cart. Please try again.');
      }
    } else {
      const anonymousId = localStorage.getItem('anonymousId') || crypto.randomUUID();
      localStorage.setItem('anonymousId', anonymousId);

      try {
        const response = await anonymousApiRoot
          .carts()
          .get({ queryArgs: { where: `anonymousId="${anonymousId}"`, limit: 1 } })
          .execute();

        if (response.body.results.length > 0) {
          console.log('Existing anonymous cart found:', {
            id: response.body.results[0].id,
            version: response.body.results[0].version,
            items: response.body.results[0].lineItems.map((item) => ({
              id: item.id,
              productId: item.productId,
              name: item.name?.['en'] || 'No name',
              quantity: item.quantity,
            })),
          });
          return response.body.results[0];
        }
      } catch (error) {
        console.log('No existing anonymous cart, creating new one');
      }

      try {
        const createdCart = await createAnonymousCart(currency);

        if (!createdCart.body) {
          throw new Error('Failed to create cart - empty response');
        }

        console.log('New anonymous cart created successfully:', {
          id: createdCart.body.id,
          version: createdCart.body.version,
          items: createdCart.body.lineItems?.length || 0,
        });

        return createdCart.body;
      } catch (error) {
        throw new Error('Failed to create cart. Please try again.');
      }
    }
  } catch (error: any) {
    console.log('Error getOrCreateCart:', error);
    if (error.message?.includes('anonymousId is already in use')) {
      localStorage.removeItem('anonymousId');
      location.reload();
    }
    return null;
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

export const getActiveCart = async (): Promise<Cart | null> => {
  try {
    const apiRoot = getSafeApiRoot();
    if (!apiRoot) {
      return null;
    }

    if (useUserStore.getState().isLoggedIn) {
      try {
        const response = await apiRoot.me().activeCart().get().execute();
        return response.body;
      } catch (error: any) {
        if (error.statusCode === 404) {
          console.log('No active cart found for logged in user');
          return null;
        }
        console.log('Error fetching active cart:', error);
        throw error;
      }
    } else {
      const anonymousId = localStorage.getItem('anonymousId');
      if (!anonymousId) {
        console.log('No anonymousId found');
        return null;
      }

      try {
        const response = await anonymousApiRoot
          .carts()
          .get({ queryArgs: { where: `anonymousId="${anonymousId}"`, limit: 1 } })
          .execute();
        return response.body.results[0] || null;
      } catch (error) {
        console.error('Error fetching anonymous cart:', error);
        return null;
      }
    }
  } catch (error) {
    console.error('Failed to get active cart:', error);
    return null;
  }
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
