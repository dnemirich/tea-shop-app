import { RegistrationPage } from '../features/registration/ui/RegistrationPage/RegistrationPage.tsx';
import { useAppStore } from '@/common/store/app-store.ts';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import s from './App.module.scss';

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

  return (
    <>
      <RegistrationPage />
      <ToastContainer />
    </>
  );
}

export default App;
