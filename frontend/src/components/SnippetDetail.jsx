import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSnippet } from '../api/snippet';

function SnippetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchSnippet();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!snippet) return <div>Snippet not found</div>;

  return (
    <div className="snippet-detail">
      <button onClick={() => navigate('/')} className="back-button">
        &larr; Back to List
      </button>
      
      <h2>{snippet.title || 'Untitled Snippet'}</h2>
      
      <div className="snippet-meta">
        <span>Language: {snippet.language}</span>
        <span>Style: {snippet.style}</span>
        <span>Owner: {snippet.owner}</span>
      </div>

      <div className="code-block">
        <pre>
          <code>{snippet.code}</code>
        </pre>
      </div>
    </div>
  );
}

export default SnippetDetail;
