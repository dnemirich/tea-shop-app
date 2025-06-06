import { create } from 'zustand';
import { getOrCreateCart, addLineItem, removeLineItem, getActiveCart } from '@/common/api/cart-api';
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
      set({ error: e.message, isLoading: false });
    }
  },

  addItem: async (productId, variantId, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      const cart = get().cart;
      if (!cart) {
        // Если корзина пустая — создаем новую
        const newCartResponse = await getOrCreateCart();
        set({ cart: newCartResponse });
      }

      const currentCart = get().cart;
      if (!currentCart) throw new Error('Cart is not available');

      const updatedCart = await addLineItem(
        currentCart.id,
        currentCart.version,
        productId,
        variantId,
        quantity,
      );
      set({ cart: updatedCart, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
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
      set({ error: e.message, isLoading: false });
    }
  },
}));
