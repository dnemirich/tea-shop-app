import { z } from 'zod';
import mailIcon from '../../assets/mail.svg';
import passwordIcon from '../../assets/redeem.svg';
import cl from './LoginPage.module.css';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

const loginSchema = z
  .object({
    email: z.string().trim().email({ message: 'Please enter a valid email (example@gmail.com)' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    rememberMe: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    const { password } = val;

    if (!/[a-z]/.test(password)) {
      ctx.addIssue({
        path: ['password'],
        code: z.ZodIssueCode.custom,
        message: 'Password must contain at least one lowercase letter',
      });
    }

    if (!/[A-Z]/.test(password)) {
      ctx.addIssue({
        path: ['password'],
        code: z.ZodIssueCode.custom,
        message: 'Password must contain at least one uppercase letter',
      });
    }

    if (!/\d/.test(password)) {
      ctx.addIssue({
        path: ['password'],
        code: z.ZodIssueCode.custom,
        message: 'Password must contain at least one number',
      });
    }

    if (/^\s|\s$/.test(password)) {
      ctx.addIssue({
        path: ['password'],
        code: z.ZodIssueCode.custom,
        message: 'Password must not have leading or trailing whitespace',
      });
    }
  });

type FormValueType = z.infer<typeof loginSchema>;

function LoginPage() {
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

  const [showPassword, setShowPassword] = useState(false);
  const [hasCyrillic, setHasCyrillic] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const containsCyrillic = (text: string) => /[а-яА-ЯёЁ]/.test(text);

  return (
    <div className={cl.login_page_wrapper}>
      <form onSubmit={handleSubmit(onSubmit)} className={cl.form} noValidate>
        <div className={cl.form_title}>
          <h2>Already a customer?</h2>
          <p>Welcome back! Sign in for faster checkout.</p>
        </div>
        <div className={cl.label_wrapper}>
          <label className={cl.form_label}>
            <img className={cl.img_icon} src={mailIcon} alt="mail-img" />
            <input
              {...register('email')}
              className={cl.form_input}
              type="email"
              placeholder="Email Address"
            />
          </label>
          {errors.email && <p className={cl.input_error}>{`${errors.email.message}`}</p>}
        </div>
        <div className={cl.label_wrapper}>
          <label className={cl.form_label}>
            <img className={cl.img_icon} src={passwordIcon} alt="mail-img" />
            <input
              {...register('password')}
              className={cl.form_input}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              onChange={(e) => {
                const char = e.target.value;
                setHasCyrillic(containsCyrillic(char));
              }}
            />
            <button type="button" onClick={togglePasswordVisibility} className={cl.toggle_button}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </label>
          {errors.password && <p className={cl.input_error}>{`${errors.password.message}`}</p>}
          {hasCyrillic && (
            <p className={cl.input_warning}>Please make sure your keyboard is set to English</p>
          )}
        </div>
        <div className={cl.form_options}>
          <label className={cl.form_checkbox_label} htmlFor="checkbox-Input">
            <input
              type="checkbox"
              id="checkbox_input"
              className={cl.form_checkbox_input}
              {...register('rememberMe')}
            />
            <span>Please remember me</span>
          </label>
          <a className={cl.form_link} href="/#">
            Forgot password?
          </a>
        </div>
        <button disabled={isSubmitting} type="submit" className={cl.signIn_button}>
          SIGN IN
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
