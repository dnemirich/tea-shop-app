import mailIcon from '@/assets/mail.svg';
import passwordIcon from '@/assets/redeem.svg';
import cl from './loginPageForm.module.css';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { FormValueType, loginSchema } from './validation';
import { createCustomerApiRoot } from './password-flow-client';

export const LoginPageForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [hasCyrillic, setHasCyrillic] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    clearErrors,
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

    try {
      const apiRoot = createCustomerApiRoot(data.email, data.password);
      const response = await apiRoot.me().get().execute();
      console.log('Password flow user:', response.body);

      reset();
    } catch (err: unknown) {
      console.log('Login error:', err);

      clearErrors('email');
      clearErrors('password');

      setError('password', {
        type: 'manual',
        message: 'Incorrect email or password',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const containsCyrillic = (text: string) => /[а-яА-ЯёЁ]/.test(text);

  return (
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
            onChange={(e) => {
              setHasCyrillic(containsCyrillic(e.target.value));
              clearErrors('email');
            }}
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
              clearErrors('password');
            }}
          />
          <button type="button" onClick={togglePasswordVisibility} className={cl['toggle-button']}>
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
  );
};
