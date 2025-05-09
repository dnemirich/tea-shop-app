import s from './RegistrationForm.module.scss';
import cardIcon from '@/assets/card.svg';
import mailIcon from '@/assets/mail.svg';
import { useState } from 'react';

export const RegistrationForm = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <form className={s.form}>
      <div className={s.formFields}>
        <div className={s.formColumn}>
          <div className={s.fieldsWrapper}>
            <input className={s.input} placeholder={'First name'} />
            <input className={s.input} placeholder={'Last name'} />
          </div>
          <label>
            <input className={s.input} type={'date'} />
            <span className={s.info}>Date of birth</span>
          </label>
          <label className={s.label}>
            <img src={mailIcon} alt="calendar" className={s.icon} />
            <input className={`${s.input} ${s.inputWithIcon}`} placeholder={'Email address'} />
          </label>
          <label className={s.label}>
            <img src={cardIcon} alt="card icon" className={s.icon} />
            <input
              className={`${s.input} ${s.inputWithIcon}`}
              type={'password'}
              placeholder={'Create strong password'}
            />
            <span className={s.info}>
              Password should contain at least one digit, one special symbol and lower- and
              upper-case letters
            </span>
          </label>
          <label className={s.label}>
            <img src={cardIcon} alt="card icon" className={s.icon} />
            <input
              className={`${s.input} ${s.inputWithIcon}`}
              type={'password'}
              placeholder={'Repeat your password'}
            />
          </label>
        </div>
        <div className={s.formColumn}>
          <h3 className={s.sectionTitle}>Shipping address</h3>
          <input className={s.input} placeholder={'Street and house'} />
          <div className={s.fieldsWrapper}>
            <input className={s.input} type={'number'} placeholder={'Postal code'} />
            <input className={s.input} placeholder={'City'} />
          </div>
          <div className={s.selectWrapper}>
            <select className={s.select}>
              <option>Country</option>
              <option>Russia</option>
              <option>Belarus</option>
              <option>Kazakhstan</option>
              <option>Armenia</option>
              <option>Uzbekistan</option>
            </select>
          </div>

          <h3 className={s.sectionTitle}>Billing address</h3>
          <span className={s.sectionSupplementaryText}>(Same as shipping address)</span>
          <label>
            <input type={'checkbox'} onChange={() => setIsChecked(!isChecked)} />
            <span className={s.checkboxText}>Bill to different address</span>
          </label>
          {isChecked && (
            <>
              <input className={s.input} placeholder={'Street and house'} />
              <div className={s.fieldsWrapper}>
                <input className={s.input} type={'number'} placeholder={'Postal code'} />
                <input className={s.input} placeholder={'City'} />
              </div>
              <div className={s.selectWrapper}>
                <select className={s.select}>
                  <option>Country</option>
                  <option>Russia</option>
                  <option>Belarus</option>
                  <option>Kazakhstan</option>
                  <option>Armenia</option>
                  <option>Uzbekistan</option>
                </select>
              </div>
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
