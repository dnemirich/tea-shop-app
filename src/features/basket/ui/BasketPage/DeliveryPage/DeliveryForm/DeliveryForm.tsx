import { InputField } from '@/common/components/InputField/InputField';
import s from './deliveryForm.module.scss';
import { SelectField } from '@/common/components/SelectField/SelectField';

export const DeliveryForm = () => {
  const countryOptions = [
    { value: 'Russia', label: 'Russia' },
    { value: 'Belarus', label: 'Belarus' },
    { value: 'Kazakhstan', label: 'Kazakhstan' },
    { value: 'Armenia', label: 'Armenia' },
    { value: 'Uzbekistan', label: 'Uzbekistan' },
  ];

  return (
    <div className={s.form}>
      <p className={s.title}>Shipping Address</p>
      <InputField className={s.input} placeholder="First name" />
      <InputField placeholder="Last name" />
      <InputField placeholder="Street and House" />
      <div className={s.subWrapper}>
        <InputField placeholder="PostCode" />
        <InputField placeholder="City" />
      </div>
      <SelectField options={countryOptions} />
    </div>
  );
};
