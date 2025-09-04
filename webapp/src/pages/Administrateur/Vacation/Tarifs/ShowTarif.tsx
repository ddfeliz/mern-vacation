/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from 'react-router-dom';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { CheckCircleIcon, EyeIcon, PencilSquareIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Tarif } from '../../../../types/tarif';
import { BsFillFilePlusFill } from 'react-icons/bs';
import API_TARIF from '../../../../api/tarif';
import { toast } from 'react-toastify';

const ShowTarif = () => {
    const [tarifs, setTarifs] = useState<Tarif[]>([]);
    const [loading, setLoading] = useState(true);
    // const [dropdownOpen, setDropdownOpen] = useState(false);
    const [open, setOpen] = useState(false); // État pour le Dialog
    const [open2, setOpen2] = useState(false); // État pour le Dialog
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [tarifsPerPage] = useState(5); // Modifier cette valeur pour ajuster le nombre de correcteurs par page
    useEffect(() => {
        const fetchTarifs = async () => {
            try {
                const response = await axios.get(API_TARIF.listesTarif);
                setTarifs(response.data);
            } catch (err) {
                setError('Erreur lors de la récupération des correcteurs');
            } finally {
                setLoading(false);
            }
        };

        fetchTarifs();
    }, []);

    // Calculer les indices de début et de fin pour les correcteurs affichés
    const indexOfLastTarif = currentPage * tarifsPerPage;
    const indexOfFirstTarif = indexOfLastTarif - tarifsPerPage;
    const currentTarifs = tarifs.slice(indexOfFirstTarif, indexOfLastTarif);

    // Changer de page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) return <p className='flex h-screen items-center justify-center text-black dark:text-white'>Chargement des tarifs...</p>;
    if (error) return <p className='flex h-screen items-center justify-center text-black dark:text-white'>
        {error} ou cliquez ici

        <Link
            to="/présidence-service-finance/nouveau-tarif"
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 mx-2 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
            <span>
                <BsFillFilePlusFill />
            </span>
            Nouveau Tarif
        </Link>
    </p>;

    // Calculer le nombre total de pages
    const totalPages = Math.ceil(tarifs.length / tarifsPerPage);



    const handleDeleting = () => {
        setOpen(true);
        // setDropdownOpen(false);
    };


    const cancelDelete = () => {
        setOpen(false);
    };

    // Fonction pour supprimer un correcteur
    const confirmDelete = async (idTarif: string) => {
        try {
            await axios.delete(`${API_TARIF.avoirIdTarif}/${idTarif}`);
            setTarifs(tarifs.filter((tarif) => tarif.idTarif !== idTarif));
            // setOpen2(true);
            toast.success('Tarif supprimé avec succès.');
            setOpen(false);
        } catch (err) {
            alert("Erreur lors de la suppression du tarif.");
        }
    }

    return (
        <>
            <Breadcrumb pageName="Tarifs" />
            <div className="mb-2 flex flex-wrap gap-5 xl:gap-7.5 justify-end">
                <Link
                    to="/présidence-service-finance/nouveau-tarif"
                    className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                    <span>
                        <BsFillFilePlusFill />
                    </span>
                    Nouveau Tarif
                </Link>
            </div>

            <Dialog open={open2} onClose={() => setOpen2(false)} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
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
                                    Le Tarif a été supprimé!
                                </p>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="max-w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        ID
                                    </th>
                                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        Option du tarif
                                    </th>
                                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        Nombre du tarif
                                    </th>
                                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                        Montant du tarif
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTarifs.map((tarif) => (
                                    <tr key={tarif.idTarif}>
                                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {tarif.idTarif}
                                            </h5>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {tarif.optionTarif}
                                            </h5>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                            <h5 className="font-medium text-black dark:text-white">
                                                {tarif.nombreTarif}
                                            </h5>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">
                                                {tarif.MontantTarif} Ar
                                            </p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <div className="flex items-center justify-center space-x-3.5">
                                                <Link to={`/présidence-service-finance/detail-tarif/${tarif.idTarif}`} className="hover:text-primary">
                                                    <EyeIcon className='h-auto w-5 text-secondary' />
                                                </Link>
                                                <Link to={`/présidence-service-finance/modifier-tarif/${tarif.idTarif}`} className="hover:text-primary">
                                                    <PencilSquareIcon className='h-auto w-5 text-primary' />
                                                </Link>
                                                <button
                                                    onClick={handleDeleting}
                                                >
                                                    <TrashIcon className='h-auto w-5 text-danger' />
                                                </button>
                                            </div>

                                            {/* Modal de Confirmation avec Dialog */}
                                            <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
                                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />
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
                                                                        <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
                                                                            Confirmation
                                                                        </DialogTitle>
                                                                        <div className="mt-2">
                                                                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                                                                Voulez-vous vraiment supprimer ce correcteur dont l'ID est : {tarif.idTarif} ?
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
                                                                    type='button'
                                                                    onClick={() => confirmDelete(tarif.idTarif)}
                                                                    className="mr-3 ml-3 inline-flex h-11 items-center justify-center rounded-md border
                                                                        border-danger bg-transparent text-black transition hover:bg-transparent
                                                                        hover:border-danger hover:text-danger dark:border-graydark 
                                                                        dark:bg-transparent dark:text-strokedark dark:hover:border-danger dark:hover:text-danger"
                                                                >
                                                                    <span className='m-5'>Oui, supprimer</span>
                                                                </button>
                                                            </div>
                                                        </DialogPanel>
                                                    </div>
                                                </div>
                                            </Dialog>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-center space-x-2 mt-4">
                    <button
                        className={`py-2 px-4 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary text-white'}`}
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Précédent
                    </button>
                    <button
                        className={`py-2 px-4 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary text-white'}`}
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

export default ShowTarif;
