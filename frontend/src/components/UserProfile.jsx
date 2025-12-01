import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

function UserProfile() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="user-profile">
      <span className="username">👤 {user?.username || 'User'}</span>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default UserProfile;
