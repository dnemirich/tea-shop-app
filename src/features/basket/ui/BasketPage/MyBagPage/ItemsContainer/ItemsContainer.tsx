import { memo, useCallback, useMemo } from 'react';
import { Button } from '@/common/components/Button/Button';
import { ItemCard } from '../ItemCard/ItemCard';
import s from './itemsContainer.module.scss';
import { CostInfo } from '../../CostInfo/CostInfo';
import { Line } from '../../Line/Line';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/common/config/routes';
import { useCartStore } from '@/common/store/cart-store';
import { LineItem } from '@commercetools/platform-sdk';

export const ItemsContainer = () => {
  const navigate = useNavigate();
  const { cart, isLoading } = useCartStore();

  const handleBackShopping = useCallback(() => {
    navigate(ROUTES.SHOP);
  }, [navigate]);

  const getName = useCallback((item: LineItem): string => {
    if (typeof item.name === 'string') return item.name;
    if (item.name?.en) return item.name.en;
    const firstLangKey = item.name && Object.keys(item.name)[0];
    if (firstLangKey) return item.name[firstLangKey];
    return item.productId;
  }, []);

  const itemsList = useMemo(() => {
    if (!cart) return [];
    return cart.lineItems.map((item) => ({
      id: item.id,
      name: getName(item),
      price: item.price?.value.centAmount ? item.price.value.centAmount / 100 : 0,
      quantity: item.quantity,
      imageUrl: item.variant?.images?.[0]?.url,
      variant: item.custom?.fields?.selectedWeightVariant,
      currencyCode: item.price?.value.currencyCode,
    }));
  }, [cart, getName]);

  if (isLoading) return <div>Loading...</div>;
  if (!cart || cart.lineItems.length === 0) {
    return (
      <div className={s.emptyWrapper}>
        <div className={s.empty}>Your cart is empty</div>
        <Button className={s.button} onClick={handleBackShopping}>
          back to shopping
        </Button>
        ;
      </div>
    );
  }

  const subtotal = cart.totalPrice?.centAmount ? cart.totalPrice.centAmount / 100 : 0;

  const MemoizedItemCard = memo(ItemCard, (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id &&
      prevProps.name === nextProps.name &&
      prevProps.price === nextProps.price &&
      prevProps.quantity === nextProps.quantity &&
      prevProps.imageUrl === nextProps.imageUrl &&
      prevProps.variant === nextProps.variant &&
      prevProps.currencyCode === nextProps.currencyCode
    );
  });

  return (
    <div className={s.itemsWrapper}>
      {itemsList.map((item) => (
        <MemoizedItemCard key={item.id} {...item} />
      ))}
      <Line />
      <CostInfo text="Subtotal" value={`€${subtotal.toFixed(2)}`} />
      <Button className={s.button} onClick={handleBackShopping}>
        back to shopping
      </Button>
    </div>
  );
};
