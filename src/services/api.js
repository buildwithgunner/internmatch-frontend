import axios from 'axios';

const getBaseURL = () => {
  // 1. Check if an explicit API URL is provided via Environment Variables
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  // 2. Handle Local Network testing (e.g., accessing via 192.168.x.x on mobile)
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, protocol } = window.location;
    
    // If we are NOT on localhost and NOT on a deployed vercel app, assume local network testing
    if (hostname !== 'localhost' && !hostname.includes('vercel.app') && !hostname.includes('github.dev')) {
      const localBackend = `${protocol}//${hostname}:8000/api/v1`;
      console.log(`[API] Local Network Mode: Using ${localBackend}`);
      return localBackend;
    }
  }
  
  // 3. Last fallback (Standard Localhost)
  return 'http://localhost:8000/api/v1';
};

const baseURL = getBaseURL();
if (import.meta.env.DEV) {
  console.log(`[API] Initialized with BaseURL: ${baseURL}`);
}

const api = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Session expired or token invalidated
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }

    // Account deactivated or banned
    if (status === 403 && error.response?.data?.is_deactivated) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;