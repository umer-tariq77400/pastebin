import { useState } from 'react';
import Loading from './Loading';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      return;
    }

    const result = await login(username, password);
    
    if (result.success) {
      // Redirect to home page after successful login
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      {error && <div style={{color:'red', marginBottom:'15px'}}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>

        <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading} style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                {loading ? <Loading width={20} height={20} color="#fff" /> : 'Login'}
            </button>
        </div>
      </form>

      <p style={{textAlign:'center', marginTop:'15px'}}>
        Don't have an account? <Link to="/register">Sign up here</Link>
      </p>
    </div>
  );
}

export default Login;
