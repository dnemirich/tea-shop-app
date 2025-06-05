import { authService } from '@/features/login/api/authService';
import { Cart, ClientResponse } from '@commercetools/platform-sdk';

const getSafeApiRoot = () => {
  const apiRoot = authService.getApiRoot();
  if (!apiRoot) throw new Error('User not authenticated');
  return apiRoot;
};

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

//создает новую корзину, валюта usd по умолчанию
export const createCart = async (currency = 'USD'): Promise<ClientResponse<Cart>> => {
  try {
    const apiRoot = getSafeApiRoot();
    return await apiRoot
      .me()
      .carts()
      .post({
        body: { currency },
      })
      .execute();
  } catch (error) {
    console.error('Failed to create cart:', error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('Failed to create cart');
  }
};

//корзина по id
export const getCartById = async (cartId: string): Promise<ClientResponse<Cart>> => {
  try {
    const apiRoot = getSafeApiRoot();
    return await apiRoot.me().carts().withId({ ID: cartId }).get().execute();
  } catch (error) {
    console.error(`Failed to fetch cart ${cartId}:`, error);
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('Failed to fetch cart');
  }
};

//добавить продукт в корзину
export const addLineItem = async (
  productId: string,
  quantity = 1,
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
              action: 'addLineItem',
              productId,
              quantity,
            },
          ],
        },
      })
      .execute();
  } catch (error: any) {
    console.error('Failed to add line item:', error);
    if (error?.statusCode === 409) {
      return addLineItem(productId, quantity, cartId);
    }
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('Failed to add item to cart');
  }
};

//удалить продукт
export const removeLineItem = async (
  lineItemId: string,
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
              action: 'removeLineItem',
              lineItemId,
            },
          ],
        },
      })
      .execute();
  } catch (error: any) {
    console.error('Failed to remove line item:', error);
    if (error?.statusCode === 409) {
      return removeLineItem(lineItemId, cartId);
    }
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('Failed to remove item from cart');
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
