import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import DefaultLayout from './layout/DefaultLayout';
import ShowCorrecteur from './pages/Administrateur/Utilisateurs/ShowCorrecteur';
import CreateCorrecteur from './pages/Administrateur/Utilisateurs/Create/CreateCorrecteur';
import DetailCorrecteur from './pages/Administrateur/Utilisateurs/detailCorrecteur'; // Notez la majuscule
import EditCorrecteur from './pages/Administrateur/Utilisateurs/editCorrecteur';
import ShowTarif from './pages/Administrateur/Vacation/Tarifs/ShowTarif';
import EditTarif from './pages/Administrateur/Vacation/Tarifs/EditTarif';
import CreateTarif from './pages/Administrateur/Vacation/Tarifs/CreateTarif';
import ShowVacation from './pages/Administrateur/Vacation/CorrecteurVacation/ShowVacation';
import CreateVacation from './pages/Administrateur/Vacation/CorrecteurVacation/CreateVacation';
import CreatePaymentVacation from './pages/Administrateur/Vacation/CorrecteurVacation/CreatePaymentVacation';
import ShowPaymentVacation from './pages/Administrateur/Vacation/CorrecteurVacation/ShowPaymentVacation';
import ShowArchivePayment from './pages/Administrateur/Vacation/CorrecteurVacation/ShowArchivePayment';
import DetailVacation from './pages/Administrateur/Vacation/CorrecteurVacation/DetailVacation';
import DetailPaymentVacation from './pages/Administrateur/Vacation/CorrecteurVacation/DetailPaymentVacation';
import TableauDeBord from './pages/Dashboard/TableauDeBord';
import DetailArchivePayment from './pages/Administrateur/Vacation/CorrecteurVacation/DetailArchivePayment';
import DetailTarif from './pages/Administrateur/Vacation/Tarifs/DetailTarif';



function Mydash() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Tableau de bord | Système de vacation des correcteurs du baccalauréat" />
              <TableauDeBord />
            </>
          }
        />
        {/* Route pour correcteur */}
        <Route
          path="/correcteur"
          element={
            <>
              <PageTitle title="Correcteur | Système de vacation des correcteurs du baccalauréat" />
              <ShowCorrecteur />
            </>
          }
        />
        <Route
          path="/nouveau-correcteur"
          element={
            <>
              <PageTitle title="Nouveau-Correcteur | Système de vacation des correcteurs du baccalauréat" />
              <CreateCorrecteur />
            </>
          }
        />
        <Route
          path="/correcteur/:idCorrecteur"
          element={
            <>
              <PageTitle title="Detail-Correcteur | Système de vacation des correcteurs du baccalauréat" />
              <DetailCorrecteur />
            </>
          }
        />
        <Route
          path="/modifier-correcteur/:idCorrecteur"
          element={
            <>
              <PageTitle title="Modification-Correcteur | Système de vacation des correcteurs du baccalauréat" />
              <EditCorrecteur />
            </>
          }
        />
        {/* Route pour correcteur */}

        
        {/* Route pour tarif */}
        <Route
          path="/tarif"
          element={
            <>
              <PageTitle title="Tarif | Système de vacation des correcteurs du baccalauréat" />
              <ShowTarif/>
            </>
          }
        />
        <Route
          path="/nouveau-tarif"
          element={
            <>
              <PageTitle title="Nouveau-Tarif | Système de vacation des correcteurs du baccalauréat" />
              <CreateTarif />
            </>
          }
        />
        <Route
          path="/modifier-tarif/:idTarif"
          element={
            <>
              <PageTitle title="Modification-Tarif | Système de vacation des correcteurs du baccalauréat" />
              <EditTarif />
            </>
          }
        />
        <Route
          path="/detail-tarif/:idTarif"
          element={
            <>
              <PageTitle title="Detail-Tarif | Système de vacation des correcteurs du baccalauréat" />
              <DetailTarif />
            </>
          }
        />
        {/* Route pour tarif */}

        {/* Route pour vacation */}
        <Route
          path= "/vacation"
          element={
            <>
              <PageTitle title= "Vacation | Système de vacation des correcteurs du baccalauréat " />
              <ShowVacation />
            </>
          }
        />
        <Route
          path= "/nouveau-vacation"
          element={
            <>
              <PageTitle title= "Nouveau-Vacation | Système de vacation des correcteurs du baccalauréat " />
              <CreateVacation />
            </>
          }
        />
        <Route
          path="/vacation/correcteur/:immatricule"
          element={
            <>
              <PageTitle title="Detail-Vacation | Système de vacation des correcteurs du baccalauréat" />
              <DetailVacation />
            </>
          }
        />
        {/* Route pour vacation */}

        {/* Route pour paiement */}
        <Route
          path= "/paiement-liste"
          element={
            <>
              <PageTitle title= "Paiement-Vacation | Système de vacation des correcteurs du baccalauréat " />
              <ShowPaymentVacation />
            </>
          }
        />
        <Route
          path= "/nouveau-paiement"
          element={
            <>
              <PageTitle title= "Nouveau-Paiement-Vacation | Système de vacation des correcteurs du baccalauréat " />
              <CreatePaymentVacation />
            </>
          }
        />
        <Route
          path="/paiement/correcteur/:idCorrecteur"
          element={
            <>
              <PageTitle title="Detail-Paiement-Vacation | Système de vacation des correcteurs du baccalauréat" />
              <DetailPaymentVacation />
            </>
          }
        />
        <Route
          path= "/archivage-paiement"
          element={
            <>
              <PageTitle title= "Archivage-Paiement-Vacation | Système de vacation des correcteurs du baccalauréat " />
              <ShowArchivePayment />
            </>
          }
        />
        <Route
          path= "/archivage-detail/:idPaiement"
          element={
            <>
              <PageTitle title= "Archivage-Paiement-Vacation | Système de vacation des correcteurs du baccalauréat " />
              <DetailArchivePayment />
            </>
          }
        />

        {/* Route pour paiement */}
      </Routes>
    </DefaultLayout>
  );
}

export default Mydash;
