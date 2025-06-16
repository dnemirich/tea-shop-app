import { Button } from '@/common/components/Button/Button';
import { useCartStore } from '@/common/store/cart-store';
import s from './clearButton.module.scss';

export const ClearCartButton = () => {
  const { cart, clearCartItems } = useCartStore();

  const handleClearCart = async () => {
    try {
      await clearCartItems();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  if (!cart || cart.lineItems.length === 0) return null;

  return (
    <Button className={s.clearCartButton} onClick={handleClearCart}>
      Clear cart
    </Button>
  );
};
