import { create } from 'zustand';
import {
  getOrCreateCart,
  addLineItem,
  removeLineItem,
  getActiveCart,
  deleteActiveCart,
} from '@/common/api/cart-api';
import { Cart } from '@commercetools/platform-sdk';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  setCart: (cart: Cart) => void;
  clearCart: () => void;

  fetchActiveCart: () => Promise<void>;
  addItem: (productId: string, variantId: number, quantity?: number) => Promise<void>;
  removeItem: (lineItemId: string, quantity?: number) => Promise<void>;
  deleteCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  setCart: (cart) => set({ cart }),
  clearCart: () => set({ cart: null }),

  fetchActiveCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = await getActiveCart();
      set({ cart, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to fetch cart', isLoading: false });
    }
  },

  addItem: async (productId, variantId, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      let cart = get().cart;
      if (!cart) {
        const newCart = await getOrCreateCart();
        if (!newCart) throw new Error('Failed to create/fetch cart');
        set({ cart: newCart });
        cart = newCart;
      }

      if (!cart) throw new Error('Cart is not available');

      const updatedCart = await addLineItem(cart.id, cart.version, productId, variantId, quantity);

      set({ cart: updatedCart, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to add item', isLoading: false });
    }
  },

  removeItem: async (lineItemId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const cart = get().cart;
      if (!cart) throw new Error('Cart is not available');

      const updatedCart = await removeLineItem(cart.id, cart.version, lineItemId, quantity);
      set({ cart: updatedCart, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to remove item', isLoading: false });
    }
  },

  deleteCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await deleteActiveCart();
      set({ cart: null, isLoading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to delete cart', isLoading: false });
    }
  },
}));
