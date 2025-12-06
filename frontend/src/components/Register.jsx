import { useState } from 'react';
import Loading from './Loading';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!username.trim() || !password.trim()) {
      setLocalError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    // Call register from useAuth
    const result = await register(username, email, password);
    
    if (result.success) {
      // Redirect to home page
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

      {(error || localError) && <div style={{color:'red', marginBottom:'15px'}}>{error || localError}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading} style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                {loading ? <Loading width={20} height={20} color="#fff" /> : 'Register'}
            </button>
        </div>
      </form>

      <p style={{textAlign:'center', marginTop:'15px'}}>
        Already have an account?  <Link to="/login" style={{color:'blue', textDecoration:'none'}}>Login here</Link>
      </p>
    </div>  
  );
}

export default Register;
