import { OrderSummary } from '../OrderSummary/OrderSummary';
import { PaymentType } from '../PaymentType/PaymentType';
import s from './rightSide.module.scss';

export const RightSide = () => {
  return (
    <div className={s.rightSideWrapper}>
      <OrderSummary />
      <PaymentType />
    </div>
  );
};
