import client from './client';

// Login using DRF's session authentication
export const login = async (username, password) => {
    
    // Create form data for login
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    try {
        // Axios interceptor will automatically add CSRF token to headers
        const response = await client.post('/api-auth/login/', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        // Only treat as success if we have a valid response with status 200
        if (response.status === 200 && response.data) {
            return response;
        }
        throw new Error('Invalid login response');
    } catch (error) {
        // A 302 response when posting to login is actually success (redirect to profile)
        // We don't want to follow that redirect, we just want to know login worked
        if (error.response?.status === 302) {
            return { status: 200, data: { success: true } };
        }
        // Re-throw the error so AuthContext can handle it
        throw error;
    }
}

// Logout using DRF's session authentication
export const logout = () => {
    return client.get('/api-auth/logout/'); // DRF logout is usually a GET or we can use POST if configured
}

// Get current authenticated user info
// For session-based auth, we make a test request to see if user is authenticated
// If the user has a valid session cookie, we can fetch user data
export const getCurrentUser = () => {
    return client.get('/current_user/');
}

// Register a new user
export const register = async (username, email, password) => {
    
    // Axios interceptor will automatically add CSRF token to headers
    const response = await client.post('/register/', {
        username,
        email,
        password
    }, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response;
}
