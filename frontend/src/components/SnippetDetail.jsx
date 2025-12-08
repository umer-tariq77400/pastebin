import { useState, useEffect, useCallback } from 'react';
import Loading from './Loading';
import { useParams, useNavigate } from 'react-router-dom';
import { getSnippet, deleteSnippet, updateSnippet, reviewSnippet } from '../api/snippet';
import ShareSnippetModal from './ShareSnippetModal';
import SnippetFormModal from './SnippetFormModal';
import SnippetDisplay from './SnippetDisplay';
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

  const fetchSnippet = useCallback(async () => {
    try {
      const response = await getSnippet(id);
      setSnippet(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching snippet:', err);
      setError('Failed to load snippet');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    (async () => {
      await fetchSnippet();
    })();
  }, [fetchSnippet]);

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
      return updateSnippet(id, data).then(() => {
          fetchSnippet();
          setShowEditModal(false);
      }).catch((err) => {
          console.error(err);
          throw err;
      });
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

      <SnippetDisplay
        snippet={snippet}
        isOwner={isOwner}
        onReview={handleReview}
        reviewLoading={reviewLoading}
        reviewContent={review}
        onShare={() => setShowShareModal(true)}
        onEdit={() => setShowEditModal(true)}
        onDelete={handleDelete}
      />

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
