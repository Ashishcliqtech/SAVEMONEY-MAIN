import axios, { AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// The base URL for your backend API
const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.savemoney.com/api';

const apiClientInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to requests
apiClientInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle responses and errors
apiClientInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // Redirecting to login if unauthorized
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    const message = error.response?.data?.message || error.response?.data?.msg || error.message || 'Something went wrong';
    toast.error(message);

    return Promise.reject(error);
  }
);

export const apiClient = apiClientInstance;
