import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Request interceptor removed as we use HttpOnly cookies now

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
