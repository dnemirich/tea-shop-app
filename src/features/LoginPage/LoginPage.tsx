import { LoginPageForm } from './LoginPageForm';
import cl from './loginPageForm.module.css';
import { anonymousApiRoot } from './anonymous-client';
import { useEffect, useRef } from 'react';

export const LoginPage = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

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
      <div>Header</div>
      <main className={cl['login-page-wrapper']}>
        <LoginPageForm />
      </main>
      <div>Footer</div>
    </>
  );
};
