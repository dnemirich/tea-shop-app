import { memo, useMemo, useState } from 'react';
import { Button } from '@/common/components/Button/Button';
import { ItemCard } from '../ItemCard/ItemCard';
import s from './itemsContainer.module.scss';
import { CostInfo } from '../../CostInfo/CostInfo';
// import { Line } from '../../Line/Line';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/common/config/routes';
import { useCartStore } from '@/common/store/cart-store';
import { LineItem } from '@commercetools/platform-sdk';
import { PromocodeBox } from '@/features/basket/ui/BasketPage/MyBagPage/PromocodeBox/PromocodeBox.tsx';
import { addDiscountCode } from '@/common/config/cart-api.ts';

export const ItemsContainer = () => {
  const navigate = useNavigate();
  const { cart } = useCartStore();
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);

  const handleBackShopping = () => navigate(ROUTES.SHOP);

  const handlePromoCodeSuccess = (code: string) => {
    if (!cart) return;
    addDiscountCode(cart.id, cart.version, code).then((res) => {
      const discount = res.totalPrice.centAmount / 100;
      setDiscountedPrice(discount);
    });
  };

  const getName = (item: LineItem): string => {
    if (item.name) return item.name['en-US'];
    const firstLangKey = item.name && Object.keys(item.name)[0];
    if (firstLangKey) return item.name[firstLangKey];
    return item.productId;
  };

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
  }, [cart]);

  if (!cart || cart.lineItems.length === 0) {
    return (
      <div className={s.emptyWrapper}>
        <div className={s.empty}>Your cart is empty</div>
        <Button className={s.button} onClick={handleBackShopping}>
          back to shopping
        </Button>
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
      <div className={s.itemsList}>
        {itemsList.map((item) => (
          <MemoizedItemCard key={item.id} {...item} />
        ))}
      </div>
      {/*<Line />*/}
      <div className={s.summaryWrapper}>
        <h2 className={s.summaryHeading}>Order summary</h2>
        <CostInfo
          text="Subtotal"
          value={`€${subtotal.toFixed(2)}`}
          discountPrice={discountedPrice ? `€${discountedPrice.toFixed(2)}` : ''}
        />
        <PromocodeBox onPromoCodeSuccess={handlePromoCodeSuccess} />
        <Button className={s.button} onClick={handleBackShopping}>
          back to shopping
        </Button>
      </div>
    </div>
  );
};
