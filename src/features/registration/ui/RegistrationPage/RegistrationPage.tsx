import { RegistrationForm } from './RegistrationForm/RegistrationForm.tsx';
import s from './RegistrationPage.module.scss';

export const RegistrationPage = () => {
  return (
    <div className={s.formContainer}>
      <h2 className={s.title}>Join our tea-loving community</h2>
      <p className={s.supplementText}>
        Sign up to easily track your orders, manage your details, and stay updated with our latest
        arrivals.
      </p>
      <RegistrationForm />
    </div>
  );
};
