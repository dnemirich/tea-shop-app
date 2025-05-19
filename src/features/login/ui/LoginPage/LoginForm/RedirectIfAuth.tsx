import { JSX, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@/features/login/api/authService';
import { ROUTES } from '@/common/config/routes';

type Props = { children: JSX.Element };

export const RedirectIfAuth = ({ children }: Props) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const current = authService.getCurrentUser();
      if (current) {
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      const session = await authService.restoreSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};
