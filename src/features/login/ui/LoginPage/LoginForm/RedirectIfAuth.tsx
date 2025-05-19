import { useEffect, useState, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/common/store/user-store';
import { authService } from '@/features/login/api/authService';
import { ROUTES } from '@/common/config/routes';

type Props = {
  children: ReactNode;
};

export const RedirectIfAuth = ({ children }: Props) => {
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.restoreSession().finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return isLoggedIn ? <Navigate to={ROUTES.HOME} replace /> : <>{children}</>;
};
