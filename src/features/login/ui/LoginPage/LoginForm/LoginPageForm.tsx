import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/features/login/api/authService';
import { useAppStore } from '@/common/store/app-store';
import { useUserStore } from '@/common/store/user-store';
import { ROUTES } from '@/common/config/routes';
import s from './LoginPageForm.module.scss';
import cl from '@/common/components/InputField/InputField.module.scss';
import { useState } from 'react';
import { FormValueType, loginSchema } from '../validation.ts';
import { KeyRound, Mail } from 'lucide-react';
import { InputField } from '@/common/components/InputField/InputField.tsx';
import { PasswordInput } from '@/common/components/PasswordInput/PasswordInput.tsx';
import { Checkbox } from '@/common/components/Checkbox/Checkbox.tsx';
import { Button } from '@/common/components/Button/Button.tsx';

export type LoginFormData = z.infer<typeof loginSchema>;
type Props = {
  onSuccess: () => void;
};

export const LoginPageForm = ({ onSuccess }: Props) => {
  const navigate = useNavigate();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const setAppError = useAppStore((s) => s.setAppError);
  const clearError = useAppStore((s) => s.clearError);

  const [hasCyrillic, setHasCyrillic] = useState(false);
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
      .then(() => {
        onSuccess();
      })
      .catch((e) => {
        setAppError(e.message);
      });
  };

  const containsCyrillic = (text: string) => /[а-яА-ЯёЁ]/.test(text);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.form} noValidate>
      <div className={s.formTitle}>
        <h2>Already a customer?</h2>
        <p>Welcome back! Sign in for faster checkout.</p>
      </div>
      <div className={s.labelWrapper}>
        <InputField
          style={{
            padding: '1.6rem 5.2rem 1.6rem 4.5rem',
          }}
          icon={<Mail className={s.imgIcon} />}
          placeholder="Email Address"
          type="email"
          error={errors.email?.message}
          {...register('email')}
          onChange={(e) => {
            setHasCyrillic(containsCyrillic(e.target.value));
            clearErrors('email');
          }}
        />
      </div>
      <div className={s.labelWrapper}>
        <PasswordInput
          style={{
            padding: '1.6rem 5.2rem 1.6rem 4.5rem',
          }}
          icon={<KeyRound className={s.imgIcon} />}
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
          onChange={(e) => {
            setHasCyrillic(containsCyrillic(e.target.value));
            clearErrors('password');
          }}
        />
        {hasCyrillic && (
          <p className={cl.error}>Please make sure your keyboard is set to English</p>
        )}
      </div>
      <div className={s.formOptions}>
        <Checkbox label="Please remember me" {...register('rememberMe')} />
        <a className={s.formLink} href="/#">
          Forgot password?
        </a>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        sign in
      </Button>
    </form>
  );
};
