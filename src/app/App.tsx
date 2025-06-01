import { RegistrationPage } from '@/features/registration/ui/RegistrationPage/RegistrationPage.tsx';
import { useAppStore } from '@/common/store/app-store.ts';
import { toast, ToastContainer } from 'react-toastify';
import s from './App.module.scss';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/common/components/Layout/Layout';

import { LoginPage } from '@/features/login/ui/LoginPage/LoginPage.tsx';
import { ROUTES } from '@/common/config/routes.ts';
import { NotFoundPage } from '@/common/components/NotFoundPage/NotFoundPage.tsx';
import { UserPage } from '@/features/userPage/ui/UserPage';
import { HomePage } from '@/features/home/ui/HomePage.tsx';
import { authService } from '@/features/login/api/authService';

function App() {
  const { error, clearError, success, clearSuccess } = useAppStore();

  useEffect(() => {
    authService.restoreSession();
  });

  useEffect(() => {
    if (error) {
      toast.error(error, {
        className: s.notification,
        autoClose: false,
        theme: 'colored',
        closeOnClick: true,
        position: 'top-center',
      });
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    if (success) {
      toast.error(success, {
        className: s.success,
        autoClose: false,
        theme: 'colored',
        closeOnClick: true,
        position: 'top-center',
      });
      clearSuccess();
    }
  }, [success, clearSuccess]);

  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME} element={<Layout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegistrationPage />} />
          <Route path={ROUTES.USER} element={<UserPage />} />
          <Route index element={<HomePage />} />

          {/* <Route path="about" element={<About />} /> */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
