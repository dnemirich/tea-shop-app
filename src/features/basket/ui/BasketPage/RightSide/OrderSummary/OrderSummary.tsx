import { Button } from '@/common/components/Button/Button';
import { CostInfo } from '../../CostInfo/CostInfo';
import { Line } from '../../Line/Line';
import s from './orderSummary.module.scss';

export const OrderSummary = () => {
  return (
    <div className={s.orderSummaryWrapper}>
      <h2>Order summary</h2>
      <CostInfo text="Subtotal" className={s.costTitle} />
      <CostInfo text="Delivery" className={s.costTitle} />
      <Line />
      <CostInfo text="Total" className={s.costTitle} />
      <p className={s.shippingInfo}>Estimates shipping time: 2 days</p>
      <Button>check out</Button>
    </div>
  );
};
