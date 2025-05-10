import mailIcon from '@/assets/mail.svg';
import passwordIcon from '@/assets/redeem.svg';
import cl from './LoginPage.module.css';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { FormValueType, loginSchema } from './validation';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [hasCyrillic, setHasCyrillic] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValueType>({
    defaultValues: {
      rememberMe: false,
    },
    mode: 'onTouched',
  });

  const onSubmit = async (data: FormValueType) => {
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        if (field === 'email' || field === 'password') {
          setError(field, {
            type: 'manual',
            message: err.message,
          });
        }
      });
      return;
    }

    reset();
    console.log('Submitted', data);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const containsCyrillic = (text: string) => /[а-яА-ЯёЁ]/.test(text);

  return (
    <div className={cl['login-page-wrapper']}>
      <form onSubmit={handleSubmit(onSubmit)} className={cl.form} noValidate>
        <div className={cl['form-title']}>
          <h2>Already a customer?</h2>
          <p>Welcome back! Sign in for faster checkout.</p>
        </div>
        <div className={cl['label-wrapper']}>
          <label className={cl['form-label']}>
            <img className={cl['img-icon']} src={mailIcon} alt="mail-img" />
            <input
              {...register('email')}
              className={cl['form-input']}
              type="email"
              placeholder="Email Address"
            />
          </label>
          {errors.email && <p className={cl['input-error']}>{`${errors.email.message}`}</p>}
        </div>
        <div className={cl['label-wrapper']}>
          <label className={cl['form-label']}>
            <img className={cl['img-icon']} src={passwordIcon} alt="mail-img" />
            <input
              {...register('password')}
              className={cl['form-input']}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              onChange={(e) => {
                const value = e.target.value;
                setHasCyrillic(containsCyrillic(value));
              }}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={cl['toggle-button']}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </label>
          {errors.password && <p className={cl['input-error']}>{`${errors.password.message}`}</p>}
          {hasCyrillic && (
            <p className={cl['input-warning']}>Please make sure your keyboard is set to English</p>
          )}
        </div>
        <div className={cl['form-options']}>
          <label className={cl['form-checkbox-label']} htmlFor="checkbox-Input">
            <input
              type="checkbox"
              id="checkbox_input"
              className={cl['form-checkbox-input']}
              {...register('rememberMe')}
            />
            <span>Please remember me</span>
          </label>
          <a className={cl['form-link']} href="/#">
            Forgot password?
          </a>
        </div>
        <button disabled={isSubmitting} type="submit" className={cl['sign-in-button']}>
          SIGN IN
        </button>
      </form>
    </div>
  );
};
