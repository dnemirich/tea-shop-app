import { Checkbox } from '@/common/components/Checkbox/Checkbox';
import { DeliveryForm } from './DeliveryForm/DeliveryForm';
import s from './deliveryPage.module.scss';
import { InputField } from '@/common/components/InputField/InputField';
import { OrderSummary } from '../MyBagPage/OrderSummary/OrderSummary';

export const DeliveryPage = () => {
  return (
    <div className={s.deliveryPageWrapper}>
      <DeliveryForm />
      <div className={s.rightSide}>
        <div className={s.infoWrapper}>
          <p className={s.title}>Billing Address</p>
          <p className={s.subTitle}>(Same as shipping address)</p>
          <Checkbox label="Bill to different address" />
        </div>
        <div>
          <p className={s.title}>Contact information</p>
          <InputField placeholder="Email Address" />
        </div>
      </div>
      <OrderSummary text="go to payment" className={s.summary} />
    </div>
  );
};
