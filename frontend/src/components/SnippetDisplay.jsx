import ReactMarkdown from 'react-markdown';

const SnippetDisplay = ({
    snippet,
    isOwner,
    onReview,
    reviewLoading,
    reviewContent,
    onShare,
    onEdit,
    onDelete,
    showReviewButton = true,
    showActions = true // Control visibility of action buttons (edit/delete/share)
}) => {
    return (
        <div className="snippet-card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px'}}>
                <h2 style={{margin:0}}>{snippet.title || 'Untitled Snippet'}</h2>
                {showActions && isOwner && (
                    <div style={{display:'flex', gap:'10px'}}>
                         {showReviewButton && (
                             <button className="icon-btn" onClick={onReview} title="Review Code" disabled={reviewLoading}>
                                <span className="material-icons">psychology</span>
                            </button>
                         )}
                         <button className="icon-btn" onClick={onShare} title="Share">
                            <span className="material-icons">share</span>
                        </button>
                        <button className="icon-btn" onClick={onEdit} title="Edit">
                            <span className="material-icons">edit</span>
                        </button>
                        <button className="icon-btn delete" onClick={onDelete} title="Delete">
                            <span className="material-icons">delete</span>
                        </button>
                    </div>
                )}
                 {!isOwner && showReviewButton && (
                    <div style={{display:'flex', gap:'10px'}}>
                         <button className="icon-btn" onClick={onReview} title="Review Code" disabled={reviewLoading}>
                            <span className="material-icons">psychology</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="snippet-meta" style={{marginBottom:'15px', color:'#757575', marginTop: '10px'}}>
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

            {reviewContent && (
              <div className="review-section" style={{marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '4px'}}>
                <h3>AI Code Review</h3>
                <div className="markdown-preview">
                    <ReactMarkdown>{reviewContent}</ReactMarkdown>
                </div>
              </div>
            )}
        </div>
    );
};

export default SnippetDisplay;
