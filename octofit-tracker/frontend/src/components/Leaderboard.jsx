import { useEffect, useState } from 'react';

const getApiBaseUrl = () => {
  const codespaceName =
    typeof import.meta.env.VITE_CODESPACE_NAME === 'string'
      ? import.meta.env.VITE_CODESPACE_NAME.trim()
      : '';

  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
};

const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const candidateKeys = ['results', 'items', 'data', 'leaderboard'];

    for (const key of candidateKeys) {
      if (Array.isArray(payload[key])) {
        return payload[key];
      }
    }
  }

  return [];
};

const fetchCollection = async (endpoint) => {
  const response = await fetch(`${getApiBaseUrl()}/api/${endpoint}/`);

  if (!response.ok) {
    throw new Error(`Unable to load ${endpoint}`);
  }

  const payload = await response.json();
  return normalizeCollection(payload);
};

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadLeaderboard = async () => {
      try {
        const data = await fetchCollection('leaderboard');

        if (isActive) {
          setEntries(data);
        }
      } catch (err) {
        if (isActive) {
          setError(err.message);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadLeaderboard();

    return () => {
      isActive = false;
    };
  }, []);

  if (isLoading) {
    return <div className="alert alert-secondary">Loading leaderboard…</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Leaderboard</h2>
        {entries.length === 0 ? (
          <p className="text-muted">No leaderboard entries yet.</p>
        ) : (
          <ol className="list-group list-group-numbered">
            {entries.map((entry, index) => (
              <li className="list-group-item d-flex justify-content-between align-items-start" key={entry._id || entry.id || index}>
                <div>
                  <div className="fw-bold">{entry.team?.name || 'Team'}</div>
                  <div className="text-muted small">Score: {entry.score || 0}</div>
                </div>
                <span className="badge bg-success">#{index + 1}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
