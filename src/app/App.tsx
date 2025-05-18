import { LoginPage } from '../features/LoginPage/LoginPage';
import { anonymousApiRoot } from '../features/LoginPage/anonymous-client';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../../src/common/components/Layout/Layout';
import NotFound from './pages/NotFound';


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
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<LoginPage />} />
        {/* <Route index element={<Home />} />
        <Route path="about" element={<About />} /> */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
)

}

export default App;
