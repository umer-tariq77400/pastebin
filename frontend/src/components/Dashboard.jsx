import { useState, useEffect, useCallback } from "react";
import Loading from "./Loading";
import { updateUserProfile } from "../api/auth";
import { getSnippets, parseSharedUrl, deleteSnippet, createSnippet, updateSnippet } from "../api/snippet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import EditProfileModal from "./EditProfileModal";
import ShareSnippetModal from "./ShareSnippetModal";
import SnippetFormModal from "./SnippetFormModal";

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [snippets, setSnippets] = useState([]);
  const [loadingSnippets, setLoadingSnippets] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharedUrl, setSharedUrl] = useState("");
  const [formMode, setFormMode] = useState("create");
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const navigate = useNavigate();

  const fetchSnippets = useCallback(() => {
    setLoadingSnippets(true);
    getSnippets()
      .then((res) => setSnippets(res.data.results))
      .catch(console.error)
      .finally(() => setLoadingSnippets(false));
  }, []);

  useEffect(() => {
    getSnippets()
      .then((res) => setSnippets(res.data.results))
      .catch(console.error)
      .finally(() => setLoadingSnippets(false));
  }, []);

  const handleProfileUpdate = (updatedData) => {
    updateUserProfile(user.id, updatedData)
      .then((res) => {
        setUser(res.data);
        // Also update localStorage to persist changes
        localStorage.setItem("user", JSON.stringify(res.data));
        setShowEditProfile(false);
      })
      .catch(console.error);
  };

  const handleSharedUrlSubmit = (e) => {
    e.preventDefault();
    const uuid = parseSharedUrl(sharedUrl);
    if (uuid) {
      navigate(`/shared/${uuid}`);
    } else {
      alert("Invalid Shared URL");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this snippet?")) {
      deleteSnippet(id)
        .then(() => {
          setSnippets(snippets.filter((s) => s.id !== id));
        })
        .catch(console.error);
    }
  };

  const openShareModal = (snippet) => {
    setSelectedSnippet(snippet);
    setShowShareModal(true);
  };

  const openCreateModal = () => {
    setSelectedSnippet(null);
    setFormMode("create");
    setShowFormModal(true);
  };

  const openEditModal = (snippet) => {
    setSelectedSnippet(snippet);
    setFormMode("edit");
    setShowFormModal(true);
  };

  const handleFormSubmit = (data) => {
    if (formMode === "create") {
      return createSnippet(data)
        .then(() => {
          fetchSnippets();
          setShowFormModal(false);
        })
        .catch((err) => {
          console.error(err);
          throw err;
        });
    } else {
      return updateSnippet(selectedSnippet.id, data)
        .then(() => {
          fetchSnippets();
          setShowFormModal(false);
        })
        .catch((err) => {
          console.error(err);
          throw err;
        });
    }
  };

  if (!user)
    return (
      <div className="loading-container">
        <Loading />
      </div>
    );

  return (
    <div className="dashboard">
      <div className="profile-section">
        <div>
          <h2>Welcome, {user.first_name || user.username}</h2>
          <p>{user.email}</p>
          <p>
            {user.first_name} {user.last_name}
          </p>
        </div>
        <button className="btn btn-outline" onClick={() => setShowEditProfile(true)}>
          <span className="material-icons">edit</span> Edit Profile
        </button>
      </div>

      <div className="shared-input-section">
        <h3>Access Shared Snippet</h3>
        <form onSubmit={handleSharedUrlSubmit} style={{ display: "flex", gap: "10px", flex: 1 }}>
          <input type="text" placeholder="Paste Shared URL here..." value={sharedUrl} onChange={(e) => setSharedUrl(e.target.value)} />
          <button type="submit" className="btn btn-primary">
            Go
          </button>
        </form>
      </div>

      <div className="snippets-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>My Snippets</h2>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <span className="material-icons">add</span> New Snippet
          </button>
        </div>
        <div className="snippets-list">
          {loadingSnippets ? (
            <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "2rem", gridColumn: "1 / -1" }}>
              <Loading />
            </div>
          ) : snippets.length === 0 ? (
            <p style={{ textAlign: "center", color: "gray", gridColumn: "1 / -1" }}>No snippets yet. Create one above!</p>
          ) : (
            snippets.map((snippet) => (
              <div key={snippet.id} className="snippet-card" onClick={() => navigate(`/snippets/${snippet.id}`)}>
                <h3>{snippet.title || "Untitled"}</h3>
                    <div className="snippet-preview">{snippet.code.substring(0, 100)} {snippet.code.length > 100 ? "..." : ""}</div>
                <div className="card-actions">
                  <button
                    className="icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openShareModal(snippet);
                    }}
                    title="Share"
                  >
                    <span className="material-icons">share</span>
                  </button>
                  <button
                    className="icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(snippet);
                    }}
                    title="Edit"
                  >
                    <span className="material-icons">edit</span>
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(snippet.id);
                    }}
                    title="Delete"
                  >
                    <span className="material-icons">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showEditProfile && <EditProfileModal user={user} onClose={() => setShowEditProfile(false)} onSave={handleProfileUpdate} />}

      {showShareModal && selectedSnippet && <ShareSnippetModal snippet={selectedSnippet} onClose={() => setShowShareModal(false)} />}

      {showFormModal && <SnippetFormModal snippet={selectedSnippet} mode={formMode} onClose={() => setShowFormModal(false)} onSave={handleFormSubmit} />}
    </div>
  );
};

export default Dashboard;
