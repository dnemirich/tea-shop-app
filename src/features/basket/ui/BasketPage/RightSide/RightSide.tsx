import { PaymentType } from '../PaymentType/PaymentType';
import { OrderSummary } from '../OrderSummary/OrderSummary';
import s from './rightSide.module.scss';

export const RightSide = () => {
  return (
    <div className={s.rightSideWrapper}>
      <OrderSummary />
      <PaymentType />
    </div>
  );
};
