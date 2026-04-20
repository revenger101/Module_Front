import { apiRequest } from '../../api/client';

export function adminRequest(path, session, onUnauthorized, options = {}) {
  return apiRequest(path, {
    ...options,
    token: session?.token,
    onUnauthorized
  });
}
