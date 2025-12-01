import client from './client';

export const getSnippets = async () => {
    const response = await client.get('/snippets/');
    return response;
}

export const getSnippet = async (id) => {
    const response = await client.get('/snippets/' + id + '/');
    return response;
}

export const createSnippet = async (data) => {
    const response = await client.post('/snippets/', data);
    return response;
}

export const updateSnippet = async (id, data) => {
    const response = await client.put('/snippets/' + id + '/', data);
    return response;
}

export const deleteSnippet = async (id) => {
    const response = await client.delete('/snippets/' + id + '/');
    return response;
}

export const highlightSnippet = async (id) => {
    const response = await client.get(`/snippets/${id}/highlight/`);
    return response;
}