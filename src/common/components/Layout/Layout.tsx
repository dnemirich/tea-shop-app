import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header.tsx';
import { Footer } from '../Footer/Footer';

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <div className={'container'}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
