import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:8000',
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
