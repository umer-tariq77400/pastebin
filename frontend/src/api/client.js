import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 10000,
    withCredentials: true,
})

let csrfTokenFetched = false;

// Get CSRF token from the server (fetch only once)
const fetchCsrfToken = async () => {
    if (csrfTokenFetched) return;
    
    try {
        await client.get('/api-auth/login/');
        csrfTokenFetched = true;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        // Don't throw - allow requests to continue
    }
}

// Function to get CSRF token from cookies
const getCsrfTokenFromCookie = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Add CSRF token to request headers for POST, PUT, PATCH, DELETE
client.interceptors.request.use(
    async (config) => {
        // Only fetch CSRF token for non-GET requests
        if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
            await fetchCsrfToken();
            const csrfToken = getCsrfTokenFromCookie();
            if (csrfToken) {
                config.headers['X-CSRFToken'] = csrfToken;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;