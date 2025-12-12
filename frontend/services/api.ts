import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Request interceptor removed as we use HttpOnly cookies now

// Response interceptor - no longer redirects on 401 to allow public browsing
// Protected routes handle authentication via ProtectedRoute component
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Just pass through the error without redirecting
        // Individual components can handle auth requirements as needed
        return Promise.reject(error);
    }
);

export default api;
