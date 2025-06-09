import { OrderSummary } from '../MyBagPage/OrderSummary/OrderSummary';
import { DeliveryDetails } from './DeliveryDetails/DeliveryDetails';
import s from './paymentPage.module.scss';
import { PaymentType } from './PaymentType/PaymentType';

export const PaymentPage = () => {
  return (
    <div className={s.paymentPageWrapper}>
      <DeliveryDetails />
      <PaymentType />
      <OrderSummary text="pay" className={s.summary} />
    </div>
  );
};
