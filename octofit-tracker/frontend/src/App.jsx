import { NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <h1 className="display-5 fw-bold mb-3">OctoFit Tracker</h1>
              <p className="lead text-muted mb-4">
                A modern multi-tier fitness tracker for logging activities, managing teams,
                and climbing the leaderboard.
              </p>
              <div className="alert alert-info mb-4">
                <strong>API base:</strong> {apiBaseUrl}
                <br />
                <small>
                  Define VITE_CODESPACE_NAME in .env.local to use Codespaces URLs such as
                  https://your-space-8000.app.github.dev/api/users/.
                </small>
              </div>
              <nav className="nav nav-pills flex-wrap gap-2 mb-4">
                <NavLink className="nav-link" to="/">Home</NavLink>
                <NavLink className="nav-link" to="/users">Users</NavLink>
                <NavLink className="nav-link" to="/teams">Teams</NavLink>
                <NavLink className="nav-link" to="/activities">Activities</NavLink>
                <NavLink className="nav-link" to="/leaderboard">Leaderboard</NavLink>
                <NavLink className="nav-link" to="/workouts">Workouts</NavLink>
              </nav>

              <Routes>
                <Route
                  path="/"
                  element={
                    <div className="d-flex flex-column gap-3">
                      <p className="text-muted mb-0">
                        Browse the multi-tier application data from the API using the links above.
                      </p>
                      <a className="btn btn-primary w-auto" href={`${apiBaseUrl}/api/health`}>
                        Check API Health
                      </a>
                    </div>
                  }
                />
                <Route path="/users" element={<Users />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/workouts" element={<Workouts />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
