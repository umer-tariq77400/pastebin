import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSharedSnippet } from '../api/snippet';

const SharedSnippetAccess = () => {
    const { uuid } = useParams();
    const [password, setPassword] = useState('');
    const [snippet, setSnippet] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        getSharedSnippet(uuid, password)
            .then(res => {
                setSnippet(res.data);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                setError('Invalid Password or Snippet Not Found');
            });
    };

    if (snippet) {
        return (
            <div className="app-container">
                <div className="snippet-card" style={{marginTop:'50px'}}>
                    <h2>{snippet.title}</h2>
                    <p><strong>Language:</strong> {snippet.language}</p>
                    <div dangerouslySetInnerHTML={{ __html: snippet.highlight }} />
                    {/* Read only view, no edit/delete actions */}
                </div>
            </div>
        );
    }

    return (
        <div className="shared-access-container">
            <h2>Protected Snippet</h2>
            <p>This snippet is password protected. Please enter the password to view it.</p>
            {error && <p style={{color:'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Verifying...' : 'View Snippet'}
                </button>
            </form>
        </div>
    );
};

export default SharedSnippetAccess;
