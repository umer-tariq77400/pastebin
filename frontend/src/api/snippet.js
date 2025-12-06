import client from './client';

export const getSnippets = () => {
    return client.get('/snippets/');
}

export const getSnippet = (id) => client.get(`/snippets/${id}/`);

export const createSnippet = (data) => client.post('/snippets/', data);

export const updateSnippet = (id, data) => client.put(`/snippets/${id}/`, data);

export const deleteSnippet = (id) => client.delete(`/snippets/${id}/`);

export const getSharedSnippet = (uuid, password) => {
    return client.post(`/snippets/shared/${uuid}/`, { password });
}

export const reviewSnippet = (id) => client.post(`/snippets/${id}/review/`);
export const reviewSharedSnippet = (uuid, password) => client.post(`/snippets/shared/${uuid}/review/`, { password });

// Helper to check if url is a shared url from our app
export const parseSharedUrl = (url) => {
    try {
        const urlObj = new URL(url);
        if (urlObj.pathname.includes('/shared/')) {
            const parts = urlObj.pathname.split('/');
            return parts[parts.length - 1]; // uuid
        }
        // Also handle if user just pasted the relative path /shared/uuid
        if (url.includes('/shared/')) {
             const parts = url.split('/shared/'); // ['','uuid']
             return parts[1].split('/')[0]; // 'uuid'
        }
    } catch {
        // Fallback for non-url strings, maybe user pasted just the UUID or partial path
        if (url.includes('/shared/')) {
             const parts = url.split('/shared/');
             return parts[1].split('/')[0];
        }
    }
    return null;
}
