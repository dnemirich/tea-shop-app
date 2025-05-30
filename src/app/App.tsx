import { RegistrationPage } from '@/features/registration/ui/RegistrationPage/RegistrationPage.tsx';
import { useAppStore } from '@/common/store/app-store.ts';
import { toast, ToastContainer } from 'react-toastify';
import s from './App.module.scss';
// import { anonymousApiRoot } from '@/features/login/api/anonymous-client.ts';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/common/components/Layout/Layout';

import { LoginPage } from '@/features/login/ui/LoginPage/LoginPage.tsx';
import { ROUTES } from '@/common/config/routes.ts';
import { NotFoundPage } from '@/common/components/NotFoundPage/NotFoundPage.tsx';
import { HomePage } from '@/features/home/ui/HomePage.tsx';

function App() {
  const { error, clearError } = useAppStore();

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

  // useEffect(() => {
  //   const anonymousSession = async () => {
  //     try {
  //       const response = await anonymousApiRoot;
  //       // console.log('anonymous session:', response);
  //     } catch (err) {
  //       // console.log('failed to create anon session:', err);
  //     }
  //   };
  //
  //   anonymousSession();
  // }, []);

  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME} element={<Layout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegistrationPage />} />
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
