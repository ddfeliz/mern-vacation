import { useEffect, useState } from 'react';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios'; // Importer Axios
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StopCircleIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_VACATION from '../../../../api/vacation';
import API_CORRECTEUR from '../../../../api/correcteur';
import API_BACC from '../../../../api/baccalaureat';

const CreateVacation = () => {
  const [formData, setFormData] = useState({
    idCorrecteur: '',
    immatricule: '',
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
    pochette: '',
    nbcopie: '',
  });
  const [loading, setLoading] = useState(false); 
  const [open, setOpen] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [openVerifyVac, setOpenVerifyVac] = useState(false);
  const [openVerifyCorrecteur, setOpenVerifyCorrecteur] = useState(false);
  const navigate = useNavigate();
  const [immatricule, setImmatricule] = useState('');
  const [cin, setCin] = useState('');

  const [specialites, setSpecialites] = useState<string[]>([]);
  const [secteurs, setSecteurs] = useState<string[]>([]); // État pour stocker les secteurs
  const [options, setOptions] = useState<string[]>([]); // État pour stocker les options
  const [matieres, setMatieres] = useState<string[]>([]); // État pour stocker les matières

  // Récupérer les spécialités depuis le backend au montage du composant
  useEffect(() => {
    console.log('Fetching specialites...');
    const fetchSpecialites = async () => {
      try {
        const response = await axios.get(
          // 'http://localhost:3000/api/matiere-bacc/specialiste',
          API_BACC.specialisteBacc,
        );
        const fetchedSpecialites = response.data.specialites;
        console.log('Specialites fetched:', fetchedSpecialites);
        setSpecialites(fetchedSpecialites); // Mettre à jour les spécialités avec la réponse de l'API
      } catch (err) {
        console.error('Erreur lors de la récupération des spécialités :', err);
      }
    };

    fetchSpecialites();
  }, []);

  // Récupérer les secteurs en fonction de la spécialité sélectionnée
  const fetchSecteurs = async (specialite: string) => {
    try {
      const response = await axios.get(
        `${API_BACC.secteurBacc}?specialite=${specialite}`,
      );
      setSecteurs(response.data.secteurs); // Mettre à jour les secteurs
      setFormData((prevData) => ({ ...prevData, secteur: '', matiere: '' })); // Réinitialiser secteur et matière
      setMatieres([]); // Réinitialiser les matières
    } catch (err) {
      console.error('Erreur lors de la récupération des secteurs :', err);
    }
  };

  // Récupérer les options en fonction du secteur sélectionné
  const fetchOption = async (secteur: string) => {
    try {
      const response = await axios.get(
        `${API_BACC.optionBacc}?secteur=${secteur}`,
      );
      setOptions(response.data.options); // Mettre à jour les matières
    } catch (err) {
      console.error('Erreur lors de la récupération des matières :', err);
    }
  };

  // Récupérer les matières en fonction du secteur sélectionné
  const fetchMatieres = async (option: string) => {
    try {
      const response = await axios.get(
        `${API_BACC.matiereBacc}?option=${option}`,
      );
      setMatieres(response.data.matieres); // Mettre à jour les matières
    } catch (err) {
      console.error('Erreur lors de la récupération des matières :', err);
    }
  };

  const fetchCorrecteurById = async () => {
    try {
      setLoading(true);

      const searchKey = cin || immatricule; // Priorité à l'immatricule, sinon CIN
      if (!searchKey) {
        throw new Error("L'immatricule ou le CIN est requis.");
      }

      // Appel à l'API avec le bon paramètre
      const response = await axios.get(
        // `http://localhost:3000/api/correcteur/${searchKey}`,
        `${API_CORRECTEUR.avoirIdCorrecteur}/${searchKey}`,
      );
      const fetchedData = response.data;

      // Remplir le formulaire avec les valeurs récupérées
      setFormData({
        idCorrecteur: fetchedData.idCorrecteur || '',
        immatricule: fetchedData.immatricule || '',
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
        pochette: fetchedData.pochette || '',
        nbcopie: fetchedData.nbcopie || '',
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des champs :', err);
      setOpenVerifyCorrecteur(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'specialite') {
      fetchSecteurs(value);
      setFormData((prevData) => ({
        ...prevData,
        secteur: '',
        option: '',
        matiere: '',
      }));
      setOptions([]);
    }

    if (name === 'secteur') {
      fetchOption(value);
      setFormData((prevData) => ({
        ...prevData,
        option: '',
        matiere: '',
      }));
      setMatieres([]);
    }

    if (name === 'option') {
      fetchMatieres(value);
    }
  };

  const handleChange1 = (e: { target: { value: string; }; }) => {
    const value = e.target.value.trim();
    console.log(value); 
      setCin(value);
      setImmatricule(value);
  };
  const handleReset = () => {
    setFormData({
      idCorrecteur: '',
      firstName: '',
      lastName: '',
      immatricule: '',
      cin: '',
      telephone: '',
      specialite: '',
      secteur: '',
      option: '',
      matiere: '',
      grade: '',
      experience: '',
      pochette: '',
      nbcopie: '',
    });
  };

  const handleView = () => {
    navigate('/présidence-service-finance/vacation');
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true); // Démarrer le chargement

    // Préparez les données à envoyer
    const {
      idCorrecteur,
      firstName,
      lastName,
      immatricule,
      cin,
      telephone,
      specialite,
      secteur,
      option,
      matiere,
      grade,
      experience,
      pochette,
      nbcopie,
    } = formData;

    if (!cin) {
      setOpenVerify(true);
      setLoading(false);
    }

    // Vérification si le CIN existe déjà
    const currentSession = new Date().getFullYear(); // Utilisation de l'année actuelle
    const checkResponse = await axios.get(
      `${API_VACATION.verifierPocheteVacation}/${currentSession}/${pochette}`,
    );

    try {
      if (checkResponse.data.exists) {
        setOpenVerifyVac(true); // Afficher le dialogue ou message d'erreur
        setLoading(false);
      } else {
        const response = await axios.post(
          // 'http://localhost:3000/api/vacation/ajout',
          API_VACATION.ajoutVacation,
          {
            idCorrecteur,
            immatricule,
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
            pochette,
            nbcopie,
          },
        );

        console.log('Vacation ajouté avec succès', response.data);
        // Traitez le succès ici, par exemple afficher un message ou rediriger

        // setOpen(true);
        toast.success('Sauvegarde avec succès.');
        setTimeout(() => {
          navigate('/présidence-service-finance/vacation'); // Naviguer après un délai
        }, 500); // Délai de 2 secondes avant de naviguer
      }
    } catch (err: any) {
      if (err.response) {
        console.log(err);
      } else {
        console.log(err);
      }
      toast.error(`Erreur lors d'ajout vacation du correcteur!`);
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
              <div className="mb-4.5 flex gap-6 items-center">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Immatricule ou C.I.N
                    <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text" 
                    placeholder="Entrer l'immatricule ou CIN"
                    value={cin || immatricule || ''}
                    onChange={handleChange1}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={fetchCorrecteurById}
                  className="flex items-center justify-center rounded bg-blue-500 py-3 px-6 mt-7 font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                  disabled={!immatricule || !cin || loading}
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
                        Cette vacation existe déjà! Veuillez verifer vos source.
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
                        Verification Correcteur
                      </DialogTitle>
                      <p className="mt-2 text-sm text-gray-500">
                        Le C.I.N ou immatricule n'appartient pas à nos correcteurs inscrit!
                        Veuillez verifier vos données.
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
                      htmlFor="immatricule"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      Numéro immatricule
                      <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="immatricule"
                      id="immatricule"
                      placeholder="..."
                      value={formData.immatricule}
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
                {/* Ligne pour spécialité et grade */}
                <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                  <div className="w-full xl:w-1/2">
                    <label
                      htmlFor="specialite"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      Baccalauréat d'enseignement{' '}
                      <span className="text-meta-1">*</span>
                    </label>
                    <select
                      name="specialite"
                      id="specialite"
                      value={formData.specialite}
                      onChange={handleChange}
                      required
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Sélectionnez un enseignement</option>
                      {specialites && specialites.length > 0 ? (
                        specialites.map((specialite, index) => (
                          <option key={index} value={specialite}>
                            {specialite}
                          </option>
                        ))
                      ) : (
                        <option disabled>Chargement...</option>
                      )}
                    </select>
                    {/* Afficher la spécialité sélectionnée */}
                    {formData.specialite && (
                      <p className="mt-2 text-black dark:text-white">
                        Spécialité sélectionnée :{' '}
                        <strong>{formData.specialite}</strong>
                      </p>
                    )}
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label
                      htmlFor="secteur"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      Secteur <span className="text-meta-1">*</span>
                    </label>
                    <select
                      name="secteur"
                      id="secteur"
                      value={formData.secteur}
                      onChange={handleChange}
                      required
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Sélectionnez un secteur</option>
                      {secteurs && secteurs.length > 0 ? (
                        secteurs.map((secteur, index) => (
                          <option key={index} value={secteur}>
                            {secteur}
                          </option>
                        ))
                      ) : (
                        <option disabled>
                          Veuillez sélectionner une spécialité d'abord
                        </option>
                      )}
                    </select>
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
                    <select
                      name="option"
                      id="option"
                      value={formData.option}
                      onChange={handleChange}
                      required
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Sélectionnez une option</option>
                      {options && options.length > 0 ? (
                        options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))
                      ) : (
                        <option disabled>
                          Veuillez sélectionner un secteur d'abord
                        </option>
                      )}
                    </select>
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label
                      htmlFor="matiere"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      Matière <span className="text-meta-1">*</span>
                    </label>
                    <select
                      name="matiere"
                      id="matiere"
                      value={formData.matiere}
                      onChange={handleChange}
                      required
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <option value="">
                        Sélectionnez une matière
                        {formData.option && (
                          <p className="mt-2 text-black dark:text-white">
                            selon l'option selectionné :{' '}
                            <strong>{formData.option}</strong>
                          </p>
                        )}
                      </option>
                      {matieres && matieres.length > 0 ? (
                        matieres.map((matiere, index) => (
                          <option key={index} value={matiere}>
                            {matiere}
                          </option>
                        ))
                      ) : (
                        <option disabled>
                          Veuillez sélectionner une option d'abord
                        </option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                  <div className="w-full xl:w-1/2">
                    <label
                      htmlFor="pochette"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      Pochette <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="pochette"
                      id="pochette"
                      placeholder="Entrer le code pochette"
                      value={formData.pochette}
                      onChange={handleChange}
                      required
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
                      placeholder="Entrez le nombre des copies corrigés "
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
                                         border-primary bg-transparent text-black transition hover:bg-transparent
                                         hover:border-primary hover:text-primary dark:border-strokedark 
                                          dark:bg-transparent dark:text-white dark:hover:border-primary dark:hover:text-primary"
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
