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
    const candidateKeys = ['results', 'items', 'data', 'teams'];

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

function Teams() {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadTeams = async () => {
      try {
        const data = await fetchCollection('teams');

        if (isActive) {
          setTeams(data);
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

    loadTeams();

    return () => {
      isActive = false;
    };
  }, []);

  if (isLoading) {
    return <div className="alert alert-secondary">Loading teams…</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Teams</h2>
        {teams.length === 0 ? (
          <p className="text-muted">No teams available yet.</p>
        ) : (
          <div className="row g-3">
            {teams.map((team) => (
              <div className="col-md-6" key={team._id || team.id}>
                <div className="border rounded p-3 h-100">
                  <h3 className="h6">{team.name || 'Team'}</h3>
                  <p className="text-muted small">{team.description || 'No description provided.'}</p>
                  <p className="mb-0">
                    <strong>Members:</strong> {team.members?.length || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Teams;
