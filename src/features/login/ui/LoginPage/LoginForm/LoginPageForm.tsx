// import cl from './loginPageForm.module.css';
// import { useForm } from 'react-hook-form';
// import { useState } from 'react';
// import { FormValueType, loginSchema } from '../validation.ts';
// import { Modal } from '@/common/components/Modal/Modal.tsx';
// import { KeyRound, Mail } from 'lucide-react';
// import { useUserStore } from '@/common/store/user-store.ts';
// import { useNavigate } from 'react-router';
// import { authService } from '@/features/login/api/authService.ts';
// import { ROUTES } from '@/common/config/routes.ts';
//
// export const LoginPageForm = () => {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [hasCyrillic, setHasCyrillic] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const { setIsLoggedIn } = useUserStore();
//
//   const {
//     register,
//     handleSubmit,
//     setError,
//     reset,
//     clearErrors,
//     formState: { errors, isSubmitting },
//   } = useForm<FormValueType>({
//     defaultValues: {
//       rememberMe: false,
//     },
//     mode: 'onTouched',
//   });
//
//   const onSubmit = async (data: FormValueType) => {
//     const result = loginSchema.safeParse(data);
//
//     if (!result.success) {
//       result.error.errors.forEach((err) => {
//         const field = err.path[0];
//         if (field === 'email' || field === 'password') {
//           setError(field, {
//             type: 'manual',
//             message: err.message,
//           });
//         }
//       });
//       return;
//     }
//
//     try {
//       await authService.login(data.email, data.password, data.rememberMe || false);
//       // setIsLoggedIn(true);
//       setIsModalOpen(true);
//       reset();
//       setTimeout(() => {
//         navigate(ROUTES.HOME);
//       }, 1500);
//     } catch (err: unknown) {
//       clearErrors('email');
//       clearErrors('password');
//
//       setError('password', {
//         type: 'manual',
//         message: 'Incorrect email or password',
//       });
//     }
//   };
//
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };
//
//   const containsCyrillic = (text: string) => /[а-яА-ЯёЁ]/.test(text);
//
//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className={cl.form} noValidate>
//       {isModalOpen && (
//         <Modal message="You have successfully signed in!" onClose={() => setIsModalOpen(false)} />
//       )}
//       <div className={cl['form-title']}>
//         <h2>Already a customer?</h2>
//         <p>Welcome back! Sign in for faster checkout.</p>
//       </div>
//       <div className={cl['label-wrapper']}>
//         <label className={cl['form-label']}>
//           <Mail className={cl['img-icon']} />
//           <input
//             {...register('email')}
//             className={cl['form-input']}
//             type="email"
//             placeholder="Email Address"
//             onChange={(e) => {
//               setHasCyrillic(containsCyrillic(e.target.value));
//               clearErrors('email');
//             }}
//           />
//         </label>
//         {errors.email && <p className={cl['input-error']}>{`${errors.email.message}`}</p>}
//       </div>
//       <div className={cl['label-wrapper']}>
//         <label className={cl['form-label']}>
//           <KeyRound className={cl['img-icon']} />
//           <input
//             {...register('password')}
//             className={cl['form-input']}
//             type={showPassword ? 'text' : 'password'}
//             placeholder="Enter your password"
//             onChange={(e) => {
//               const value = e.target.value;
//               setHasCyrillic(containsCyrillic(value));
//               clearErrors('password');
//             }}
//           />
//           <button type="button" onClick={togglePasswordVisibility} className={cl['toggle-button']}>
//             {showPassword ? 'Hide' : 'Show'}
//           </button>
//         </label>
//         {errors.password && <p className={cl['input-error']}>{`${errors.password.message}`}</p>}
//         {hasCyrillic && (
//           <p className={cl['input-warning']}>Please make sure your keyboard is set to English</p>
//         )}
//       </div>
//       <div className={cl['form-options']}>
//         <label className={cl['form-checkbox-label']} htmlFor="checkbox-Input">
//           <input
//             type="checkbox"
//             id="checkbox_input"
//             className={cl['form-checkbox-input']}
//             {...register('rememberMe')}
//           />
//           <span>Please remember me</span>
//         </label>
//         <a className={cl['form-link']} href="/#">
//           Forgot password?
//         </a>
//       </div>
//       <button disabled={isSubmitting} type="submit" className={cl['sign-in-button']}>
//         SIGN IN
//       </button>
//     </form>
//   );
// };

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/features/login/api/authService';
import { useAppStore } from '@/common/store/app-store';
import { useUserStore } from '@/common/store/user-store';
import { ROUTES } from '@/common/config/routes';
import cl from './loginPageForm.module.css';
import { useState } from 'react';
import { FormValueType, loginSchema } from '../validation.ts';
import { Modal } from '@/common/components/Modal/Modal.tsx';
import { KeyRound, Mail } from 'lucide-react';

export type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPageForm = () => {
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
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { rememberMe: false },
  });

  const allValues = watch();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(ROUTES.HOME, { replace: true });
    }

    (Object.keys(allValues) as Array<keyof FormValueType>).forEach((field) => {
      if (allValues[field] === '') {
        clearErrors(field as any);
      }
    });
  }, [isLoggedIn, navigate, allValues, clearErrors]);

  const onSubmit = async (data: FormValueType) => {
    clearError();
    authService.login(data.email, data.password, data.rememberMe).catch((e) => {
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
      <div className={cl['form-title']}>
        <h2>Already a customer?</h2>
        <p>Welcome back! Sign in for faster checkout.</p>
      </div>
      <div className={cl['label-wrapper']}>
        <label className={cl['form-label']}>
          <Mail className={cl['img-icon']} />
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
          <KeyRound className={cl['img-icon']} />
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
