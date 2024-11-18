import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Tarif } from '../../../../types/tarif';

const DetailTarif = () => {
  // Changement du nom en majuscule
  // Récupérer le paramètre d'URL 'idCorrecteur'
  const { idTarif } = useParams<{ idTarif: string }>();
  const [tarif, setTarif] = useState<Tarif | null>(null);
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // État pour le Dialog
  const [open1, setOpen1] = useState(false); // État pour le Dialog
  const navigate = useNavigate();

  const handleRetour = () => {
    navigate('/administrateur/dashboard/tarif');
  };

  const handleDeleting = () => {
    setOpen(true);
  };

  const cancelDelete = () => {
    setOpen(false);
  };

  // Fonction pour supprimer un correcteur
  const confirmDelete = async (idTarif: string) => {
    try {
      await axios.delete(`https://gestion-vacation.onrender.com/api/tarif/${idTarif}`);
      setTarifs(tarifs.filter((tarif) => tarif.idTarif !== idTarif));
      setOpen1(true); // Afficher le message de succès
      setOpen(false);
      setTimeout(() => {
        navigate('/administrateur/dashboard/tarif'); // Naviguer après un délai
      }, 3000); // Délai de 2 secondes avant de naviguer
    } catch (err) {
      alert('Erreur lors de la suppression du correcteur.');
    }
  };

  useEffect(() => {
    const fetchTarif = async () => {
      try {
        // Inclure idCorrecteur dans l'URL de la requête
        const response = await axios.get(
          `https://gestion-vacation.onrender.com/api/tarif/${idTarif}`,
        );
        setTarif(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des détails du correcteur');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTarif();
  }, [idTarif]);

  // Affichage d'un loader pendant le chargement
  if (loading)
    return (
      <p className="flex h-screen items-center justify-center text-black dark:text-white">
        Chargement de detail des vacations du correcteur...
      </p>
    );
  if (error)
    return (
      <p className="flex h-screen items-center justify-center text-black dark:text-white">
        {error} ou les données a été réinitialisé
      </p>
    );

  // Affichage des détails du correcteur
  return (
    <>
      <Breadcrumb pageName="Detail du vacation" />

      <div className="grid grid-cols-1 gap-9">
        {tarif ? (
          <div className="flex flex-col gap-9 w-full">
            <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  L'ID du tarif est : {tarif.idTarif}
                </h3>
              </div>

              <Dialog
                open={open1}
                onClose={() => setOpen1(false)}
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
                          Le tarif a été supprimé!
                        </p>
                      </div>
                    </div>
                  </DialogPanel>
                </div>
              </Dialog>

              <form action="">
                <div className="p-6.5">
                  <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                    <div className="w-full xl:w-1/2">
                      <label
                        htmlFor="optionTarif"
                        className="mb-2.5 block text-black dark:text-white"
                      >
                        Option du tarif <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="optionTarif"
                        name="optionTarif"
                        id="optionTarif"
                        placeholder="Entrez le nombre du tarif désigné"
                        value={tarif.optionTarif}
                        readOnly
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label
                        htmlFor="nombreTarif"
                        className="mb-2.5 block text-black dark:text-white"
                      >
                        Nombre du tarif <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="number"
                        name="nombreTarif"
                        id="nombreTarif"
                        placeholder="Entrez le nombre du tarif désigné"
                        value={tarif.nombreTarif}
                        readOnly
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                    <div className="w-full xl:w-1/2">
                      <label
                        htmlFor="MontantTarif"
                        className="mb-2.5 block text-black dark:text-white"
                      >
                        Montant (en Ar) <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="number"
                        name="MontantTarif"
                        id="MontantTarif"
                        placeholder="Entrez le montant du tarif"
                        value={tarif.MontantTarif}
                        readOnly
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Bouton de soumission */}
                  <div className="flex justify-end p-6.5 border-t border-stroke dark:border-strokedark">
                    <button
                      type="button"
                      className="mr-3 inline-flex h-11 items-center justify-center rounded-md border
                                             border-secondary bg-transparent text-black transition hover:bg-transparent
                                             hover:border-secondary hover:text-secondary dark:border-secondary 
                                              dark:bg-transparent dark:text-white dark:hover:border-secondary dark:hover:text-secondary"
                      style={{ width: '120px' }} // Ajustez la largeur selon vos besoins
                      onClick={handleRetour}
                    >
                      <ArrowLeftIcon className="h-auto w-5 text-secondary" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleting}
                      className={`mr-3 inline-flex w-60 h-11 items-center justify-center rounded-md border
                                             border-danger bg-transparent text-black transition hover:bg-transparent
                                             hover:border-danger hover:text-danger dark:border-danger 
                                              dark:bg-transparent dark:text-white dark:hover:border-danger dark:hover:text-danger ${
                                                loading
                                                  ? 'cursor-not-allowed opacity-50'
                                                  : ''
                                              }`}
                    >
                      {loading ? (
                        'Mise à jour en cours...'
                      ) : (
                        <TrashIcon className="h-auto w-5 text-danger" />
                      )}
                    </button>
                  </div>
                </div>
              </form>

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
                              Confirmation
                            </DialogTitle>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500 dark:text-gray-300">
                                Voulez-vous vraiment supprimer ce correcteur
                                dont l'ID est : {tarif.idTarif} ?
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 mb-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => confirmDelete(tarif.idTarif)}
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
            </div>
          </div>
        ) : (
          <p>Aucun Tarif trouvé.</p>
        )}
      </div>
    </>
  );
};

export default DetailTarif;
