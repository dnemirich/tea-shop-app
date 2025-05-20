import { LoginPageForm } from './LoginForm/LoginPageForm.tsx';
import cl from './LoginForm/LoginPageForm.module.scss';
import { useUserStore } from '@/common/store/user-store.ts';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/common/config/routes.ts';
import { Navigate } from 'react-router';

export const LoginPage = () => {
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const navigate = useNavigate();

  if (isLoggedIn) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return (
    <div className={cl.loginPageWrapper}>
      <LoginPageForm onSuccess={() => navigate(ROUTES.HOME)} />
    </div>
  );
};
