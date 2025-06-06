import { useState, useEffect } from 'react';
import { getActiveCart, getOrCreateCart, addLineItem, removeLineItem } from './cart-api';

const TEST_PRODUCT_ID = '80076321-f3a9-469c-8bad-c6e7cc8510bd';
const TEST_VARIANT_ID = 1;

type Cart = {
  id: string;
  version: number;
  lineItems: { id: string }[];
  [key: string]: any;
};

export const CartSandbox = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState('');

  const appendLog = (msg: string) => setLog((prev) => prev + msg + '\n');

  const fetchCart = async () => {
    setLoading(true);
    try {
      const activeCart = await getActiveCart();
      if (!activeCart) {
        appendLog('No active cart found');
        return;
      }
      setCart(activeCart);
      appendLog('Fetched active cart');
    } catch (err: any) {
      appendLog('Error fetching active cart: ' + (err.message || err.toString()));
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const createNewCart = async () => {
    setLoading(true);
    try {
      const newCartResponse = await getOrCreateCart('USD');
      if (!newCartResponse) {
        appendLog('No cart returned');
        return;
      }
      setCart(newCartResponse);

      appendLog('Created new cart: ' + newCartResponse.id);
    } catch (err: any) {
      appendLog('Error creating cart: ' + (err.message || err.toString()));
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!cart) {
      appendLog('No cart to add items to');
      return;
    }
    setLoading(true);
    try {
      const updatedCart = await addLineItem(
        cart.id,
        cart.version,
        TEST_PRODUCT_ID,
        TEST_VARIANT_ID,
        1,
      );
      setCart(updatedCart);
      appendLog('Added item to cart');
    } catch (err: any) {
      appendLog('Error adding item: ' + (err.message || err.toString()));
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async () => {
    if (!cart || !cart.lineItems || cart.lineItems.length === 0) {
      appendLog('No items to remove');
      return;
    }
    setLoading(true);
    try {
      const updatedCart = await removeLineItem(cart.id, cart.version, cart.lineItems[0].id, 1);
      setCart(updatedCart);
      appendLog('Removed item from cart');
    } catch (err: any) {
      appendLog('Error removing item: ' + (err.message || err.toString()));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
      <h2>Cart Sandbox</h2>
      <button onClick={fetchCart} disabled={loading}>
        Fetch Active Cart
      </button>
      <button onClick={createNewCart} disabled={loading}>
        Create Cart
      </button>
      <button onClick={addItem} disabled={loading}>
        Add Item
      </button>
      <button onClick={removeItem} disabled={loading}>
        Remove Item
      </button>
      <pre>{log}</pre>
      <pre>{JSON.stringify(cart, null, 2)}</pre>
    </div>
  );
};
