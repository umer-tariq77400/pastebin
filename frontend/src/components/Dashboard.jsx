import React, { useState, useEffect } from 'react';
import Loading from './Loading';
import { getSnippets, getCurrentUser, updateUserProfile, parseSharedUrl, deleteSnippet, createSnippet, updateSnippet } from '../api/snippet';
import { useNavigate, Link } from 'react-router-dom';
import EditProfileModal from './EditProfileModal';
import ShareSnippetModal from './ShareSnippetModal';
import SnippetFormModal from './SnippetFormModal';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [snippets, setSnippets] = useState([]);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [sharedUrl, setSharedUrl] = useState('');
    const [showShareModal, setShowShareModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [selectedSnippet, setSelectedSnippet] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getCurrentUser().then(res => setUser(res.data)).catch(console.error);
        fetchSnippets();
    }, []);

    const fetchSnippets = () => {
        getSnippets().then(res => setSnippets(res.data.results)).catch(console.error);
    }

    const handleProfileUpdate = (updatedData) => {
        updateUserProfile(user.id, updatedData).then(res => {
            setUser(res.data);
            setShowEditProfile(false);
        }).catch(console.error);
    };

    const handleSharedUrlSubmit = (e) => {
        e.preventDefault();
        const uuid = parseSharedUrl(sharedUrl);
        if (uuid) {
            navigate(`/shared/${uuid}`);
        } else {
            alert('Invalid Shared URL');
        }
    };

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this snippet?')) {
            deleteSnippet(id).then(() => {
                setSnippets(snippets.filter(s => s.id !== id));
            }).catch(console.error);
        }
    };

    const openShareModal = (snippet) => {
        setSelectedSnippet(snippet);
        setShowShareModal(true);
    };

    const openCreateModal = () => {
        setSelectedSnippet(null);
        setFormMode('create');
        setShowFormModal(true);
    };

    const openEditModal = (snippet) => {
        setSelectedSnippet(snippet);
        setFormMode('edit');
        setShowFormModal(true);
    };

    const handleFormSubmit = (data) => {
        if (formMode === 'create') {
            createSnippet(data).then(res => {
                fetchSnippets();
                setShowFormModal(false);
            }).catch(console.error);
        } else {
            updateSnippet(selectedSnippet.id, data).then(res => {
                fetchSnippets();
                setShowFormModal(false);
            }).catch(console.error);
        }
    };

    if (!user) return <div className="loading-container"><Loading /></div>;

    return (
        <div className="dashboard">
            <div className="profile-section">
                <div>
                    <h2>Welcome, {user.first_name || user.username}</h2>
                    <p>{user.email}</p>
                    <p>{user.first_name} {user.last_name}</p>
                </div>
                <button className="btn btn-outline" onClick={() => setShowEditProfile(true)}>
                    <span className="material-icons">edit</span> Edit Profile
                </button>
            </div>

            <div className="shared-input-section">
                <h3>Access Shared Snippet</h3>
                <form onSubmit={handleSharedUrlSubmit} style={{display:'flex', gap:'10px', flex:1}}>
                    <input
                        type="text"
                        placeholder="Paste Shared URL here..."
                        value={sharedUrl}
                        onChange={(e) => setSharedUrl(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Go</button>
                </form>
            </div>

            <div className="snippets-section">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <h2>My Snippets</h2>
                    <button className="btn btn-primary" onClick={openCreateModal}>
                        <span className="material-icons">add</span> New Snippet
                    </button>
                </div>
                <div className="snippets-list">
                    {snippets.map(snippet => (
                        <div 
                            key={snippet.id} 
                            className="snippet-card" 
                            onClick={() => navigate(`/snippets/${snippet.id}`)}
                        >
                            <h3>{snippet.title || 'Untitled'}</h3>
                            <div className="snippet-preview">
                                {snippet.code.substring(0, 100)}...
                            </div>
                            {/* View Details link removed as per request */}
                            <div className="card-actions">
                                <button 
                                    className="icon-btn" 
                                    onClick={(e) => { e.stopPropagation(); openShareModal(snippet); }} 
                                    title="Share"
                                >
                                    <span className="material-icons">share</span>
                                </button>
                                <button 
                                    className="icon-btn" 
                                    onClick={(e) => { e.stopPropagation(); openEditModal(snippet); }} 
                                    title="Edit"
                                >
                                    <span className="material-icons">edit</span>
                                </button>
                                <button 
                                    className="icon-btn delete" 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(snippet.id); }} 
                                    title="Delete"
                                >
                                    <span className="material-icons">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showEditProfile && (
                <EditProfileModal
                    user={user}
                    onClose={() => setShowEditProfile(false)}
                    onSave={handleProfileUpdate}
                />
            )}

            {showShareModal && selectedSnippet && (
                <ShareSnippetModal
                    snippet={selectedSnippet}
                    onClose={() => setShowShareModal(false)}
                />
            )}

            {showFormModal && (
                <SnippetFormModal
                    snippet={selectedSnippet}
                    mode={formMode}
                    onClose={() => setShowFormModal(false)}
                    onSave={handleFormSubmit}
                />
            )}
        </div>
    );
};

export default Dashboard;
