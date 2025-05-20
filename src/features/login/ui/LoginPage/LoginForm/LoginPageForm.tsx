import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/features/login/api/authService';
import { useAppStore } from '@/common/store/app-store';
import { useUserStore } from '@/common/store/user-store';
import { ROUTES } from '@/common/config/routes';
import cl from './LoginPageForm.module.scss';
import { useState } from 'react';
import { FormValueType, loginSchema } from '../validation.ts';
import { Modal } from '@/common/components/Modal/Modal.tsx';
import { KeyRound, Mail } from 'lucide-react';

export type LoginFormData = z.infer<typeof loginSchema>;
type Props = {
  onSuccess: () => void;
};

export const LoginPageForm = ({ onSuccess }: Props) => {
  const navigate = useNavigate();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const setAppError = useAppStore((s) => s.setAppError);
  const clearError = useAppStore((s) => s.clearError);

  const [showPassword, setShowPassword] = useState(false);
  const [hasCyrillic, setHasCyrillic] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { rememberMe: false },
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isLoggedIn, navigate, clearErrors]);

  const onSubmit = async (data: FormValueType) => {
    clearError();
    authService
      .login(data.email, data.password, data.rememberMe)
      .then(() => onSuccess())
      .catch((e) => {
        setAppError(e.message);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const containsCyrillic = (text: string) => /[а-яА-ЯёЁ]/.test(text);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cl.form} noValidate>
      {isModalOpen && (
        <Modal message="You have successfully signed in!" onClose={() => setIsModalOpen(false)} />
      )}
      <div className={cl.formTitle}>
        <h2>Already a customer?</h2>
        <p>Welcome back! Sign in for faster checkout.</p>
      </div>
      <div className={cl.labelWrapper}>
        <label className={cl.formLabel}>
          <Mail className={cl.imgIcon} />
          <input
            {...register('email')}
            className={cl.formInput}
            type="email"
            placeholder="Email Address"
            onChange={(e) => {
              setHasCyrillic(containsCyrillic(e.target.value));
              clearErrors('email');
            }}
          />
        </label>
        {errors.email && <p className={cl.inputError}>{`${errors.email.message}`}</p>}
      </div>
      <div className={cl.labelWrapper}>
        <label className={cl.formLabel}>
          <KeyRound className={cl.imgIcon} />
          <input
            {...register('password')}
            className={cl.formInput}
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            onChange={(e) => {
              const value = e.target.value;
              setHasCyrillic(containsCyrillic(value));
              clearErrors('password');
            }}
          />
          <button type="button" onClick={togglePasswordVisibility} className={cl.toggleButton}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </label>
        {errors.password && <p className={cl.inputError}>{`${errors.password.message}`}</p>}
        {hasCyrillic && (
          <p className={cl.inputWarning}>Please make sure your keyboard is set to English</p>
        )}
      </div>
      <div className={cl.formOptions}>
        <label className={cl.formCheckboxLabel} htmlFor="checkbox-Input">
          <input
            type="checkbox"
            id="checkbox_input"
            className={cl.formCheckboxInput}
            {...register('rememberMe')}
          />
          <span>Please remember me</span>
        </label>
        <a className={cl.formLink} href="/#">
          Forgot password?
        </a>
      </div>
      <button disabled={isSubmitting} type="submit" className={cl.signInButton}>
        SIGN IN
      </button>
    </form>
  );
};
