import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

/**
 * API CONFIGURATION
 * -----------------
 * Set EXPO_PUBLIC_API_URL in .env:
 * - Android Emulator: http://10.0.2.2:8000/api
 * - Physical Device: http://YOUR_LOCAL_IP:8000/api
 * - Production: https://api.example.com/api
 */
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000,
});

// Interceptor to attach Bearer token to every request
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor for centralized API error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Error Response:', error.response.data);

            // Handle 401 Unauthorized (invalid token)
            if (error.response.status === 401) {
                // Logic for logout could be added here or handled in AuthContext
            }

            return Promise.reject(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('API Network Error:', error.request);
            return Promise.reject({ message: 'Network error. Please check your connection.' });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('API Setup Error:', error.message);
            return Promise.reject({ message: error.message });
        }
    }
);

export default api;
