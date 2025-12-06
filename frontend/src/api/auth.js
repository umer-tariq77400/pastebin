import client from './client';

export const login = async (username, password) => { 
    const response = await client.post('/login/', { 
        username, 
        password 
    });
    return response;
}

export const logout = () => {
    return client.post('/logout/');
}

export const getCurrentUser = () => {
    return client.get('/current_user/');
}

export const register = (username, email, password) => {
    return client.post('/register/', {
        username,
        email,
        password
    });
}

export const updateUserProfile = (id, data) => client.patch(`/users/${id}/`, data);
