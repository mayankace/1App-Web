import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor to add Authorization JWT token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('vmarc_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle common responses (unauthorized, etc)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('vmarc_token');
            // optionally redirect or handle logout
        }
        return Promise.reject(error);
    }
);

export default API;
