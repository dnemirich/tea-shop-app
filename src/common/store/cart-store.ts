import { create } from 'zustand';
import { Cart } from '@commercetools/platform-sdk';
import {
  addLineItem,
  changeLineItemQuantity,
  deleteActiveCart,
  getActiveCart,
  getOrCreateCart,
  getSafeApiRoot,
  removeLineItem,
} from '../config/cart-api';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  setCart: (cart: Cart) => void;
  changeQuantity: (
    lineItemId: string,
    quantity: number,
    externalPrice?: { currencyCode: string; centAmount: number },
  ) => Promise<void>;
  clearCart: () => void;

  fetchActiveCart: () => Promise<void>;
  addItem: (
    productId: string,
    variantId: number,
    quantity?: number,
    selectedVariant?: string,
    externalPrice?: { currencyCode: string; centAmount: number },
  ) => Promise<void>;
  removeItem: (lineItemId: string, quantity?: number) => Promise<void>;
  deleteCart: () => Promise<void>;
  initializeCart: () => Promise<void>;
  clearCartItems: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  setCart: (cart) => set({ cart }),
  clearCart: async () => {
    try {
      await deleteActiveCart();
      set({ cart: null });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  },
  initializeCart: async () => {
    const savedCartId = localStorage.getItem('cartId');
    const savedCartVersion = localStorage.getItem('cartVersion');

    if (savedCartId && savedCartVersion) {
      try {
        const apiRoot = getSafeApiRoot();
        const cart = await apiRoot
          .carts()
          .withId({ ID: savedCartId })
          .get()
          .execute()
          .then((res) => res.body);

        if (cart.version === Number(savedCartVersion)) {
          set({ cart });
          return;
        }
      } catch (error) {
        console.log('Failed to restore cart from server', error);
      }
    }

    const newCart = await getOrCreateCart();
    set({ cart: newCart });
  },

  fetchActiveCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = await getActiveCart();
      set({ cart, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to fetch cart', isLoading: false });
    }
  },

  addItem: async (productId, variantId, quantity = 1, selectedVariant, externalPrice) => {
    set({ isLoading: true, error: null });
    try {
      let cart = get().cart;
      if (!cart) {
        const newCart = await getOrCreateCart();
        if (!newCart) throw new Error('Failed to create/fetch cart');
        set({ cart: newCart });
        cart = newCart;
      }

      const updatedCart = await addLineItem(
        cart.id,
        cart.version,
        productId,
        variantId,
        quantity,
        selectedVariant,
        externalPrice,
      );

      set({ cart: updatedCart, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to add item', isLoading: false });
      throw e;
    }
  },

  changeQuantity: async (lineItemId, newQuantity, externalPrice) => {
    set({ isLoading: true });
    try {
      const cart = get().cart;
      if (!cart) throw new Error('Cart not available');

      const lineItem = cart.lineItems.find((item) => item.id === lineItemId);
      if (!lineItem) throw new Error('Item not found in cart');

      const priceToUse = externalPrice || {
        currencyCode: lineItem.price?.value.currencyCode || 'EUR',
        centAmount:
          lineItem.price?.value.centAmount || Math.round(lineItem.price?.value.centAmount || 0),
      };

      const updatedCart = await changeLineItemQuantity(
        cart.id,
        cart.version,
        lineItemId,
        newQuantity,
        priceToUse,
      );

      set({ cart: updatedCart, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update quantity',
        isLoading: false,
      });
      throw error;
    }
  },

  removeItem: async (lineItemId) => {
    set({ isLoading: true, error: null });
    try {
      const cart = get().cart;
      if (!cart) throw new Error('Cart is not available');

      const updatedCart = await removeLineItem(cart.id, cart.version, lineItemId);
      set({ cart: updatedCart, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to remove item', isLoading: false });
    }
  },

  deleteCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await getActiveCart();
      set({ cart: null, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to delete cart', isLoading: false });
    }
  },

  clearCartItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = get().cart;
      if (!cart) {
        throw new Error('Cart is not available');
      }

      const actions = cart.lineItems.map((item) => ({
        action: 'removeLineItem' as const,
        lineItemId: item.id,
        quantity: item.quantity,
      }));

      const apiRoot = getSafeApiRoot();
      const updatedCart = await apiRoot
        .carts()
        .withId({ ID: cart.id })
        .post({
          body: {
            version: cart.version,
            actions,
          },
        })
        .execute();

      set({ cart: updatedCart.body, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to clear cart items',
        isLoading: false,
      });
      throw error;
    }
  },
}));
