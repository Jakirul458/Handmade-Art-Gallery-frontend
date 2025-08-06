import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    // Redirect to signin with the current location
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user.role === 'seller' 
      ? '/seller/dashboard' 
      : user.role === 'admin' 
        ? '/admin/dashboard' 
        : '/user/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
} 