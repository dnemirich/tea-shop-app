import { z } from 'zod';
import mailIcon from '../../assets/mail.svg';
import passwordIcon from '../../assets/redeem.svg';
import cl from './LoginPage.module.css';
import { useForm } from 'react-hook-form';

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

  return (
    <div className={cl.login_page_wrapper}>
      <form onSubmit={handleSubmit(onSubmit)} className={cl.form} noValidate>
        <div className={cl.form_title}>
          <h2>Already a customer?</h2>
          <p>Welcome back! Sign in for faster checkout.</p>
        </div>
        <div>
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
        <div>
          <label className={cl.form_label}>
            <img className={cl.img_icon} src={passwordIcon} alt="mail-img" />
            <input
              {...register('password')}
              className={cl.form_input}
              type="password"
              placeholder="Enter your password"
            />
          </label>
          {errors.password && <p className={cl.input_error}>{`${errors.password.message}`}</p>}
        </div>
        <div className={cl.form_options}>
          <label className={cl.form_checkbox_label}>
            <input type="checkbox" className={cl.form_checkbox_input} {...register('rememberMe')} />
            Please remember me
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
