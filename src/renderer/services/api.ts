// src/services/api.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'http://74.208.235.72:1001/SelfCheckOutAPI' 
    : 'http://74.208.235.72:1001/SelfCheckOutAPI',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const deviceId = localStorage.getItem('deviceId');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (deviceId) {
      config.headers['X-Device-ID'] = deviceId;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Error handling logic here
    return Promise.reject(error);
  }
);

export default apiClient;