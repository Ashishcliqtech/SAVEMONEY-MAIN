import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const apiClient = axios.create({
  baseURL: 'https://updatedbackendcashkro.onrender.com/api',
});

// Request interceptor to attach the authentication token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // This would be a configuration error
    toast.error('Something went wrong while creating the request.');
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  // On success, just return the response
  (response) => response,
  // On error, show a toast and reject the promise
  (error: AxiosError) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      // The server responded with an error status code (4xx or 5xx)
      const responseData = error.response.data as { msg?: string; message?: string; error?: string };
      errorMessage = responseData?.msg || responseData?.message || responseData?.error || `Request failed with status ${error.response.status}`;

      if (error.response.status === 401) {
        // Handle specific unauthorized errors
        errorMessage = responseData?.msg || 'Authorization failed. Please log in again.';
        // Optional: you could auto-logout the user here
        // localStorage.removeItem('auth_token');
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // The request was made but no response was received (e.g., network error)
      errorMessage = 'Network error. Please check your connection or contact support.';
    }

    // Display the final error message to the user
    toast.error(errorMessage);

    // Reject the promise so that individual `.catch()` blocks can still handle the error
    return Promise.reject(error);
  }
);

export { apiClient };
