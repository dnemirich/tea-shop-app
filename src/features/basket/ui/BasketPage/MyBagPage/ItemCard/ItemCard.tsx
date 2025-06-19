import { useState } from 'react';
import { useCartStore } from '@/common/store/cart-store';
import { Counter } from '../../Counter/Counter';
import s from './itemCard.module.scss';

export interface ItemCardProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  variant?: string;
  currencyCode?: string;
}

export const ItemCard = ({
  id,
  name,
  price,
  quantity,
  imageUrl,
  variant,
  currencyCode = 'EUR',
}: ItemCardProps) => {
  const { changeQuantity, removeItem } = useCartStore();
  const [isUpdating, setUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    setUpdating(true);
    try {
      await changeQuantity(id, newQuantity, {
        currencyCode,
        centAmount: Math.round(price * 100),
      });
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdating(false);
    }
  };

  const displayName = variant ? `${name} - ${variant}` : name;

  return (
    <div className={`${s.itemCardWrapper} ${isUpdating ? s.updating : ''}`}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={displayName}
          className={s.productImage}
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}

      <div className={s.wrapper}>
        <div className={s.subWrapper}>
          <p className={s.teaInfo}>{displayName}</p>
          <Counter
            value={quantity}
            onChange={handleQuantityChange}
            min={1}
            max={10}
            disabled={isUpdating}
          />
        </div>

        <div className={s.subWrapper}>
          <button
            className={s.remove}
            onClick={() => removeItem(id)}
            disabled={isUpdating}
            aria-label={`Remove ${displayName} from cart`}
          >
            {isUpdating ? '...' : 'remove'}
          </button>
          <p className={s.cost}>€{(price * quantity).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
