import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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
    return (
        <div className="nav-links">
            <a href="/login">Login</a>
            <a href="/register">Register</a>
        </div>
    );
  }

  return (
    <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
      <span style={{fontWeight:'500'}}>👤 {user?.username || 'User'}</span>
      <button onClick={handleLogout} className="btn btn-secondary" style={{padding:'5px 10px', fontSize:'0.8rem'}}>
        Logout
      </button>
    </div>
  );
}

export default UserProfile;
