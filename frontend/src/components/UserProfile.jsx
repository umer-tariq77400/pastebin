import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

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
        <div className="nav-links" style={{display:'flex', gap:'10px'}}>
             <Link to="/login" className="btn btn-primary" style={{padding:'5px 15px', textDecoration:'none', color:'white'}}>Login</Link>
             <Link to="/register" className="btn btn-outline" style={{padding:'5px 15px', textDecoration:'none'}}>Register</Link>
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
