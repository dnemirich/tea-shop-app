import { Outlet } from 'react-router-dom';
import NavBar from '../Header/NavBar';
// import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <NavBar />
      <main style={{ minHeight: '80vh', padding: '20px' }}>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
