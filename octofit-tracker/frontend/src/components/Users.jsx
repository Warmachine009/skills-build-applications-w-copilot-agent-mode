import { useEffect, useState } from 'react';

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  return typeof codespaceName === 'string' && codespaceName.trim()
    ? `https://${codespaceName.trim()}-8000.app.github.dev`
    : 'http://localhost:8000';
};

const normalizeCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const candidateKeys = ['results', 'items', 'data', 'users'];

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

function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadUsers = async () => {
      try {
        const data = await fetchCollection('users');

        if (isActive) {
          setUsers(data);
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

    loadUsers();

    return () => {
      isActive = false;
    };
  }, []);

  if (isLoading) {
    return <div className="alert alert-secondary">Loading users…</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Users</h2>
        {users.length === 0 ? (
          <p className="text-muted">No users available yet.</p>
        ) : (
          <div className="row g-3">
            {users.map((user) => (
              <div className="col-md-6" key={user._id || user.id}>
                <div className="border rounded p-3 h-100">
                  <h3 className="h6">{user.name || 'User'}</h3>
                  <p className="text-muted small mb-1">{user.email || 'No email'}</p>
                  <p className="mb-0">
                    <span className="badge bg-secondary">{user.role || 'member'}</span>
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

export default Users;
