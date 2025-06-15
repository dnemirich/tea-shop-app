import { Button } from '@/common/components/Button/Button';
import { ItemCard } from '../ItemCard/ItemCard';
import s from './itemsContainer.module.scss';
import { CostInfo } from '../../CostInfo/CostInfo';
import { Line } from '../../Line/Line';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/common/config/routes';

export const ItemsContainer = () => {
  const navigate = useNavigate();
  const handleBackShopping = () => {
    navigate(ROUTES.SHOP);
  };

  return (
    <div className={s.itemsWrapper}>
      <ItemCard />
      <ItemCard />
      <ItemCard />
      <Line />
      <CostInfo text="Subtotal" />
      <Button className={s.button} onClick={handleBackShopping}>
        back to shopping
      </Button>
    </div>
  );
};
