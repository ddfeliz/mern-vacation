import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import axios from "axios"; // Importer Axios
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ArrowLeftIcon, CheckCircleIcon, ExclamationTriangleIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

const EditCorrecteur = () => {
    const { idCorrecteur } = useParams<{ idCorrecteur: string }>(); // Récupérer l'ID du correcteur depuis l'URL
    const navigate = useNavigate(); // Permet de rediriger après modification
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        cin: '',
        adresse: '',
        adresseProfession: '',
        telephone: '',
        grade: ''
    });
    const [loading, setLoading] = useState(false); // État pour gérer le chargement
    const [error, setError] = useState<string | null>(null); // État pour gérer les erreurs
    const [open, setOpen] = useState(false);
    const [openCIN, setOpenCIN] = useState(false);

    useEffect(() => {
        // Récupération des informations du correcteur à partir de l'API
        const fetchCorrecteur = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3000/api/correcteur/${idCorrecteur}`);
                const correcteur = response.data;

                setFormData({
                    firstName: correcteur.prenom,
                    lastName: correcteur.nom,
                    cin: correcteur.cin,
                    adresse: correcteur.adresse,
                    adresseProfession: correcteur.adresseProfession,
                    telephone: correcteur.telephone,
                    grade: correcteur.grade
                });
            } catch (err) {
                setError("Erreur lors de la récupération des informations du correcteur.");
            } finally {
                setLoading(false);
            }
        };

        fetchCorrecteur();
    }, [idCorrecteur]);


    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRetour = () => {
        navigate('/administrateur/dashboard/correcteur');
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);

        // Préparez les données à envoyer
        const { firstName, lastName, cin, adresse, adresseProfession, telephone, grade } = formData;

        try {
            const response = await axios.put(`http://localhost:3000/api/correcteur/${idCorrecteur}`, {
                nom: lastName,
                prenom: firstName,
                cin,
                adresse,
                adresseProfession,
                telephone,
                grade
            });

            console.log('Correcteur mis à jour avec succès', response.data);

            setOpen(true); // Afficher le message de succès
            setTimeout(() => {
                navigate('/administrateur/dashboard/correcteur'); // Naviguer après un délai
            }, 3000); // Délai de 2 secondes avant de naviguer

        } catch (error) {
            setError('Erreur lors de la mise à jour du correcteur.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Breadcrumb pageName="Modifier Correcteur" />

            <div className="grid grid-cols-1 gap-9">
                <div className="flex flex-col gap-9 w-full">
                    {/* Formulaire de modification de correcteur */}
                    <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Formulaire de modification
                            </h3>
                        </div>


                        <Dialog open={open} onClose={() => setOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
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
                                            <DialogTitle className="text-xl font-medium text-gray-900">Mofification avec succès</DialogTitle>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Le correcteur a été modifié!
                                            </p>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </div>
                        </Dialog>


                        <Dialog open={openCIN} onClose={() => setOpenCIN(false)} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
                            {/* Arrière-plan grisé */}
                            <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />

                            {/* Contenu de la modal */}
                            <div className="flex items-center justify-center min-h-screen">
                                <DialogPanel className="relative mx-auto w-full max-w-md rounded-lg bg-white shadow-lg p-6">
                                    {/* Icône et Message */}
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <ExclamationTriangleIcon className="h-12 w-12 text-red-500" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-xl font-medium text-red-600">Verification de votre CIN</DialogTitle>
                                            <p className="mt-2 text-sm font-medium text-gray-500 dark:text-black">
                                                Le CIN que tu as saisi doit être <span className="text-red-600">12 chiffre</span>!
                                                <br /> Veuillez verifier bien votre CIN.
                                            </p>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </div>
                        </Dialog>

                        <form onSubmit={handleSubmit}>
                            <div className="p-6.5">
                                {/* Prénom et nom de famille */}
                                <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                                    <div className="w-full xl:w-1/2">
                                        <label htmlFor="firstName" className="mb-2.5 block text-black dark:text-white">
                                            Prénom <span className="text-meta-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            id="firstName"
                                            placeholder="Entrez votre prénom"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                        <label htmlFor="lastName" className="mb-2.5 block text-black dark:text-white">
                                            Nom de famille <span className="text-meta-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            id="lastName"
                                            placeholder="Entrez votre nom de famille"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                {/* Email et téléphone */}
                                <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                                    <div className="w-full xl:w-1/2">
                                        <label htmlFor="cin" className="mb-2.5 block text-black dark:text-white">
                                            CIN <span className="text-meta-1">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="cin"
                                            id="cin"
                                            placeholder="Entrez votre numéro CIN"
                                            value={formData.cin}
                                            onChange={handleChange}
                                            onBlur={() => {
                                                // Assurer que le CIN comporte exactement 12 chiffres
                                                if (formData.cin.length !== 12) {
                                                    setOpenCIN(true);
                                                }
                                            }}
                                            minLength={12}
                                            maxLength={12} // Limite le nombre de chiffres affiché dans l'input
                                            required
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                        <label htmlFor="telephone" className="mb-2.5 block text-black dark:text-white">
                                            Téléphone <span className="text-meta-1">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="telephone"
                                            id="telephone"
                                            placeholder="Entrez votre numéro de téléphone"
                                            value={formData.telephone}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                {/* Ligne pour adresse, adresseProssion et grade */}
                                <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                                    <div className="w-full xl:w-1/3">
                                        <label htmlFor="adresse" className="mb-2.5 block text-black dark:text-white">
                                            Adresse <span className="text-meta-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="adresse"
                                            id="adresse"
                                            placeholder="Entrez votre adresse"
                                            value={formData.adresse}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="w-full xl:w-1/3">
                                        <label htmlFor="adresseProfession" className="mb-2.5 block text-black dark:text-white">
                                            Adresse Professionnelle <span className="text-meta-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="adresseProfession"
                                            id="adresseProfession"
                                            placeholder="Entrez votre adresse professionnelle"
                                            value={formData.adresseProfession}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="w-full xl:w-1/3">
                                        <label htmlFor="grade" className="mb-2.5 block text-black dark:text-white">
                                            Grade <span className="text-meta-1">*</span>
                                        </label>
                                        <select
                                            name="grade"
                                            id="grade"
                                            value={formData.grade}
                                            onChange={handleChange}
                                            required
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        >
                                            <option value="">Sélectionnez votre grade</option>
                                            <option value="Junior">Junior</option>
                                            <option value="Intermediate">Intermédiaire</option>
                                            <option value="Senior">Senior</option>
                                            <option value="Expert">Expert</option>
                                        </select>
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
                                        <ArrowLeftIcon className='h-auto w-5 text-secondary' />
                                    </button>
                                    <button
                                        type="submit"
                                        className={`mr-3 inline-flex w-60 h-11 items-center justify-center rounded-md border
                                             border-primary bg-transparent text-black transition hover:bg-transparent
                                             hover:border-primary hover:text-primary dark:border-primary 
                                              dark:bg-transparent dark:text-white dark:hover:border-primary dark:hover:text-primary ${loading ? "cursor-not-allowed opacity-50" : ""
                                            }`}
                                    >
                                        {loading ? "Mise à jour en cours..." : <PencilSquareIcon className='h-auto w-5 text-primary' />}
                                    </button>
                                </div>

                                {error && <p className="text-meta-1 mt-4">{error}</p>}
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </>
    );
};

export default EditCorrecteur;
