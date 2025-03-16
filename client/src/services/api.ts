import axios from 'axios';

// Define types for environment variables
interface ImportMetaEnv {
  VITE_API_URL: string;
}

// Get the API URL from environment variables with fallback to relative path
const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';

// Log the API URL for debugging
console.log('API URL from env:', import.meta.env.VITE_API_URL);
console.log('API URL used:', apiUrl);

// Create an axios instance with default config
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config: any) => {
    // Log the request URL for debugging
    console.log('Making API request to:', config.baseURL + config.url);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    console.error('API request error:', error.message, error.config?.url);
    
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 