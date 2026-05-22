import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = localStorage.getItem('role');

  // Machi logged in
  if (!token || !user.id) {
    return <Navigate to="/login" replace />;
  }

  // Role machi msamah
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'coach') return <Navigate to="/coach" replace />;
    if (role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/adherent" replace />;
  }

  return children;
}