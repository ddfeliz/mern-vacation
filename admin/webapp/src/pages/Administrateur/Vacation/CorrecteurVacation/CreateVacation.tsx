import { useEffect, useState } from 'react';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios'; // Importer Axios
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { CheckCircleIcon, ExclamationTriangleIcon, StopCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const currentSession = new Date().getFullYear();

const CreateVacation = () => {
  const [formData, setFormData] = useState({
    idCorrecteur: '',
    firstName: '',
    lastName: '',
    cin: '',
    telephone: '',
    specialite: '',
    secteur: '',
    option: '',
    matiere: '',
    grade: '',
    experience: '',
    nbcopie: '',
  });
  const [loading, setLoading] = useState(false); // État pour gérer le chargement

  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [openVerifyVac, setOpenVerifyVac] = useState(false);
  const [openVerifyCorrecteur, setOpenVerifyCorrecteur] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [idCorrecteur, setIdCorrecteur] = useState(''); // État pour stocker l'ID

  // Utilisation de useEffect pour lancer un timer de 5 secondes
  useEffect(() => {
    if (error) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Fonction pour récupérer les données d'un correcteur par ID
  const fetchCorrecteurById = async () => {
    try {
      setLoading(true);
      // Appel à l'API pour récupérer les informations du correcteur par ID
      const response = await axios.get(
        `https://gestion-vacation.onrender.com/api/correcteur/${idCorrecteur}`,
      );
      const fetchedData = response.data;
      // Remplir le formulaire avec les valeurs récupérées
      setFormData({
        idCorrecteur: fetchedData.idCorrecteur,
        firstName: fetchedData.nom || '',
        lastName: fetchedData.prenom || '',
        cin: fetchedData.cin || '',
        telephone: fetchedData.telephone || '',
        specialite: fetchedData.specialite || '',
        secteur: fetchedData.secteur || '',
        option: fetchedData.option || '',
        matiere: fetchedData.matiere || '',
        grade: fetchedData.grade || '',
        experience: fetchedData.experience || '',
        nbcopie: '',
      });

      setError('');
    } catch (err) {
      console.error('Erreur lors de la récupération des champs :', err);
      setOpenVerifyCorrecteur(true);
      setError('Aucun correcteur trouvé avec cet ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleReset = () => {
    setFormData({
      idCorrecteur: '',
      firstName: '',
      lastName: '',
      cin: '',
      telephone: '',
      specialite: '',
      secteur: '',
      option: '',
      matiere: '',
      grade: '',
      experience: '',
      nbcopie: '',
    });
  };

  const handleView = () => {
    navigate('/administrateur/dashboard/vacation');
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true); // Démarrer le chargement

    // Préparez les données à envoyer
    const {
      idCorrecteur,
      firstName,
      lastName,
      cin,
      telephone,
      specialite,
      secteur,
      option,
      matiere,
      grade,
      experience,
      nbcopie,
    } = formData;

    if (!cin) {
      setOpenVerify(true);
      setLoading(false);
    }

    // Vérification si le CIN existe déjà
    const currentSession = new Date().getFullYear(); // Utilisation de l'année actuelle
    const checkResponse = await axios.get(
      `https://gestion-vacation.onrender.com/api/vacation/check/${idCorrecteur}/${currentSession}`,
    );

    try {
      if (checkResponse.data.exists) {
        // Si une vacation existe déjà pour la session actuelle, afficher un message et arrêter la soumission
        // setError(
        //   `Le correcteur ${idCorrecteur} a déjà une vacation pour la session ${currentSession}.`
        // );
        setOpenVerifyVac(true); // Afficher le dialogue ou message d'erreur
        setLoading(false);
      } else {
        const response = await axios.post(
          'https://gestion-vacation.onrender.com/api/vacation/add',
          {
            idCorrecteur,
            nom: lastName,
            prenom: firstName,
            cin,
            telephone,
            specialite,
            secteur,
            option,
            matiere,
            grade,
            experience,
            nbcopie,
          },
        );

        console.log('Vacation ajouté avec succès', response.data);
        // Traitez le succès ici, par exemple afficher un message ou rediriger

        setOpen(true); // Afficher le message de succès
        setTimeout(() => {
          navigate('/administrateur/dashboard/vacation'); // Naviguer après un délai
        }, 3000); // Délai de 2 secondes avant de naviguer
      }
    } catch (err: any) {
      if (err.response) {
        setError(
          err.response.data.message ||
            'Authentication failed. Please try again.',
        );
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

  return (
    <>
      <Breadcrumb pageName="Nouveau vacation" />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9 w-full">
          {/* Formulaire de création de correcteur */}
          <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              {/*  <h3 className="font-medium text-black dark:text-white">
                                Formulaire du vacation
                            </h3>
                            */}
              {/* Champ d'ID et bouton de recherche */}
              <div className="mb-4.5 flex gap-6 items-center">
                <div className="w-full xl:w-1/2">
                  <label
                    htmlFor="id"
                    className="mb-2.5 block text-black dark:text-white"
                  >
                    ID du Correcteur
                  </label>
                  <input
                    type="text"
                    name="id"
                    id="id"
                    placeholder="Entrez l'ID du correcteur"
                    value={idCorrecteur}
                    disabled={loading}
                    onChange={(e) => setIdCorrecteur(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={fetchCorrecteurById}
                  className="flex items-center justify-center rounded bg-blue-500 py-3 px-6 mt-7 font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                  disabled={!idCorrecteur || loading}
                >
                  {loading ? 'Recherche...' : 'Rechercher'}
                </button>
              </div>
            </div>

            <Dialog
              open={open}
              onClose={() => setOpen(false)}
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
                        Ajout avec succès
                      </DialogTitle>
                      <p className="mt-2 text-sm text-gray-500">
                        Le vacation du correcteur a été enregistré!
                      </p>
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </Dialog>

            <Dialog
              open={openVerify}
              onClose={() => setOpenVerify(false)}
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
                      <StopCircleIcon
                        className="h-12 w-12 text-danger"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-medium text-danger">
                        Des erreurs survenus
                      </DialogTitle>
                      <p className="mt-2 text-sm text-gray-500">
                        Veuillez completer les autres champs manquantes!
                      </p>
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </Dialog>

            <Dialog
              open={openVerifyVac}
              onClose={() => setOpenVerifyVac(false)}
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
                        className="h-12 w-12 text-warning"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-medium text-danger">
                        Verification du vacation
                      </DialogTitle>
                      <p className="mt-2 text-sm text-gray-500">
                        Cette vacation existe déjà! Veuillze verifer vos source.
                      </p>
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </Dialog>

            <Dialog
              open={openVerifyCorrecteur}
              onClose={() => setOpenVerifyCorrecteur(false)}
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
                      <ExclamationTriangleIcon
                        className="h-12 w-12 text-danger"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-medium text-danger">
                        Verification ID Correcteur
                      </DialogTitle>
                      <p className="mt-2 text-sm text-gray-500">
                        Ce Correcteur n'existe pas! Veuillez verifier vos données.
                      </p>
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </Dialog>

            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                  <div className="w-full xl:w-1/2">
                    <label
                      htmlFor="firstName"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      Prénom <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      placeholder="..."
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label
                      htmlFor="lastName"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      Nom de famille <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      placeholder="..."
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      disabled
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                {/* Ligne pour l'email et le téléphone */}
                <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                  <div className="w-full xl:w-1/2">
                    <label
                      htmlFor="cin"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      CIN <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="number"
                      name="cin"
                      id="cin"
                      placeholder="..."
                      value={formData.cin}
                      onChange={handleChange}
                      onBlur={() => {
                        // Assurer que le CIN comporte exactement 14 chiffres
                        if (formData.cin.length !== 14) {
                          alert(
                            'Le numéro CIN doit contenir exactement 14 chiffres.',
                          );
                        }
                      }}
                      minLength={14}
                      maxLength={14} // Limite le nombre de chiffres affiché dans l'input
                      required
                      disabled
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label
                      htmlFor="telephone"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      Téléphone <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      id="telephone"
                      placeholder="..."
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                      disabled
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                  <div className="w-full xl:w-1/2">
                    <label
                      htmlFor="specialite"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      Bac Spécialité <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="specialite"
                      id="specialite"
                      placeholder="..."
                      value={formData.specialite}
                      onChange={handleChange}
                      required
                      disabled
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label
                      htmlFor="secteur"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      Secteur <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="secteur"
                      id="secteur"
                      placeholder="..."
                      value={formData.secteur}
                      onChange={handleChange}
                      required
                      disabled
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                  <div className="w-full xl:w-1/2">
                    <label
                      htmlFor="option"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      Option <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="option"
                      id="option"
                      placeholder="..."
                      value={formData.option}
                      onChange={handleChange}
                      required
                      disabled
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label
                      htmlFor="matiere"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      Nom de matière <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="matiere"
                      id="matiere"
                      placeholder="..."
                      value={formData.matiere}
                      onChange={handleChange}
                      required
                      disabled
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                  <div className="w-full xl:w-1/2">
                    <label
                      htmlFor="idCorrecteur"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      ID Correcteur <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="idCorrecteur"
                      id="idCorrecteur"
                      placeholder="..."
                      value={formData.idCorrecteur}
                      onChange={handleChange}
                      required
                      disabled
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label
                      htmlFor="nbcopie"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      Nombre des Copies corrigées{' '}
                      <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="number"
                      name="nbcopie"
                      id="nbcopie"
                      placeholder="Entrez le nombre d'années d'expérience"
                      value={formData.nbcopie}
                      onChange={handleChange}
                      required
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end p-6.5 border-t border-stroke dark:border-strokedark">
                  <button
                    type="button"
                    className="mr-auto inline-flex h-11 items-center justify-center rounded-md border
                                         border-warning bg-transparent text-black transition hover:bg-transparent
                                         hover:border-warning hover:text-warning dark:border-strokedark 
                                          dark:bg-transparent dark:text-white dark:hover:border-warning dark:hover:text-warning"
                    style={{ width: '200px' }} // Ajustez la largeur selon vos besoins
                    onClick={handleView}
                  >
                    Listes des vacations
                  </button>
                  <button
                    type="button"
                    className="mr-3 ml-3 inline-flex h-11 items-center justify-center rounded-md border
                                         border-secondary bg-transparent text-black transition hover:bg-transparent
                                         hover:border-secondary hover:text-secondary dark:border-strokedark 
                                          dark:bg-transparent dark:text-white dark:hover:border-secondary dark:hover:text-secondary"
                    style={{ width: '180px' }} // Ajustez la largeur selon vos besoins
                    onClick={handleReset}
                  >
                    Réinitialiser
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`mr-3 inline-flex w-40 h-11 items-center justify-center rounded-md border
                                             border-primary bg-transparent text-black transition hover:bg-transparent
                                             hover:border-primary hover:text-primary dark:border-strokedark 
                                              dark:bg-transparent dark:text-white dark:hover:border-primary dark:hover:text-primary ${
                                                loading
                                                  ? 'cursor-not-allowed opacity-50'
                                                  : ''
                                              }`}
                  >
                    {loading ? 'Chargement...' : 'Créer'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateVacation;
