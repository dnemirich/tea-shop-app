import { Button } from '@/common/components/Button/Button';
import { ItemCard } from '../ItemCard/ItemCard';
import s from './itemsContainer.module.scss';
import { CostInfo } from '../CostInfo/CostInfo';
import { Line } from '../Line/Line';

export const ItemsContainer = () => {
  return (
    <div className={s.itemsWrapper}>
      <ItemCard />
      <ItemCard />
      <ItemCard />
      <Line />
      <CostInfo text="Subtotal" />
      <Button className={s.button}>back to shopping</Button>
    </div>
  );
};
