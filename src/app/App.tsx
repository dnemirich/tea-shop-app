import './App.css';
import { LoginPage } from '../features/LoginPage/LoginPage';
import { anonymousApiRoot } from '../features/LoginPage/anonymous-client';
import { useEffect } from 'react';

function App() {
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
      <LoginPage />
    </>
  );
}

export default App;
