import { LoginPageForm } from './LoginForm/LoginPageForm.tsx';
import cl from './LoginForm/loginPageForm.module.css';

export const LoginPage = () => {
  return (
    <div className={cl['login-page-wrapper']}>
      <LoginPageForm />
    </div>
  );
};
