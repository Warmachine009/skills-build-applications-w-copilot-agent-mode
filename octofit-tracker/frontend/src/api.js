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
    const candidateKeys = ['results', 'items', 'data', 'users', 'teams', 'activities', 'workouts'];

    for (const key of candidateKeys) {
      if (Array.isArray(payload[key])) {
        return payload[key];
      }
    }
  }

  return [];
};

const fetchCollection = async (endpoint) => {
  const url = `${getApiBaseUrl()}/api/${endpoint}/`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to load ${url}`);
  }

  const payload = await response.json();
  return normalizeCollection(payload);
};

export { fetchCollection, getApiBaseUrl };
