import { useState, useEffect } from 'react';
import Loading from './Loading';
import { useParams, useNavigate } from 'react-router-dom';
import { getSnippet, deleteSnippet, updateSnippet, reviewSnippet } from '../api/snippet';
import ShareSnippetModal from './ShareSnippetModal';
import SnippetFormModal from './SnippetFormModal';
import { useAuth } from '../hooks/useAuth';

function SnippetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [review, setReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchSnippet = async () => {
    try {
      const response = await getSnippet(id);
      setSnippet(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching snippet:', err);
      setError('Failed to load snippet');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippet();
  }, [id]);

  const handleDelete = () => {
      if(window.confirm('Are you sure you want to delete this snippet?')) {
          deleteSnippet(id).then(() => {
              navigate('/');
          }).catch(console.error);
      }
  };

  const handleReview = () => {
    setReviewLoading(true);
    setReview(null);
    reviewSnippet(id).then((response) => {
      setReview(response.data.review);
    }).catch((err) => {
      console.error('Error reviewing snippet:', err);
      alert('Failed to get review from AI.');
    }).finally(() => {
      setReviewLoading(false);
    });
  };

  const handleUpdate = (data) => {
      updateSnippet(id, data).then(() => {
          fetchSnippet();
          setShowEditModal(false);
      }).catch(console.error);
  };

  if (loading) return <div className="loading-container"><Loading /></div>;
  if (error) return <div className="error">{error}</div>;
  if (!snippet) return <div>Snippet not found</div>;

  const isOwner = user && snippet.owner === user.username;

  return (
    <div className="app-container">
      <button onClick={() => navigate('/')} className="btn btn-secondary" style={{marginBottom:'20px'}}>
        &larr; Back to Dashboard
      </button>
      
      <div className="snippet-card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h2>{snippet.title || 'Untitled Snippet'}</h2>
            {isOwner && (
                <div style={{display:'flex', gap:'10px'}}>
                     <button className="icon-btn" onClick={handleReview} title="Review Code" disabled={reviewLoading}>
                        <span className="material-icons">psychology</span>
                    </button>
                     <button className="icon-btn" onClick={() => setShowShareModal(true)} title="Share">
                        <span className="material-icons">share</span>
                    </button>
                    <button className="icon-btn" onClick={() => setShowEditModal(true)} title="Edit">
                        <span className="material-icons">edit</span>
                    </button>
                    <button className="icon-btn delete" onClick={handleDelete} title="Delete">
                        <span className="material-icons">delete</span>
                    </button>
                </div>
            )}
        </div>

        <div className="snippet-meta" style={{marginBottom:'15px', color:'#757575'}}>
          <span style={{marginRight:'20px'}}>Language: {snippet.language}</span>
          <span style={{marginRight:'20px'}}>Style: {snippet.style}</span>
          <span>Owner: {snippet.owner}</span>
        </div>

        <div className="code-block" dangerouslySetInnerHTML={{ __html: snippet.highlight }} />

        {reviewLoading && <div className="loading-container"><Loading /></div>}

        {review && (
          <div className="review-section" style={{marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '4px'}}>
            <h3>AI Code Review</h3>
            <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'monospace'}}>{review}</pre>
          </div>
        )}
      </div>

      {showShareModal && (
          <ShareSnippetModal
              snippet={snippet}
              onClose={() => setShowShareModal(false)}
          />
      )}

      {showEditModal && (
          <SnippetFormModal
              snippet={snippet}
              mode="edit"
              onClose={() => setShowEditModal(false)}
              onSave={handleUpdate}
          />
      )}
    </div>
  );
}

export default SnippetDetail;
