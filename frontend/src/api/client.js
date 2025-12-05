import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 60000,
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
        // Only fetch CSRF token for non-GET requests if not already fetched
        if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
             // For login, we don't need to fetch CSRF from login page first if we have it?
             // Actually, the original implementation fetched /api-auth/login/ to set the cookie.
             // We can keep it.
            await fetchCsrfToken();
            const csrfToken = getCsrfTokenFromCookie();
            if (csrfToken) {
                config.headers['X-CSRFToken'] = csrfToken;
            }
        }

        // Add Authorization header if token exists in localStorage (if we switch to Token auth)
        // But the current implementation seems to rely on Session auth (cookies).
        // Let's stick to Session auth as it's configured in client.js
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;
