import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import {
  Dialog
} from '@headlessui/react';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Payment } from '../../../../types/Payment';
import API_PAIEMENT from '../../../../api/paiement';
import { toast } from 'react-toastify';

const DetailPaymentVacation = () => {
  // Changement du nom en majuscule
  // Récupérer le paramètre d'URL 'idCorrecteur'
  const { idCorrecteur } = useParams<{ idCorrecteur: string }>();
  const [paiements, setPaiements] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  // const [open1, setOpen1] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1);
  const [paiementsPerPage] = useState(5);
  const navigate = useNavigate();

  const handleRetour = () => {
    navigate('/présidence-service-finance/paiement-liste');
  };

  const handleDeleting = () => {
    setOpen(true);
  };

  const cancelDelete = () => {
    setOpen(false);
  };

  // Fonction pour supprimer un correcteur
  const confirmDelete = async (idPaiement: string) => {
    try {
      // await axios.delete(`http://localhost:3000/api/paiement/${idPaiement}`);
      await axios.delete(`${API_PAIEMENT.supprimerPaiement}/${idPaiement}`);
      setPaiements(
        paiements.filter((paiement) => paiement.idPaiement !== idPaiement),
      );
      // setOpen1(true); // Afficher le message de succès
      toast.success('Paiement supprimé avec succès !');
      setTimeout(() => {
        navigate('/présidence-service-finance/paiement-liste'); // Naviguer après un délai
      }, 3000); // Délai de 2 secondes avant de naviguer
    } catch (err) {
      toast.error('Erreur lors de la suppression du correcteur.');
    }
  };

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        // Inclure idCorrecteur dans l'URL de la requête
        // const response = await axios.get<Payment[]>(
        //   `http://localhost:3000/api/paiement/correcteur/${idCorrecteur}`,
        // );
        const response = await axios.get<Payment[]>(
          `${API_PAIEMENT.avoirIdCorrecteurPaiement}/${idCorrecteur}`,
        );
        setPaiements(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des détails du correcteur');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [idCorrecteur]);


  // Calculer le nombre total de pages
  const totalPages = Math.ceil(paiements.length / paiementsPerPage);
  const indexOfLastPaiement = currentPage * paiementsPerPage;
  const indexOfFirstPaiement = indexOfLastPaiement - paiementsPerPage;
  const currentPaiements = paiements.slice(
    indexOfFirstPaiement,
    indexOfLastPaiement,
  );

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


  // Affichage d'un loader pendant le chargement
  if (loading)
    return (
      <p className="flex h-screen items-center justify-center text-black dark:text-white">
        Chargement de detail des paiements du correcteur...
      </p>
    );
  if (error)
    return (
      <p className="flex h-screen items-center justify-center text-black dark:text-white">
        {error} ou les données a été réinitialisé
      </p>
    );

  const handleView = () => {
    navigate('/présidence-service-finance/nouveau-paiement');
  };

  // Affichage des détails du correcteur
  return (
    <>
      <Breadcrumb pageName="Detail de paiement vacation" />

      <div className="grid grid-cols-1 gap-9">
        <div className="max-w-full overflow-x-auto rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="vacation-info mb-4">
            <div className="flex justify-center space-x-12">
              <div className="info-item">
                <h5 className="font-medium text-black dark:text-white">
                  ID Correcteur: {currentPaiements[0]?.idCorrecteur}
                </h5>
              </div>
              <div className="info-item">
                <h5 className="font-medium text-black dark:text-white">
                  N° immatricule: {currentPaiements[0]?.immatricule}
                </h5>
              </div>
              <div className="info-item">
                <h5 className="font-medium text-black dark:text-white">
                  Nom complet: {currentPaiements[0]?.nom}{' '}
                  {currentPaiements[0]?.prenom}
                </h5>
              </div>
              <div className="info-item">
                <h5 className="font-medium text-black dark:text-white">
                  CIN: {currentPaiements[0]?.cin}
                </h5>
              </div>
            </div>
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray text-left dark:bg-meta-4">
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  ID paiement
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  ID vacation
                </th>
                <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                  Bacc spécialité
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Secteur
                </th>
                <th className="min-w-[210px] py-4 px-4 font-medium text-black dark:text-white">
                  Option
                </th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                  Matière spécialisée
                </th>
                <th className="min-w-[160px] py-4 px-4 font-medium text-black dark:text-white">
                  Code pochette
                </th>
                <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white">
                  Nombre du copie corrigée
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Montant
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Session
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPaiements.length > 0 ? (
                currentPaiements.map((paiement) => (
                  <tr key={paiement.idPaiement}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {paiement.idPaiement}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {paiement.idVacation}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {paiement.specialite}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {paiement.secteur}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {paiement.option}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {paiement.matiere}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {paiement.pochette}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {paiement.nbcopie}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {paiement.montantTotal}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {paiement.session}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center justify-center space-x-3.5">
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
                                        {paiement.idPaiement} ?
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 mb-4 flex justify-end">
                                <button
                                  onClick={cancelDelete}
                                  className="mr-3 ml-3 inline-flex h-11 items-center justify-center rounded-md border
                                                                        border-secondary bg-transparent text-black transition hover:bg-transparent
                                                                        hover:border-secondary hover:text-secondary dark:border-graydark 
                                                                        dark:bg-transparent dark:text-strokedark dark:hover:border-secondary dark:hover:text-secondary"
                                >
                                  <span className='m-5'>Annuler</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    confirmDelete(paiement.idPaiement)
                                  }
                                  className="mr-3 ml-3 inline-flex h-11 items-center justify-center rounded-md border
                                                                        border-danger bg-transparent text-black transition hover:bg-transparent
                                                                        hover:border-danger hover:text-danger dark:border-graydark 
                                                                        dark:bg-transparent dark:text-strokedark dark:hover:border-danger dark:hover:text-danger"
                                >
                                  <span className='m-5'>Oui, supprimer</span>
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

      <div className="flex justify-end p-6.5 border-t border-stroke dark:border-strokedark">
        <button
          type="button"
          className="mr-auto inline-flex h-11 items-center justify-center rounded-md border
                                         border-primary bg-transparent text-black transition hover:bg-transparent
                                         hover:border-primary hover:text-primary dark:border-strokedark 
                                          dark:bg-transparent dark:text-white dark:hover:border-primary dark:hover:text-primary"
          style={{ width: '200px' }} // Ajustez la largeur selon vos besoins
          onClick={handleView}
        >
          Nouveau paiement
        </button>
        <button
          type="button"
          className="mr-3 ml-3 inline-flex h-11 items-center justify-center rounded-md border
                                         border-secondary bg-transparent text-black transition hover:bg-transparent
                                         hover:border-secondary hover:text-secondary dark:border-strokedark 
                                          dark:bg-transparent dark:text-white dark:hover:border-secondary dark:hover:text-secondary"
          style={{ width: '180px' }} // Ajustez la largeur selon vos besoins
          onClick={handleRetour}
        >
          <ArrowLeftIcon className="h-auto w-5 text-secondary" />
        </button>
      </div>
    </>
  );
};

export default DetailPaymentVacation;
