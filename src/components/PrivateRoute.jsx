// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');

  // Pas connecté
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Rôle non autorisé → rediriger vers sa propre page
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'coach') return <Navigate to="/coach" replace />;
    if (role === 'admin') return <Navigate to="/Admin" replace />;
    return <Navigate to="/adherent" replace />;
  }

  return children;
}