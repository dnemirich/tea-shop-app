import s from './RegistrationForm.module.scss';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { registrationSchema } from './validation.ts';
import { zodResolver } from '@hookform/resolvers/zod';

import { createCustomer } from '@/features/registration/api';
import { type Address, Countries, type Customer } from '@/common/types/user-types.ts';
import { useAppStore } from '@/common/store/app-store.ts';
import { KeyRound, Mail } from 'lucide-react';
import { ROUTES } from '@/common/config/routes.ts';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@/features/login/api/authService.ts';
import { InputField } from '@/common/components/InputField/InputField.tsx';
import { Checkbox } from '@/common/components/Checkbox/Checkbox.tsx';
import { SelectField } from '@/common/components/SelectField/SelectField.tsx';
import { Button } from '@/common/components/Button/Button.tsx';

export type RegistrationFormData = z.infer<typeof registrationSchema>;

const countryOptions = [
  { value: 'Russia', label: 'Russia' },
  { value: 'Belarus', label: 'Belarus' },
  { value: 'Kazakhstan', label: 'Kazakhstan' },
  { value: 'Armenia', label: 'Armenia' },
  { value: 'Uzbekistan', label: 'Uzbekistan' },
];

export const RegistrationForm = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isDefaultShipping, setIsDefaultShipping] = useState<boolean>(false);
  const [isDefaultBilling, setIsDefaultBilling] = useState<boolean>(false);

  const navigate = useNavigate();

  const { setAppError, clearError } = useAppStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormData>({ resolver: zodResolver(registrationSchema) });

  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    const addresses: Address[] = [
      {
        country: Countries[data.shippingAddress.country],
        city: data.shippingAddress.city,
        postalCode: data.shippingAddress.postalCode,
        streetName: data.shippingAddress.street.split(' ')[0],
        streetNumber: data.shippingAddress.street.split(' ')[1],
      },
      ...(isChecked && data.billingAddress
        ? [
            {
              country: Countries[data.billingAddress.country],
              city: data.billingAddress.city,
              postalCode: data.billingAddress.postalCode,
              streetName: data.billingAddress.street.split(' ')[0],
              streetNumber: data.billingAddress.street.split(' ')[1],
            },
          ]
        : []),
    ];

    const shippingIndex = 0;
    const billingIndex = isChecked ? 1 : shippingIndex;

    const finalData: Customer = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: new Date(data.dateOfBirth).toISOString().split('T')[0],
      addresses,
      defaultShippingAddress: isDefaultShipping ? shippingIndex : undefined,
      defaultBillingAddress: isDefaultBilling ? billingIndex : undefined,
    };

    createCustomer(finalData)
      .then(() => {
        // console.log(res);
        clearError();
        authService
          .login(finalData.email, finalData.password, false)
          .then(() => navigate(ROUTES.HOME, { replace: true }))
          .catch((e) => {
            setAppError(e.message);
          });
        reset();
      })
      .catch((err) => setAppError(err.message));
  };

  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={s.formFields}>
        <div className={s.formColumn}>
          <div className={s.fieldsWrapper}>
            <InputField
              {...register('firstName')}
              placeholder="First name"
              error={errors.firstName?.message}
            />
            <InputField
              {...register('lastName')}
              placeholder="Last name"
              error={errors.lastName?.message}
            />
          </div>
          <div>
            <InputField
              {...register('dateOfBirth')}
              type={'date'}
              info="Date of birth"
              error={errors.dateOfBirth?.message}
            />
          </div>
          <div className={s.label}>
            <InputField
              style={{
                padding: '1.6rem 5.2rem 1.6rem 4.5rem',
              }}
              icon={<Mail className={s.imgIcon} size={24} />}
              {...register('email')}
              placeholder={'Email address'}
              error={errors.email?.message}
            />
          </div>
          <div className={s.label}>
            <InputField
              style={{
                padding: '1.6rem 5.2rem 1.6rem 4.5rem',
              }}
              type="password"
              icon={<KeyRound className={s.imgIcon} />}
              {...register('password')}
              placeholder={'Create strong password'}
              info="Password should contain at least one digit and lower- and upper-case letters"
              error={errors.password?.message}
            />
          </div>
          <div className={s.label}>
            <InputField
              style={{
                padding: '1.6rem 5.2rem 1.6rem 4.5rem',
              }}
              type="password"
              icon={<KeyRound className={s.imgIcon} />}
              {...register('confirmPassword')}
              placeholder={'Repeat your password'}
              error={errors.confirmPassword?.message}
            />
          </div>
        </div>
        <div className={s.formColumn}>
          <h3 className={s.sectionTitle}>Shipping address</h3>
          <InputField
            {...register('shippingAddress.street')}
            placeholder="Street and house"
            error={errors.shippingAddress?.street?.message}
          />
          <div className={s.fieldsWrapper}>
            <InputField
              {...register('shippingAddress.postalCode')}
              type="number"
              placeholder="Postal code"
              error={errors.shippingAddress?.postalCode?.message}
            />
            <div>
              <InputField
                {...register('shippingAddress.city')}
                placeholder="City"
                error={errors.shippingAddress?.city?.message}
              />
            </div>
          </div>
          <SelectField
            {...register('shippingAddress.country')}
            options={countryOptions}
            error={errors.shippingAddress?.country?.message}
          />
          <Checkbox
            checked={isDefaultShipping}
            onChange={() => setIsDefaultShipping(!isDefaultShipping)}
            label="Set as default shipping address"
          />
          <div>
            <h3 className={s.sectionTitle}>Billing address</h3>
            <span className={s.sectionSupplementaryText}>(Same as shipping address)</span>
          </div>
          <Checkbox
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            label="Bill to different address"
          />
          {isChecked && (
            <>
              <InputField
                {...register('billingAddress.street')}
                placeholder="Street and house"
                error={errors.billingAddress?.street?.message}
              />
              <div className={s.fieldsWrapper}>
                <InputField
                  {...register('billingAddress.postalCode')}
                  type="number"
                  placeholder="Postal code"
                  error={errors.billingAddress?.postalCode?.message}
                />
                <InputField
                  {...register('billingAddress.city')}
                  placeholder="City"
                  error={errors.billingAddress?.city?.message}
                />
              </div>
              <SelectField
                {...register('billingAddress.country')}
                options={countryOptions}
                error={errors.billingAddress?.country?.message}
              />
              <Checkbox
                checked={isDefaultBilling}
                onChange={() => setIsDefaultBilling(!isDefaultBilling)}
                label="Set as default billing address"
              />
            </>
          )}
        </div>
      </div>
      <Button type="submit" className={s.btn}>
        Sign up
      </Button>
      <p className={s.supplementaryText}>
        Already have an account?{' '}
        <span className={s.link}>
          <Link to={ROUTES.LOGIN}>Log in</Link>
        </span>
      </p>
    </form>
  );
};
