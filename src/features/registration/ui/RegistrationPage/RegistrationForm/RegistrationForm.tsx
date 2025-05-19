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
import { Link } from 'react-router-dom';

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export const RegistrationForm = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isDefaultShipping, setIsDefaultShipping] = useState<boolean>(false);
  const [isDefaultBilling, setIsDefaultBilling] = useState<boolean>(false);

  const { setAppError } = useAppStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormData>({ resolver: zodResolver(registrationSchema) });

  const onSubmit: SubmitHandler<RegistrationFormData> = (data) => {
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
      .then((res) => {
        console.log(res);
        reset();
      })
      .catch((err) => setAppError(err.message));
  };

  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={s.formFields}>
        <div className={s.formColumn}>
          <div className={s.fieldsWrapper}>
            <div>
              <input {...register('firstName')} className={s.input} placeholder={'First name'} />
              {errors.firstName && <span className={s.error}>{errors.firstName.message}</span>}
            </div>
            <div>
              <input {...register('lastName')} className={s.input} placeholder={'Last name'} />
              {errors.lastName && <span className={s.error}>{errors.lastName.message}</span>}
            </div>
          </div>
          <label>
            <input {...register('dateOfBirth')} className={s.input} type={'date'} />
            <span className={s.info}>Date of birth</span>
            {errors.dateOfBirth && <span className={s.error}>{errors.dateOfBirth.message}</span>}
          </label>
          <label className={s.label}>
            <Mail className={s.icon} size={24} />
            <input
              {...register('email')}
              className={`${s.input} ${s.inputWithIcon}`}
              placeholder={'Email address'}
            />
            {errors.email && <span className={s.error}>{errors.email.message}</span>}
          </label>
          <label className={s.label}>
            <KeyRound className={s.icon} />
            <input
              {...register('password')}
              className={`${s.input} ${s.inputWithIcon}`}
              type={'password'}
              placeholder={'Create strong password'}
            />
            <span className={s.info}>
              Password should contain at least one digit and lower- and upper-case letters
            </span>
            {errors.password && <span className={s.error}>{errors.password.message}</span>}
          </label>
          <label className={s.label}>
            <KeyRound className={s.icon} />
            <input
              {...register('confirmPassword')}
              className={`${s.input} ${s.inputWithIcon}`}
              type={'password'}
              placeholder={'Repeat your password'}
            />
            {errors.confirmPassword && (
              <span className={s.error}>{errors.confirmPassword.message}</span>
            )}
          </label>
        </div>
        <div className={s.formColumn}>
          <h3 className={s.sectionTitle}>Shipping address</h3>
          <div>
            <input
              {...register('shippingAddress.street')}
              className={s.input}
              placeholder="Street and house"
            />
            {errors.shippingAddress?.street && (
              <span className={s.error}>{errors.shippingAddress.street?.message}</span>
            )}
          </div>
          <div className={s.fieldsWrapper}>
            <div>
              <input
                {...register('shippingAddress.postalCode')}
                className={s.input}
                placeholder="Postal code"
                type="number"
                maxLength={7}
              />
              {errors.shippingAddress?.postalCode && (
                <span className={s.error}>{errors.shippingAddress.postalCode?.message}</span>
              )}
            </div>
            <div>
              <input {...register('shippingAddress.city')} className={s.input} placeholder="City" />
              {errors?.shippingAddress?.city && (
                <span className={s.error}>{errors.shippingAddress?.city?.message}</span>
              )}
            </div>
          </div>
          <div className={s.selectWrapper}>
            <select {...register('shippingAddress.country')} className={s.select}>
              <option value="">Country</option>
              <option value="Russia">Russia</option>
              <option value="Belarus">Belarus</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Armenia">Armenia</option>
              <option value="Uzbekistan">Uzbekistan</option>
            </select>
            {errors?.shippingAddress?.country && (
              <span className={s.error}>{errors.shippingAddress?.country?.message}</span>
            )}
          </div>
          <label>
            <input type={'checkbox'} onChange={() => setIsDefaultShipping(!isDefaultShipping)} />
            <span className={s.checkboxText}>Set as default shipping address</span>
          </label>
          <div>
            <h3 className={s.sectionTitle}>Billing address</h3>
            <span className={s.sectionSupplementaryText}>(Same as shipping address)</span>
          </div>
          <label>
            <input type={'checkbox'} onChange={() => setIsChecked(!isChecked)} />
            <span className={s.checkboxText}>Bill to different address</span>
          </label>
          {isChecked && (
            <>
              <div>
                <input
                  {...register('billingAddress.street')}
                  className={s.input}
                  placeholder="Street and house"
                />
                {errors.billingAddress?.street && (
                  <span className={s.error}>{errors.billingAddress.street?.message}</span>
                )}
              </div>
              <div className={s.fieldsWrapper}>
                <div>
                  <input
                    {...register('billingAddress.postalCode')}
                    className={s.input}
                    placeholder="Postal code"
                    type="number"
                  />
                  {errors.billingAddress?.postalCode && (
                    <span className={s.error}>{errors.billingAddress.postalCode?.message}</span>
                  )}
                </div>
                <div>
                  <input
                    {...register('billingAddress.city')}
                    className={s.input}
                    placeholder="City"
                  />
                  {errors?.billingAddress?.city && (
                    <span className={s.error}>{errors.billingAddress?.city?.message}</span>
                  )}
                </div>
              </div>
              <div className={s.selectWrapper}>
                <select {...register('billingAddress.country')} className={s.select}>
                  <option value="">Country</option>
                  <option value="Russia">Russia</option>
                  <option value="Belarus">Belarus</option>
                  <option value="Kazakhstan">Kazakhstan</option>
                  <option value="Armenia">Armenia</option>
                  <option value="Uzbekistan">Uzbekistan</option>
                </select>
                {errors?.billingAddress?.country && (
                  <span className={s.error}>{errors.billingAddress?.country?.message}</span>
                )}
              </div>
              <label>
                <input type={'checkbox'} onChange={() => setIsDefaultBilling(!isDefaultBilling)} />
                <span className={s.checkboxText}>Set as default billing address</span>
              </label>
            </>
          )}
        </div>
      </div>
      <button type={'submit'} className={s.btn}>
        Sign up
      </button>
      <p className={s.supplementaryText}>
        Already have an account?{' '}
        <span className={s.link}>
          <Link to={ROUTES.LOGIN}>Log in</Link>
        </span>
      </p>
    </form>
  );
};
