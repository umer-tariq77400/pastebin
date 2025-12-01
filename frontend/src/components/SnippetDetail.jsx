import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSnippet, deleteSnippet, updateSnippet } from '../api/snippet';
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

  const handleUpdate = (data) => {
      updateSnippet(id, data).then(() => {
          fetchSnippet();
          setShowEditModal(false);
      }).catch(console.error);
  };

  if (loading) return <div>Loading...</div>;
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
        {/* Fallback to raw code if highlight is empty or for copy purposes?
            The model stores `highlighted` HTML.
        */}
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
