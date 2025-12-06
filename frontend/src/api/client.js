import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL?.trim() || 'http://127.0.0.1:8000/';

const client = axios.create({
    baseURL: API_URL,
    timeout: 60000,
});

// Add Authorization header if token exists
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;
