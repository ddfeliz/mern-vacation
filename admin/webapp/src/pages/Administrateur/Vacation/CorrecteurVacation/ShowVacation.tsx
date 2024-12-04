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
import { TrashIcon } from '@heroicons/react/24/outline';
import CardDataStats from '../../../../components/CardDataStats';
import { BsSearch } from 'react-icons/bs';
import { VacationGroupe } from '../../../../types/vacationGroupe';

const ShowVacation: React.FC = () => {

  const [vacations, setVacations] = useState<VacationGroupe[]>([]);
  const [totalCopies, setTotalCopies] = useState('0');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // État pour le Dialog
  const [open2, setOpen2] = useState(false); // État pour le Dialog
  const [openSuccess, setOpenSuccess] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVacations, setTotalVacations] = useState('0');
  const [vacationsPerPage] = useState(5); 
  const [searchItem, setSearchItem] = useState('');

  // Utiliser useEffect pour faire la requête à l'API au chargement du composant

  const fetchTotalCopies = async () => {
    try {
      // Faire la requête GET vers l'endpoint de l'API
      const response = await axios.get(
        'http://localhost:3000/api/vacation/totales-copies',
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
        'http://localhost:3000/api/vacation/compte',
      );
      setTotalVacations(responseVacation.data.totalVacation.toString());
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchTotalCopies();
    fetchVacationCount();
  }, []); // Le tableau vide [] signifie que le useEffect se déclenche une seule fois au chargement du composant

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const response = await axios.get<VacationGroupe[]>(
          'http://localhost:3000/api/vacation/compte-vacation',
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


  // Calculer les indices de début et de fin pour les correcteurs affichés
  const indexOfLastVacation = currentPage * vacationsPerPage;
  const indexOfFirstVacation = indexOfLastVacation - vacationsPerPage;
  const currentVacations = vacations.slice(
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
  const totalPages = Math.ceil(vacations.length / vacationsPerPage);

  const handleDeleting = () => {
    setOpen(true);
  };

  const cancelDelete = () => {
    setOpen(false);
  };

  // Fonction pour supprimer un correcteur
  const confirmDelete = async (idVacation: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/vacation/${idVacation}`);
      setVacations(
        vacations.filter((vacation) => vacation.idVacation !== idVacation),
      );
      setOpen2(true); // Afficher le message de succès
    } catch (err) {
      alert('Erreur lors de la suppression du vacation.');
    }
  };

  return (
    <>
      <Breadcrumb pageName="Vacations" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-4">
        <CardDataStats
          title="Total des correcteurs vacataires"
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
        open={open2}
        onClose={() => setOpen2(false)}
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
                  Suppression avec succès
                </DialogTitle>
                <p className="mt-2 text-sm text-gray-500">
                  Le vacation du correcteur a été supprimé!
                </p>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

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
          </div>

          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray text-center dark:bg-meta-4">
                  <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white">
                    N° immatricule
                  </th>
                  <th className="min-w-[300px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Nom complet
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
                  currentVacations.map((vacation) => (
                    <tr key={vacation.idVacation} className='text-center'>
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
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          <Link
                            to={`/présidence-service-finance/vacation/correcteur/${vacation.immatricule}`}
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
                            to={`/présidence-service-finance/vacation/correcteur/${vacation.immatricule}`}
                            className="hover:text-primary"
                          >
                            <EyeIcon className="h-auto w-5 text-secondary" />
                          </Link>
                          <button onClick={handleDeleting}>
                            <TrashIcon className="h-auto w-5 text-danger" />
                          </button>
                        </div>

                        {/* Modal de Confirmation avec Dialog */}
                        <Dialog
                          open={open}
                          onClose={() => setOpen(false)}
                          className="relative z-10"
                        >
                          <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                          />
                          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg dark:bg-gray-800">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 dark:bg-gray-800">
                                  <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-red-600">
                                      <CheckCircleIcon
                                        aria-hidden="true"
                                        className="h-6 w-6 text-red-600 dark:text-red-200"
                                      />
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                      <Dialog.Title
                                        as="h3"
                                        className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"
                                      >
                                        Confirmation
                                      </Dialog.Title>
                                      <div className="mt-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                          Voulez-vous vraiment supprimer ce
                                          correcteur dont l'ID est :{' '}
                                          {vacation.idVacation} ?
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 mb-4 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      confirmDelete(vacation.idVacation)
                                    }
                                    className="mr-2 bg-red-500 text-white px-4 py-2 rounded dark:bg-red-600"
                                  >
                                    Oui, supprimer
                                  </button>
                                  <button
                                    onClick={cancelDelete}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded dark:bg-gray-600 dark:text-gray-200"
                                  >
                                    Annuler
                                  </button>
                                </div>
                              </Dialog.Panel>
                            </div>
                          </div>
                        </Dialog>
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
            className={`py-2 px-4 rounded ${
              currentPage === 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary text-white'
            }`}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <button
            className={`py-2 px-4 rounded ${
              currentPage === totalPages
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
