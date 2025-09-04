/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from 'react-router-dom';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import {
  CheckCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
// import { TrashIcon } from '@heroicons/react/24/outline';
import CardDataStats from '../../../../components/CardDataStats';
import { BsSearch } from 'react-icons/bs';
import { VacationGroupe } from '../../../../types/vacationGroupe';
import API_VACATION from '../../../../api/vacation';
import { toast } from 'react-toastify';
// import { toast } from 'react-toastify';
// import API_VACATION from '../../../../api/vacation';

const ShowVacation: React.FC = () => {

  const [vacations, setVacations] = useState<VacationGroupe[]>([]);
  const [totalCopies, setTotalCopies] = useState('0');
  const [loading, setLoading] = useState(true);
  // const [open, setOpen] = useState(false); 
  const [openSuccess, setOpenSuccess] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVacations, setTotalVacations] = useState('0');
  const [vacationsPerPage] = useState(5);
  const [searchItem, setSearchItem] = useState('');
  const [totalCorrecteurs, setTotalCorrecteurs] = useState('0');

  
  const [specialites, setSpecialites] = useState<string[]>([]); // NEW: State for specialties
  const [selectedSpecialite, setSelectedSpecialite] = useState<string>(''); // NEW: State for selected specialty



  // NEW: Fetch unique specialties
  const fetchSpecialites = async () => {
    try {
      const response = await axios.get(`${API_VACATION.avoirSpecialite}`); // Assumes endpoint exists
      setSpecialites(response.data.specialites || []);
    } catch (err) {
      console.log('Erreur lors de la récupération des spécialités:', err);
      toast.error('Veuillez sélectionner une spécialité.');

    }
  };

  // NEW: Function to generate and download PDF
  const handleGeneratePDF = async () => {
    if (!selectedSpecialite) {
      toast.info('Veuillez sélectionner une spécialité.');
      return;
    }
    try {
      const response = await axios.get(
        `${API_VACATION.genererPDF}/${selectedSpecialite}`,
        { responseType: 'blob' } // Important for handling binary data
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `correcteurs_${selectedSpecialite}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log('Erreur lors de la génération du PDF:', err);
    }
  };



  const fetchTotalCorrecteurs = async () => {
    try {
      const response = await axios.get(
        API_VACATION.avoirNombreCorrecteursAvecVacations // Ensure this is defined in API_VACATION
      );
      setTotalCorrecteurs(response.data.totalCorrecteurs.toString());
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTotalCopies = async () => {
    try {
      // Faire la requête GET vers l'endpoint de l'API
      const response = await axios.get(
        // 'http://localhost:3000/api/vacation/totales-copies',
        API_VACATION.totalCopieVacation
      );

      // Stocker le total des copies dans l'état
      setTotalCopies(response.data.totalCopies.toString());
      setLoading(false); // Fin du chargement
    } catch (err) {
      setLoading(false); // Fin du chargement
    }
  };

  const fetchVacationCount = async () => {
    try {
      const responseVacation = await axios.get(
        // 'http://localhost:3000/api/vacation/compte',
        API_VACATION.compterVacation
      );
      setTotalVacations(responseVacation.data.totalVacation.toString());
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchTotalCopies();
    fetchVacationCount();
    fetchTotalCorrecteurs();
    fetchSpecialites(); // NEW: Fetch specialties on mount
  }, []); // Le tableau vide [] signifie que le useEffect se déclenche une seule fois au chargement du composant

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const response = await axios.get<VacationGroupe[]>(
          // 'http://localhost:3000/api/vacation/compte-vacation',
          API_VACATION.compteVacationByCorrecteur
        );
        setVacations(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVacations();
  }, []);


  // Fonction pour filtrer les paiements par statut et par critères spécifiques
  const combinedFilteredPayments = vacations.filter((vacation) => {
    const AAAAA = vacation.cin.toLowerCase().includes(searchItem.toLowerCase());
    const BBBBB = vacation.nom.toLowerCase().includes(searchItem.toLowerCase());
    const CCCCC = vacation.prenom.toLowerCase().includes(searchItem.toLowerCase());

    return (
      AAAAA ||
      BBBBB ||
      CCCCC
    );
  });


  // Calculer les indices de début et de fin pour les correcteurs affichés
  const indexOfLastVacation = currentPage * vacationsPerPage;
  const indexOfFirstVacation = indexOfLastVacation - vacationsPerPage;
  const currentVacations = combinedFilteredPayments.slice(
    indexOfFirstVacation,
    indexOfLastVacation,
  );

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <p className="flex h-screen items-center justify-center text-black dark:text-white">
        Chargement des vacations...
      </p>
    );

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(combinedFilteredPayments.length / vacationsPerPage);

  return (
    <>
      <Breadcrumb pageName="Vacations" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-4">
        <CardDataStats
          title="Totale des correcteurs avec vacations"
          titleColor="#007BFF"
          total={totalCorrecteurs}
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Total des vacations"
          titleColor="#007BFF"
          total={totalVacations}
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C10.3431 2 9 3.34315 9 5C9 6.65685 10.3431 8 12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2ZM12 10C9.79086 10 8 11.7909 8 14V18C8 18.5523 8.44772 19 9 19H15C15.5523 19 16 18.5523 16 18V14C16 11.7909 14.2091 10 12 10Z"
              fill=""
            />

            <path
              d="M18 8H6C5.44772 8 5 8.44772 5 9V21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21V9C19 8.44772 18.5523 8 18 8ZM7 10H17V12H7V10ZM7 14H14V16H7V14Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Totale des copies corrigées"
          titleColor="#007BFF"
          total={totalCopies.toString()}
        >
          <svg
            className="fill-primary dark:fill-white"
            width="30"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 0H7C4.8 0 3 1.8 3 4v16c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4V7l-6-7zM7 2h10l5 5h-5c-1.1 0-2 .9-2 2v12H7V2zm6 14h-4v-2h4v2zm0-4h-4v-2h4v2z"
              fill=""
            />
            <path d="M11 14h2v2h-2z" fill="" />
          </svg>
        </CardDataStats>
      </div>

      <Dialog
        open={openSuccess}
        onClose={() => setOpenSuccess(false)}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      >
        {/* Arrière-plan grisé */}
        <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />

        {/* Contenu de la modal */}
        <div className="flex items-center justify-center min-h-screen">
          <DialogPanel className="relative mx-auto w-full max-w-md rounded-lg bg-white shadow-lg p-6">
            {/* Icône et Message */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <CheckCircleIcon
                  className="h-12 w-12 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <div>
                <DialogTitle className="text-xl font-medium text-success">
                  Mise à jour avec succès
                </DialogTitle>
                <p className="mt-2 text-sm text-gray-500">
                  Le nombre des copies du correcteur a été mis à jour!
                </p>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-4 flex flex-wrap gap-5 xl:gap-7.5 justify-end">
            <Link
              to="/présidence-service-finance/nouveau-vacation"
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                    fill="currentColor"
                  />
                  <path
                    d="M4 19C4 16.2386 9.58172 14 12 14C14.4183 14 20 16.2386 20 19V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V19Z"
                    fill="currentColor"
                  />
                  <path
                    d="M18 8H20V10H22V12H20V14H18V12H16V10H18V8Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Nouveau
            </Link>
          </div>
          <div className="mb-4 flex flex-wrap gap-5 xl:gap-7.5 justify-center items-center">
            {/* Champ de recherche */}
            <div className="w-full md:w-1/2 xl:w-1/3 relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-12 pr-5 outline-none
        transition focus:border-primary active:border-primary disabled:cursor-default text-black 
        dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none dark:text-gray-200 dark:focus:text-primary" />
            </div>

            {/* Sélecteur de recherche par année */}
            <div className="w-full md:w-1/2 xl:w-1/3">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none 
        transition focus:border-primary active:border-primary disabled:cursor-default 
        disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Filtrer par année...</option>
                <option value={new Date().getFullYear() - 3}>
                  {new Date().getFullYear() - 3}
                </option>
                <option value={new Date().getFullYear() - 2}>
                  {new Date().getFullYear() - 2}
                </option>
                <option value={new Date().getFullYear() - 1}>
                  {new Date().getFullYear() - 1}
                </option>
                <option value={new Date().getFullYear()}>
                  Année Actuelle: {new Date().getFullYear()}
                </option>
                <option value={new Date().getFullYear() + 1}>
                  {new Date().getFullYear() + 1}
                </option>
                <option value={new Date().getFullYear() + 2}>
                  {new Date().getFullYear() + 2}
                </option>
              </select>
            </div>
            {/* NEW: Specialty selector and PDF button */}
            <div className="w-full md:w-1/2 xl:w-1/3 flex gap-2 items-center">
              <select
                value={selectedSpecialite}
                onChange={(e) => setSelectedSpecialite(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none 
                transition focus:border-primary active:border-primary disabled:cursor-default 
                disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Sélectionner une spécialité...</option>
                {specialites.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <button
                onClick={handleGeneratePDF}
                className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-3 px-5 text-center font-medium text-white hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={!selectedSpecialite}
              >
                Générer PDF
              </button>
            </div>
            
          </div>

          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray text-center dark:bg-meta-4">
                  <th className="min-w-[80px] py-4 px-4 font-medium text-black dark:text-white">
                    -
                  </th>
                  <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white">
                    I.M
                  </th>
                  <th className="min-w-[300px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Nom complet
                  </th>
                  <th className="min-w-[300px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    CIN
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                    Nombre des vacations
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Session
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentVacations.length > 0 ? (
                  currentVacations.map((vacation, index) => (
                    <tr key={vacation.idCorrecteur} className='text-center'>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {indexOfFirstVacation + index + 1}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {vacation.immatricule}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {vacation.nom} {vacation.prenom}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {vacation.cin}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          <Link
                            to={`/présidence-service-finance/vacation/correcteur/${vacation.idCorrecteur}`}
                            className="hover:text-primary"
                          >
                            {vacation.totalVacations}
                          </Link>
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {new Date().getFullYear()}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center justify-center space-x-3.5">
                          <Link
                            to={`/présidence-service-finance/vacation/correcteur/${vacation.idCorrecteur}`}
                            className="hover:text-primary"
                          >
                            <EyeIcon className="h-auto w-5 text-secondary" />
                          </Link>
                          {/* <button onClick={handleDeleting}>
                            <TrashIcon className="h-auto w-5 text-danger" />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={14}
                      className="text-center border-b border-[#eee] py-5"
                    >
                      <p className="text-red-500">Aucune donnée à afficher</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-2 mt-4">
          <button
            className={`py-2 px-4 rounded ${currentPage === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-primary text-white'
              }`}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <button
            className={`py-2 px-4 rounded ${currentPage === totalPages
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-primary text-white'
              }`}
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      </div>
    </>
  );
};

export default ShowVacation;
