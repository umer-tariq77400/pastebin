import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
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

        {reviewLoading && (
          <div className="loading-container" style={{margin: '20px 0'}}>
            <svg width="80" height="80" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#3f51b5">
              <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 67 67"
                  to="-360 67 67"
                  dur="2.5s"
                  repeatCount="indefinite"/>
              </path>
              <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 67 67"
                  to="360 67 67"
                  dur="8s"
                  repeatCount="indefinite"/>
              </path>
            </svg>
          </div>
        )}

        {review && (
          <div className="review-section" style={{marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '4px'}}>
            <h3>AI Code Review</h3>
            <div className="markdown-preview">
                <ReactMarkdown>{review}</ReactMarkdown>
            </div>
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
