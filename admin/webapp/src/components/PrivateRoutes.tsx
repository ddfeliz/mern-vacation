// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const PrivateRoute = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  console.log(isAuthenticated);
  
  // Si l'utilisateur est authentifié, on rend le contenu via <Outlet /> (les composants enfants).
  // Sinon, on redirige vers la page de connexion.
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace/>;
};

export default PrivateRoute;
