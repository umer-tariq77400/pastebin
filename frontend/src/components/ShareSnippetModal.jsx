import React, { useState } from 'react';

const ShareSnippetModal = ({ snippet, onClose }) => {
    const [copiedTooltip, setCopiedTooltip] = useState({ show: false, type: '' });
    
    // Generate the share link. Assuming frontend runs on port 5173.
    // In production this should be dynamic.
    const shareLink = `${window.location.origin}/shared/${snippet.uuid}`;

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopiedTooltip({ show: true, type });
        setTimeout(() => {
            setCopiedTooltip({ show: false, type: '' });
        }, 2000);
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
                    <div style={{display:'flex', gap:'10px', marginBottom:'15px', position:'relative'}}>
                        <input type="text" value={shareLink} readOnly style={{flex:1}} />
                        <button className="btn btn-outline" onClick={() => copyToClipboard(shareLink, 'link')}>
                            <span className="material-icons">content_copy</span>
                        </button>
                        {copiedTooltip.show && copiedTooltip.type === 'link' && (
                            <div className="copy-tooltip">
                                <span className="material-icons" style={{fontSize:'16px'}}>check_circle</span>
                                Copied!
                            </div>
                        )}
                    </div>

                    <p>Password (required to view):</p>
                    <div style={{display:'flex', gap:'10px', position:'relative'}}>
                        <input type="text" value={snippet.shared_password || 'No Password'} readOnly style={{flex:1}} />
                        <button className="btn btn-outline" onClick={() => copyToClipboard(snippet.shared_password, 'password')}>
                            <span className="material-icons">content_copy</span>
                        </button>
                        {copiedTooltip.show && copiedTooltip.type === 'password' && (
                            <div className="copy-tooltip">
                                <span className="material-icons" style={{fontSize:'16px'}}>check_circle</span>
                                Copied!
                            </div>
                        )}
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
