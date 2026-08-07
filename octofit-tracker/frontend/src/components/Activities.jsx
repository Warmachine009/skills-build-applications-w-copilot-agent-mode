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
    const candidateKeys = ['results', 'items', 'data', 'activities'];

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

function Activities() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadActivities = async () => {
      try {
        const data = await fetchCollection('activities');

        if (isActive) {
          setActivities(data);
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

    loadActivities();

    return () => {
      isActive = false;
    };
  }, []);

  if (isLoading) {
    return <div className="alert alert-secondary">Loading activities…</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="h4 mb-3">Activities</h2>
        {activities.length === 0 ? (
          <p className="text-muted">No activities available yet.</p>
        ) : (
          <div className="row g-3">
            {activities.map((activity) => (
              <div className="col-md-6" key={activity._id || activity.id}>
                <div className="border rounded p-3 h-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="h6 mb-0">{activity.type || 'Activity'}</h3>
                    <span className="badge bg-primary">{activity.durationMinutes || 0} min</span>
                  </div>
                  <p className="text-muted small mb-2">
                    {activity.date ? new Date(activity.date).toLocaleDateString() : 'No date'}
                  </p>
                  <p className="mb-1">
                    <strong>User:</strong> {activity.user?.name || 'Unassigned'}
                  </p>
                  <p className="mb-1">
                    <strong>Team:</strong> {activity.team?.name || 'No team'}
                  </p>
                  <p className="mb-0">
                    <strong>Calories:</strong> {activity.caloriesBurned || 0}
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

export default Activities;
