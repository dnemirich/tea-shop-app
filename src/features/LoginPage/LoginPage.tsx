import { z } from 'zod';
import mailIcon from '../../assets/mail.svg';
import passwordIcon from '../../assets/redeem.svg';
import cl from './LoginPage.module.css';
import { useForm } from 'react-hook-form';

const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Please enter a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .refine((val) => /a-z/.test(val), {
      message: 'Password must contain at least one lowercase letter',
    })
    .refine((val) => /A-Z/.test(val), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine((val) => /\d/.test(val), {
      message: 'Password must contain at least one number',
    })
    .refine((val) => !/^\s|\s$/.test(val), {
      message: 'Password must not have leading or trailing whitespace',
    }),
  rememberMe: z.boolean().optional(),
});

type FormValueType = z.infer<typeof loginSchema>;

function LoginPage() {
  const { register, handleSubmit, setError, reset } = useForm<FormValueType>({
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: FormValueType) => {
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      result.error.errors.forEach((err) => {
        const field = err.path[0];
        if (field === 'email' || field === 'password' || field === 'rememberMe') {
          setError(field as keyof FormValueType, {
            type: 'manual',
            message: err.message,
          });
        }
      });
      return;
    }

    console.log('submitted');
    reset();
  };

  return (
    <div className={cl.login_page_wrapper}>
      <form onSubmit={handleSubmit(onSubmit)} className={cl.form} noValidate>
        <div className={cl.form_title}>
          <h2>Already a customer?</h2>
          <p>Welcome back! Sign in for faster checkout.</p>
        </div>
        <label className={cl.form_label}>
          <img className={cl.img_icon} src={mailIcon} alt="mail-img" />
          <input
            {...register('email')}
            className={cl.form_input}
            type="email"
            placeholder="Email Address"
          />
        </label>
        <label className={cl.form_label}>
          <img className={cl.img_icon} src={passwordIcon} alt="mail-img" />
          <input
            {...register('password')}
            className={cl.form_input}
            type="password"
            placeholder="Enter your password"
          />
        </label>
        <div className={cl.form_options}>
          <label className={cl.form_checkbox_label}>
            <input type="checkbox" className={cl.form_checkbox_input} />
            Please remember me
          </label>
          <a className={cl.form_link} href="/#">
            Forgot password?
          </a>
        </div>
        <button type="submit" className={cl.signIn_button}>
          SIGN IN
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
