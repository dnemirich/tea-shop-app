import { LoginPageForm } from './LoginForm/LoginPageForm.tsx';
import s from './LoginPage.module.scss';
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
    <div className={s.loginPageWrapper}>
      <LoginPageForm onSuccess={() => navigate(ROUTES.HOME)} />
    </div>
  );
};
