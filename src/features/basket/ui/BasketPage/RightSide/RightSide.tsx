import { OrderSummary } from './OrderSummary/OrderSummary';
import s from './rightSide.module.scss';

export const RightSide = () => {
  return (
    <div className={s.rightSideWrapper}>
      <OrderSummary />
    </div>
  );
};
