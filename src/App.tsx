import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Bin } from './pages/Bin';

function App() {
  return (
    <Router>
      <div>
        {/* Navigation links */}
        <nav>
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/bin">Bin</Link>
            </li>
          </ul>
        </nav>

        {/* Route configuration */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bin" element={<Bin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
