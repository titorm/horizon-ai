/**
 * API Configuration
 * Centralized API URL management for all requests
 */

export const API_URL = (import.meta as any).env.VITE_API_URL || "";

export const apiEndpoints = {
  auth: {
    signIn: `${API_URL}/auth/sign-in`,
    signUp: `${API_URL}/auth/sign-up`,
    signOut: `${API_URL}/auth/sign-out`,
    me: `${API_URL}/auth/me`,
  },
  users: {
    profile: `${API_URL}/users/profile`,
    update: `${API_URL}/users/profile`,
  },
  transactions: {
    list: `${API_URL}/transactions`,
    create: `${API_URL}/transactions/manual`,
    get: (id: string) => `${API_URL}/transactions/${id}`,
    update: (id: string) => `${API_URL}/transactions/${id}`,
    delete: (id: string) => `${API_URL}/transactions/${id}`,
    stats: (userId: string) => `${API_URL}/transactions/stats/${userId}`,
  },
  // Add more endpoints as needed
};

/**
 * Fetch wrapper with API_URL
 * Usage: apiFetch('/api/auth/sign-in', { method: 'POST', body: ... })
 */
export async function apiFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include", // Always include credentials for auth cookies
  });
}
