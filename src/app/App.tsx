import { BrowserRouter as Router } from 'react-router-dom';
import { NavBar } from '../common/components/header/NavBar';

const App = () => {
  return (
    <Router>
      <div>
        <NavBar />
      </div>
    </Router>
  );
};

export default App;
