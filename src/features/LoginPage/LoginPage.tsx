import { LoginPageForm } from './LoginPageForm';
import cl from './loginPageForm.module.css';

export const LoginPage = () => {
  return (
    <>
      <div>Header</div>
      <main className={cl['login-page-wrapper']}>
        <LoginPageForm />
      </main>
      <div>Footer</div>
    </>
  );
};
