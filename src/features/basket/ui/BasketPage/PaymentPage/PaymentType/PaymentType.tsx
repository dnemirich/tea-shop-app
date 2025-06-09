import { InputField } from '@/common/components/InputField/InputField';
import s from './paymentType.module.scss';

export const PaymentType = () => {
  return (
    <div className={s.paymentPageWrapper}>
      <p className={s.title}>Payment type</p>
      <div className={s.cardInfo}>
        <p className={s.subTitle}>Credit or Debit card</p>
        <div>
          <p className={s.inputTitle}>Card Number</p>
          <InputField placeholder="XXXX XXXX XXXX XXXX" />
        </div>
        <div className={s.inputWrapper}>
          <div>
            <p className={s.inputTitle}>Expired date</p>
            <InputField placeholder="XX / XX" />
          </div>
          <div>
            <p className={s.inputTitle}>CVC</p>
            <InputField type="password" />
          </div>
        </div>
      </div>
    </div>
  );
};
