import axios from 'axios';
import { rateLimitedFetch } from './rateLimiter';

// Get base URL from environment or default to localhost
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Increased timeout for rate limited requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response, config } = error;
    
    // Handle rate limiting
    if (response?.status === 429) {
      console.log('Rate limit hit, waiting before retry...');
      
      // Wait 2-5 seconds before retry (randomized to prevent thundering herd)
      const delay = 2000 + Math.random() * 3000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Only retry once to prevent infinite loops
      if (!config._retried) {
        config._retried = true;
        return api(config);
      }
      
      return Promise.reject(new Error('Too many requests from this IP, please try again later.'));
    }
    
    if (response?.status === 401) {
      // Unauthorized - clear auth data and redirect to login
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;