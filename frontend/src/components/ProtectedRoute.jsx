import { Navigate } from 'react-router-dom';
import Loading from './Loading';
import { useAuth } from '../hooks/useAuth';

// Component to protect routes that require authentication
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-container"><Loading /></div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
