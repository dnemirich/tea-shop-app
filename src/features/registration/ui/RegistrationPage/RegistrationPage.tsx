import { RegistrationForm } from './RegistrationForm/RegistrationForm.tsx';
import s from './RegistrationPage.module.scss';

export const RegistrationPage = () => {
  return (
    <div>
      <div> HEADER</div>
      {/* main and container would be parts of a common layout later*/}
      <div className={s.main}>
        <div className={s.container}>
          <div className={s.formContainer}>
            <h2 className={s.title}>Join our tea-loving community</h2>
            <p className={s.supplementText}>
              Sign up to easily track your orders, manage your details, and stay updated with our
              latest arrivals.
            </p>
            <RegistrationForm />
          </div>
        </div>
      </div>
      <div>FOOTER</div>
    </div>
  );
};
