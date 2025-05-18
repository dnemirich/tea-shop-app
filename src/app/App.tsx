import { Routes, Route } from 'react-router-dom';
import Layout from '../../src/common/components/Layout/Layout';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* <Route index element={<Home />} />
        <Route path="about" element={<About />} /> */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
