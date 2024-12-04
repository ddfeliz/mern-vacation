import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Correcteur } from '../../../types/correcteur';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ArrowLeftIcon, CheckCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const detailCorrecteur = () => {  // Changement du nom en majuscule
    // Récupérer le paramètre d'URL 'idCorrecteur'
    const { idCorrecteur } = useParams<{ idCorrecteur: string }>();
    const [correcteur, setCorrecteur] = useState<Correcteur | null>(null);
    const [correcteurs, setCorrecteurs] = useState<Correcteur[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false); // État pour le Dialog
    const [open1, setOpen1] = useState(false); // État pour le Dialog
    const navigate = useNavigate();

    const handleRetour = () => {
        navigate('/présidence-service-finance/correcteur');
    };

    const handleDeleting = () => {
        setOpen(true);
    };


    const cancelDelete = () => {
        setOpen(false);
    };

    // Fonction pour supprimer un correcteur
    const confirmDelete = async (idCorrecteur: string) => {
            try {
                await axios.delete(`http://localhost:3000/api/correcteur/${idCorrecteur}`);
                setCorrecteurs(correcteurs.filter((correcteur) => correcteur.idCorrecteur !== idCorrecteur));
                setOpen1(true); // Afficher le message de succès
                setTimeout(() => {
                    navigate('/présidence-service-finance/correcteur'); // Naviguer après un délai
                }, 3000); // Délai de 2 secondes avant de naviguer
            } catch (err) {
                alert("Erreur lors de la suppression du correcteur.");
            }
        
    };

    useEffect(() => {
        const fetchCorrecteur = async () => {
            try {
                // Inclure idCorrecteur dans l'URL de la requête
                const response = await axios.get(`http://localhost:3000/api/correcteur/${idCorrecteur}`);
                setCorrecteur(response.data);
            } catch (err) {
                setError('Erreur lors de la récupération des détails du correcteur');
                console.log(error);
                
            } finally {
                setLoading(false);
            }
        };

        fetchCorrecteur();
    }, [idCorrecteur]);

    // Affichage d'un loader pendant le chargement
  if (loading)
    return (
      <p className="flex h-screen items-center justify-center text-black dark:text-white">
        Chargement de detail du correcteur...
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
            <Breadcrumb pageName="Detail Correcteur" />

            <div className='grid grid-cols-1 gap-9'>
                {correcteur ? (
                    <div className='flex flex-col gap-9 w-full'>
                        <div className='w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                <h3 className="font-medium text-black text-center dark:text-white">
                                    Numéro immatricule du correcteur : {correcteur.immatricule}
                                </h3>
                            </div>

                            <Dialog open={open1} onClose={() => setOpen1(false)} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
                                {/* Arrière-plan grisé */}
                                <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />

                                {/* Contenu de la modal */}
                                <div className="flex items-center justify-center min-h-screen">
                                    <DialogPanel className="relative mx-auto w-full max-w-md rounded-lg bg-white shadow-lg p-6">
                                        {/* Icône et Message */}
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <CheckCircleIcon className="h-12 w-12 text-green-600" aria-hidden="true" />
                                            </div>
                                            <div>
                                                <DialogTitle className="text-xl font-medium text-gray-900">Suppression avec succès</DialogTitle>
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Le correcteur a été supprimé!
                                                </p>
                                            </div>
                                        </div>
                                    </DialogPanel>
                                </div>
                            </Dialog>

                            <form action="">
                                <div className='p-6.5'>
                                    <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Prénom <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={correcteur.nom}
                                                disabled
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Nom de famille <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={correcteur.prenom}
                                                disabled
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                CIN <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={correcteur.cin}
                                                disabled
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Téléphone<span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={correcteur.telephone}
                                                disabled
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Adresse <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={correcteur.adresse}
                                                disabled
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Adresse Presonnelle <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={correcteur.adresseProfession}
                                                disabled
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                    </div>
                                    <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Baccalauréat d'enseignement <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={correcteur.specialite}
                                                disabled
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Secteur <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={correcteur.secteur}
                                                disabled
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Option <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={correcteur.option}
                                                disabled
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-2.5 block text-black dark:text-white">
                                                Matière <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={correcteur.matiere}
                                                disabled
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

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
                                            <ArrowLeftIcon className='h-auto w-5 text-secondary'/>
                                        </button>
                                        <button
                                            type="button"
                                            className="mr-3 inline-flex h-11 items-center justify-center rounded-md border
                                             border-danger bg-transparent text-black transition hover:bg-transparent
                                             hover:border-danger hover:text-danger dark:border-danger 
                                              dark:bg-transparent dark:text-white dark:hover:border-danger dark:hover:text-danger"
                                            style={{ width: '120px' }} // Ajustez la largeur selon vos besoins
                                            onClick={handleDeleting}
                                        >
                                            <TrashIcon className='h-auto w-5 text-danger'/>
                                        </button>
                                        <Link to={`/présidence-service-finance/modifier-correcteur/${correcteur.idCorrecteur}`}>
                                            <button
                                                type="button"
                                                disabled={loading}
                                                className={`mr-3 inline-flex w-40 h-11 items-center justify-center rounded-md border
                                             border-primary bg-transparent text-black transition hover:bg-transparent
                                             hover:border-primary hover:text-primary dark:border-primary 
                                              dark:bg-transparent dark:text-white dark:hover:border-primary dark:hover:text-primary ${loading ? "cursor-not-allowed opacity-50" : ""
                                                    }`}
                                            >
                                                {loading ? "Chargement..." : <PencilSquareIcon  className='h-auto w-5 text-primary'/> }
                                            </button>
                                        </Link>
                                    </div>

                                    {/* Modal de Confirmation avec Dialog */}
                                    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
                                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />
                                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg dark:bg-gray-800">
                                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 dark:bg-gray-800">
                                                        <div className="sm:flex sm:items-start">
                                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-red-600">
                                                                <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-red-600 dark:text-red-200" />
                                                            </div>
                                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                                <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
                                                                    Confirmation
                                                                </Dialog.Title>
                                                                <div className="mt-2">
                                                                    <p className="text-sm text-gray-500 dark:text-gray-300">
                                                                        Voulez-vous vraiment supprimer ce correcteur dont l'ID est : {correcteur.idCorrecteur} ?
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 mb-4 flex justify-end">
                                                        <button
                                                            type='button'
                                                            onClick={() => confirmDelete(correcteur.idCorrecteur)}
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


                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <p>Aucun correcteur trouvé.</p>
                )}

            </div>
        </>
    );
};

export default detailCorrecteur;
