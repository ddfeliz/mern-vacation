/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useNavigate } from 'react-router-dom';
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
  CheckIcon,
  EyeIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
// import { TrashIcon } from '@heroicons/react/24/outline';
import { BsCashCoin,  BsSearch } from 'react-icons/bs';
import { PaiementRegroupe } from '../../../../types/PaiementRegroupe';
import API_PAIEMENT from '../../../../api/paiement';
import API_ARCHIVE from '../../../../api/archivage';
import { toast } from 'react-toastify';

const TablePayment = () => {
  const [payments, setPayments] = useState<PaiementRegroupe[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaiementRegroupe | null>(null);
  const [filteredPayments, setFilteredPayments] = useState<PaiementRegroupe[]>([]); // Nouvel état pour les paiements filtrés
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(''); // État pour le statut de paiement
  const [open, setOpen] = useState(false); // État pour le Dialog
  const [open2, setOpen2] = useState(false); // État pour le Dialog
  const [openUpdatePayment, setOpenUpdatePayment] = useState(false); // État pour le Dialog
  const [openArchive, setOpenArchive] = useState(false); // État pour le Dialog
  const [openArchiveSuccess, setOpenArchiveSuccess] = useState(false); // État pour le Dialog
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(5); // Modifier cette valeur pour ajuster le nombre de correcteurs par page
  const [searchItem, setSearchItem] = useState('');

  const navigate = useNavigate();


  const fetchTarifs = async () => {
    try {
      // const response = await axios.get('http://localhost:3000/api/paiement/regroupement');
      const response = await axios.get(API_PAIEMENT.regouperPaiement);
      setPayments(response.data.paiementsRegroupes);
      setFilteredPayments(response.data.paiementsRegroupes);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTarifs();
  }, []);

  // Fonction pour filtrer les paiements par statut et par critères spécifiques
  const combinedFilteredPayments = filteredPayments.filter((payment) => {
    const isNameMatch =
      payment.nom.toLowerCase().includes(searchItem.toLowerCase()) ||
      payment.prenom.toLowerCase().includes(searchItem.toLowerCase()) ||
      payment.idCorrecteur.toLowerCase().includes(searchItem.toLowerCase());

    return isNameMatch;
  });

  // Fonction pour filtrer les paiements selon le statut sélectionné
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const status = event.target.value;
    setSelectedStatus(status);
    if (status === '') {
      setFilteredPayments(payments); // Afficher tous les paiements si aucun filtre n'est sélectionné
    } else {
      setFilteredPayments(
        payments.filter((payment) => payment.statut === status),
      );
    }
  };

  // Calculer les indices de début et de fin pour les correcteurs affichés
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentTarifs = combinedFilteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment,
  );

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <p className="flex h-screen items-center justify-center text-black dark:text-white">
        Chargement de tableau des paiements des correcteurs...
      </p>
    );

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(
    combinedFilteredPayments.length / paymentsPerPage,
  );

  // const handleDeleting = () => {
  //   setOpen(true);
  // };

  const cancelDelete = () => {
    setOpen(false);
  };

  // Fonction pour ouvrir le modal d'édition avec les données du vacation sélectionné
  const openEditModal = (payment: PaiementRegroupe) => {
    setSelectedPayment(payment);
    setOpenUpdatePayment(true);
  };

  // Fonction pour confirmer la mise à jour
  const updateStatus = async () => {
    if (!selectedPayment) return;

    try {
      // Envoyer la requête pour mettre à jour tous les paiements du correcteur
      // await axios.put(
      //     `http://localhost:3000/api/paiement/statut-modification/${selectedPayment.idCorrecteur}`
      // );
      await axios.put(
          `${API_PAIEMENT.modifierToPayerPaiement}/${selectedPayment.idCorrecteur}`
      );

      // Mettre à jour le tableau localement
      setPayments((prev) =>
          prev.map((pay) =>
              pay.idCorrecteur === selectedPayment.idCorrecteur && pay.statut === 'Non payé'
                  ? { ...pay, statut: 'Payé' }
                  : pay
          )
      );

      setOpenUpdatePayment(false); // Fermer le modal
      toast.success('Sauvegarder avec succès');
      fetchTarifs(); 
  } catch (err) {
      alert('Erreur lors de la mise à jour du statut des paiements.');
      toast.error('Erreur lors de la mise à jour du statut des paiements.');
  }
  };


  const handleReset = async () => {
    setLoading(true);
    try {
      const currentYear = new Date().getFullYear();
      // await axios.post('http://localhost:3000/api/archive/archive-paiements', {
      //   session: currentYear,
      // });
      await axios.post(API_ARCHIVE.ajoutArchive, {
        session: currentYear,
      });
      setOpenArchiveSuccess(true);
      setOpenArchive(false);
      setTimeout(() => {
        navigate('/présidence-service-finance/nouveau-paiement');
      }, 2000); // Délai de 2 secondes avant de naviguer
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Breadcrumb pageName="Paiement des correcteurs" /> */}

      {/* Modal de Confirmation avec Dialog */}
      <Dialog
        open={openUpdatePayment}
        onClose={() => setOpenUpdatePayment(false)}
        className="relative z-10"
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg dark:bg-gray-800">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 dark:bg-gray-800">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-red-600">
                    <CheckCircleIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-red-600 dark:text-red-200"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"
                    >
                      Confirmation du paiement
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Voulez-vous vraiment effectuer ce paiement?{' '}
                        <span className="text-danger">
                          Cette action est irreversible!
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 mb-4 flex justify-end">
                <button
                  onClick={updateStatus}
                  className="mr-2 bg-blue-500 text-white px-4 py-2 rounded dark:bg-blue-600"
                >
                  Oui
                </button>
                <button
                  onClick={() => setOpenUpdatePayment(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded dark:bg-gray-600 dark:text-gray-200"
                >
                  Annuler
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* Modal de Confirmation Archive avec Dialog */}
      <Dialog
        open={openArchive}
        onClose={() => setOpenArchive(false)}
        className="relative z-10"
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg dark:bg-gray-800">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 dark:bg-gray-800">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 sm:mx-0 sm:h-10 sm:w-10 dark:bg-blue-600">
                    <QuestionMarkCircleIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white dark:text-gray-500"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"
                    >
                      Confirmation d'archiver les liste paiement
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Voulez-vous vraiment archiver ces listes des paiemet du
                        session {new Date().getFullYear()}?
                        <span className="mx-2 text-danger">
                          Cette action est irreversible!
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 mb-4 flex justify-end">
                <button
                  onClick={handleReset}
                  className="mr-2 bg-red-500 text-white px-4 py-2 rounded dark:bg-red-600"
                  disabled={loading}
                >
                  {loading ? 'archivage en cours...' : 'Oui, archiver'}
                </button>
                <button
                  onClick={() => setOpenArchive(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded dark:bg-gray-600 dark:text-gray-200"
                >
                  Annuler
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={openArchiveSuccess}
        onClose={() => setOpenArchiveSuccess(false)}
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
                <DialogTitle className="text-xl font-medium text-gray-900">
                  Archivage avec succès
                </DialogTitle>
                <p className="mt-2 text-sm text-gray-500">
                  L' archive du paiement des correcteurs en session{' '}
                  {new Date().getFullYear()} a été effectué !
                </p>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

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
                <DialogTitle className="text-xl font-medium text-gray-900">
                  Suppression avec succès
                </DialogTitle>
                <p className="mt-2 text-sm text-gray-500">
                  Le paiement a été supprimé!
                </p>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-4 flex flex-wrap gap-5 xl:gap-7.5 justify-center">

            <Link
              to="/présidence-service-finance/nouveau-paiement"
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <BsCashCoin />
                <PlusIcon />
              </span>
              Nouveau Paiement
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
              {/* Liste déroulante pour filtrer par statut */}
              <select
                id="statusFilter"
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-10 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Filtré par statut</option>
                <option value="Payé">Payé</option>
                <option value="Non payé">Non payé</option>
              </select>
            </div>
          </div>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-center dark:bg-meta-4">
                  <th className="min-w-[160px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    ID Correcteur
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Nom Complet
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    CIN
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Session
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Nombres de vacation
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Montant totale
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Status du paiement
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTarifs && currentTarifs.length > 0 ? (
                  currentTarifs.map((paiement) => (
                    <tr key={paiement.idCorrecteur}>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {paiement.idCorrecteur}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {paiement.nom} {paiement.prenom}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {paiement.cin}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {paiement.session}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {paiement.nombreVacations}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {paiement.montantTotal} Ar
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {paiement.statut}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center justify-center space-x-3.5">
                          {paiement.statut === 'Non payé' && (
                            <button
                              onClick={() => openEditModal(paiement)}
                              className="hover:text-primary"
                            >
                              <CheckIcon className="h-auto w-5 text-green-600" />
                            </button>
                          )}
                          <Link
                            to={`/présidence-service-finance/paiement/correcteur/${paiement.idCorrecteur}`}
                            className="hover:text-primary"
                          >
                            <EyeIcon className="h-auto w-5 text-secondary" />
                          </Link>
                          {/* <button onClick={handleDeleting}>
                            <TrashIcon className="h-auto w-5 text-danger" />
                          </button> */}
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
                              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg dark:bg-gray-800">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 dark:bg-gray-800">
                                  <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 sm:mx-0 sm:h-10 sm:w-10 dark:bg-blue-600">
                                      <QuestionMarkCircleIcon
                                        aria-hidden="true"
                                        className="h-6 w-6 text-white dark:text-gray-200"
                                      />
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                      <DialogTitle
                                        as="h3"
                                        className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"
                                      >
                                        Confirmation
                                      </DialogTitle>
                                      <div className="mt-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                          Voulez-vous vraiment supprimer ce
                                          correcteur <br /> dont l'ID est:{' '}
                                          {paiement.idCorrecteur} ?
                                          <span className="mx-2 text-danger">
                                            Cette action est irreversible!
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 mb-4 flex justify-end">
                                  <button
                                    type="button"
                                    // onClick={() =>
                                    //   // confirmDelete(paiement.immatricule)
                                    // }
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
                              </DialogPanel>
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

export default TablePayment;
