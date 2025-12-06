import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Component to protect routes that require authentication
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();



  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
