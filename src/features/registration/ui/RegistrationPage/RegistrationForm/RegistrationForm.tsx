import s from './RegistrationForm.module.scss';
import cardIcon from '@/assets/card.svg';
import mailIcon from '@/assets/mail.svg';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { z } from 'zod';
import { registrationSchema } from './validation.ts';
import { zodResolver } from '@hookform/resolvers/zod';

export type RegistrationFormData = z.infer<typeof registrationSchema>;

export const RegistrationForm = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isDefaultShipping, setIsDefaultShipping] = useState<boolean>(false);
  const [isDefaultBilling, setIsDefaultBilling] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({ resolver: zodResolver(registrationSchema) });

  const onSubmit: SubmitHandler<RegistrationFormData> = (data) => {
    const finalData = {
      ...data,
      billingAddress: isChecked ? data.billingAddress : data.shippingAddress,
      defaultShippingAddress: isDefaultShipping ? data.shippingAddress : undefined,
      defaultBillingAddress: isDefaultBilling ? data.billingAddress : undefined,
    };
    console.log(finalData);
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
            <input {...register('birthDate')} className={s.input} type={'date'} />
            <span className={s.info}>Date of birth</span>
            {errors.birthDate && <span className={s.error}>{errors.birthDate.message}</span>}
          </label>
          <label className={s.label}>
            <img src={mailIcon} alt="calendar" className={s.icon} />
            <input
              {...register('email')}
              className={`${s.input} ${s.inputWithIcon}`}
              placeholder={'Email address'}
            />
            {errors.email && <span className={s.error}>{errors.email.message}</span>}
          </label>
          <label className={s.label}>
            <img src={cardIcon} alt="card icon" className={s.icon} />
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
            <img src={cardIcon} alt="card icon" className={s.icon} />
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
                type="text"
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
                    type="text"
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
          <a href={'/'}>Log in</a>
        </span>
      </p>
    </form>
  );
};
