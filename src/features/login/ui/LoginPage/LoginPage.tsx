import { LoginPageForm } from './LoginForm/LoginPageForm.tsx';
import cl from './LoginForm/loginPageForm.module.css';
import { useUserStore } from '@/common/store/user-store.ts';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/common/config/routes.ts';
import { Navigate } from 'react-router';

export const LoginPage = () => {
  const isLoggedIn = useUserStore(s => s.isLoggedIn)
  const navigate = useNavigate()

  if (isLoggedIn) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return (
    <div className={cl['login-page-wrapper']}>
      <LoginPageForm onSuccess={() => navigate(ROUTES.HOME)}
      />
    </div>
  );
};
