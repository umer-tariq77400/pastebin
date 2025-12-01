import client from './client';

export const getUsers = async () => {
    const response = await client.get('/users/');
    return response;
}

export const getUser = async (id) => {
    const response = await client.get('/users/' + id + '/');
    return response;
}