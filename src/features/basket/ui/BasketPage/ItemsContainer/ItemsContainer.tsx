import { Button } from '@/common/components/Button/Button';
import { ItemCard } from '../ItemCard/ItemCard';
import s from './itemsContainer.module.scss';

export const ItemsContainer = () => {
  return (
    <div className={s.itemsWrapper}>
      <ItemCard />
      <ItemCard />
      <ItemCard />
      <span className={s.line}></span>
      <div className={s.subtotal}>
        <p>subtotal</p>
        <p>cost</p>
      </div>
      <Button className={s.button}>back to shopping</Button>
    </div>
  );
};
