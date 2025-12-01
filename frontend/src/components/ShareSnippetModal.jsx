import React from 'react';

const ShareSnippetModal = ({ snippet, onClose }) => {
    // Generate the share link. Assuming frontend runs on port 5173.
    // In production this should be dynamic.
    const shareLink = `${window.location.origin}/shared/${snippet.uuid}`;

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Share Snippet</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div>
                    <p>Share this link with others:</p>
                    <div style={{display:'flex', gap:'10px', marginBottom:'15px'}}>
                        <input type="text" value={shareLink} readOnly />
                        <button className="btn btn-outline" onClick={() => copyToClipboard(shareLink)}>
                            <span className="material-icons">content_copy</span>
                        </button>
                    </div>

                    <p>Password (required to view):</p>
                    <div style={{display:'flex', gap:'10px'}}>
                        <input type="text" value={snippet.shared_password || 'No Password'} readOnly />
                        <button className="btn btn-outline" onClick={() => copyToClipboard(snippet.shared_password)}>
                            <span className="material-icons">content_copy</span>
                        </button>
                    </div>
                </div>
                <div className="form-actions">
                    <button className="btn btn-primary" onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    );
};

export default ShareSnippetModal;
