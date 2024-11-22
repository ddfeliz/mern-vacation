import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Mydash from './Mydash';
import PrivateRoute from './components/PrivateRoutes'; // Importer le composant PrivateRoute

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation(); // Récupérer la localisation actuelle

  // Remettre la page en haut lors de la navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Simuler un chargement initial
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Affichage du loader si l'application est en cours de chargement
  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      {/* Page d'enregistrement */}
      <Route path="/registre" element={<SignUp />} />

      {/* Page de connexion */}
      <Route
        path="/"
        element={
          <>
            <PageTitle title="Connexion | Système de vacation des correcteurs du baccalauréat" />
            <SignIn />
          </>
        }
      />

      {/* Tableau de bord - accès seulement si authentifié */}
      <Route element={<PrivateRoute />}>
        <Route
          path="/tableau-de-bord/*"
          element={
            <>
              <PageTitle title="Tableau de bord | Système de vacation des correcteurs du baccalauréat" />
              <Mydash />
            </>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
