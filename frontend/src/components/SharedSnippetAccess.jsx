import { useState } from 'react';
import Loading from './Loading';
import { useParams, useNavigate } from 'react-router-dom';
import { getSharedSnippet, reviewSharedSnippet } from '../api/snippet';
import SnippetDisplay from './SnippetDisplay';

const SharedSnippetAccess = () => {
    const { uuid } = useParams();
    const [password, setPassword] = useState('');
    const [snippet, setSnippet] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [review, setReview] = useState(null);
    const [reviewLoading, setReviewLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        getSharedSnippet(uuid, password)
            .then(res => {
                setSnippet(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Invalid Password or Snippet Not Found');
                setLoading(false);
            });
    };

    const handleReviewShared = () => {
        setReviewLoading(true);
        setReview(null);
        reviewSharedSnippet(uuid, password).then((response) => {
          setReview(response.data.review);
        }).catch((err) => {
          console.error('Error reviewing snippet:', err);
          alert('Failed to get review from AI.');
        }).finally(() => {
          setReviewLoading(false);
        });
    };

    if (snippet) {
        return (
            <div className="app-container">
                <button onClick={() => navigate('/')} className="btn btn-secondary" style={{marginBottom:'20px'}}>
                    &larr; Back to Home
                </button>
                <SnippetDisplay
                    snippet={snippet}
                    isOwner={false}
                    onReview={handleReviewShared}
                    reviewLoading={reviewLoading}
                    reviewContent={review}
                    showActions={false}
                    showReviewButton={true}
                />
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
                <button type="submit" className="btn btn-primary" disabled={loading} style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', width:'130px'}}>
                    {loading ? <Loading width={20} height={20} color="#fff" /> : 'View Snippet'}
                </button>
            </form>
        </div>
    );
};

export default SharedSnippetAccess;
