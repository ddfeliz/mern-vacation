import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Mydash from './Mydash';
import { useAuth } from './contexts/AuthContext';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth(); // Utiliser le contexte d'authentification

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Routes>
      {/* Route pour la page d'enregistrement */}
      <Route path="/register" element={<SignUp />} />

      {/* Route pour la page de connexion */}
      <Route
        index
        element={
          <>
            <PageTitle title="Connexion | Système de vacation des correcteurs du baccalauréat" />
            <SignIn />
          </>
        }
      />

      {/* Route pour le dashboard, redirige si non authentifié */}
      <Route
        path="/administrateur/dashboard/*"
        element={isAuthenticated ? (
          <>
            <PageTitle title="Tableau de bord | Système de vacation des correcteurs du baccalauréat" />
            <Mydash />
          </>
        ) : (
          <Navigate to="/" /> // Rediriger vers la page de connexion si non authentifié
        )}
      />
    </Routes>
  );
}

export default App;
