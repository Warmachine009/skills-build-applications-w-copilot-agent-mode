import './App.css'

function App() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <h1 className="display-5 fw-bold mb-3">OctoFit Tracker</h1>
              <p className="lead text-muted mb-4">
                A modern multi-tier fitness tracker for logging activities, managing teams,
                and climbing the leaderboard.
              </p>
              <div className="d-flex gap-3">
                <a className="btn btn-primary" href={`${apiBaseUrl}/api/health`}>
                  Check API Health
                </a>
                <a className="btn btn-outline-secondary" href="https://vite.dev/" target="_blank">
                  Vite Docs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
