import { RegistrationPage } from '../features/registration/ui/RegistrationPage/RegistrationPage.tsx';
import { useAppStore } from '@/common/store/app-store.ts';
import { toast, ToastContainer } from 'react-toastify';
import s from './App.module.scss';
import { LoginPage } from '../features/LoginPage/LoginPage';
import { anonymousApiRoot } from '../features/LoginPage/anonymous-client';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../../src/common/components/Layout/Layout';
import NotFound from './pages/NotFound';


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
  useEffect(() => {
    const anonymousSession = async () => {
      try {
        const response = await anonymousApiRoot;
        console.log('anonymous session:', response);
      } catch (err) {
        console.log('failed to create anon session:', err);
      }
    };

    anonymousSession();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="registration" element={<RegistrationPage />} />
          {/* <Route index element={<Home />} />
        <Route path="about" element={<About />} /> */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );


}

export default App;
