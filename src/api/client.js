const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    token,
    auth = true,
    onUnauthorized
  } = options;

  const headers = {
    'Content-Type': 'application/json'
  };

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    throw new Error(payload?.message || `Request failed (${response.status})`);
  }

  return payload;
}
