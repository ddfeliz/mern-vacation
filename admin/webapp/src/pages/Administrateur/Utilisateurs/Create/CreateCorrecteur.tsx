import { useEffect, useState } from "react";
import Breadcrumb from "../../../../components/Breadcrumbs/Breadcrumb";
import axios from "axios"; // Importer Axios
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { CheckCircleIcon, CheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import PhoneInput, { CountryData } from "react-phone-input-2";

const CreateCorrecteur = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cin: '',
    adresse: '',
    adresseProfession: '',
    telephone: '',
    specialite: '',
    secteur: '',
    option: '',
    matiere: '',
    grade: '',

  });
  const [loading, setLoading] = useState(false); // État pour gérer le chargement

  const [specialites, setSpecialites] = useState<string[]>([]); // État pour stocker les spécialités
  const [secteurs, setSecteurs] = useState<string[]>([]); // État pour stocker les secteurs
  const [options, setOptions] = useState<string[]>([]); // État pour stocker les options
  const [matieres, setMatieres] = useState<string[]>([]); // État pour stocker les matières
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [openCIN, setOpenCIN] = useState(false);
  const [error, setError] = useState('');
  const [prefix, setPrefix] = useState("033"); // Préfixe par défaut
  const [phoneNumber, setPhoneNumber] = useState(formData.telephone.slice(3));
  const navigate = useNavigate();

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

  // Récupérer les spécialités depuis le backend au montage du composant
  useEffect(() => {
    console.log("Fetching specialites...");
    const fetchSpecialites = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/matiere-bacc/specialiste');
        const fetchedSpecialites = response.data.specialites;
        console.log("Specialites fetched:", fetchedSpecialites);
        setSpecialites(fetchedSpecialites); // Mettre à jour les spécialités avec la réponse de l'API
      } catch (err) {
        console.error("Erreur lors de la récupération des spécialités :", err);
      }
    };

    fetchSpecialites();
  }, []);

  // Récupérer les secteurs en fonction de la spécialité sélectionnée
  const fetchSecteurs = async (specialite: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/matiere-bacc/secteurs?specialite=${specialite}`);
      setSecteurs(response.data.secteurs); // Mettre à jour les secteurs
      setFormData((prevData) => ({ ...prevData, secteur: '', matiere: '' })); // Réinitialiser secteur et matière
      setMatieres([]); // Réinitialiser les matières
    } catch (err) {
      console.error("Erreur lors de la récupération des secteurs :", err);
    }
  };

  // Récupérer les options en fonction du secteur sélectionné
  const fetchOption = async (secteur: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/matiere-bacc/options?secteur=${secteur}`);
      setOptions(response.data.options); // Mettre à jour les matières
    } catch (err) {
      console.error("Erreur lors de la récupération des matières :", err);
    }
  };

  // Récupérer les matières en fonction du secteur sélectionné
  const fetchMatieres = async (option: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/matiere-bacc/matieres?option=${option}`);
      setMatieres(response.data.matieres); // Mettre à jour les matières
    } catch (err) {
      console.error("Erreur lors de la récupération des matières :", err);
    }
  };


  // Fonction pour gérer le changement du numéro

  const handlePhoneChange = (e: { target: { value: string; }; }) => {
    // Supprimer tout sauf les chiffres
    const cleanedPhone = e.target.value.replace(/\D/g, '');

    // Limiter à 7 chiffres
    if (cleanedPhone.length <= 7) {
      setPhoneNumber(cleanedPhone);
    }

    // Formater le numéro au format XX XXX XX
    let formattedPhone = cleanedPhone;
    if (cleanedPhone.length <= 2) {
      formattedPhone = cleanedPhone;
    } else if (cleanedPhone.length <= 5) {
      formattedPhone = cleanedPhone.slice(0, 2) + ' ' + cleanedPhone.slice(2);
    } else if (cleanedPhone.length <= 7) {
      formattedPhone = cleanedPhone.slice(0, 2) + ' ' + cleanedPhone.slice(2, 5) + ' ' + cleanedPhone.slice(5);
    }

    // Mettre à jour formData avec le numéro formaté
    setFormData({ ...formData, telephone: prefix + cleanedPhone }); // Conserve les chiffres pour la soumission
    setPhoneNumber(formattedPhone); // Met à jour l'état avec le numéro formaté
  };


  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'specialite') {
      fetchSecteurs(value);
      setFormData((prevData) => ({
        ...prevData,
        secteur: '',
        option: '',
        matiere: ''
      }));
      setOptions([]);
    }

    if (name === 'secteur') {
      fetchOption(value);
      setFormData((prevData) => ({
        ...prevData,
        option: '',
        matiere: ''
      }));
      setMatieres([]);
    }


    if (name === 'option') {
      fetchMatieres(value);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      cin: '',
      adresse: '',
      adresseProfession: '',
      telephone: '',
      specialite: '',
      secteur: '',
      option: '',
      matiere: '',
      grade: '',
    });
  };

  const handleView = () => {
    navigate('/administrateur/dashboard/correcteur');
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true); // Démarrer le chargement

    // Préparez les données à envoyer
    const { firstName, lastName, cin, adresse, adresseProfession, telephone, specialite, secteur, option, matiere, grade } = formData;

    try {


      // Vérification si le CIN existe déjà
      const checkResponse = await axios.get(`http://localhost:3000/api/correcteur/check/${cin}`);
      if (checkResponse.data.exists) {
        setOpenVerify(true);
        setLoading(false);
        return; // Arrêter la soumission
      } else {
        const response = await axios.post('http://localhost:3000/api/correcteur/add', {
          nom: lastName,
          prenom: firstName,
          cin,
          adresse,
          adresseProfession,
          telephone,
          specialite,
          secteur,
          option,
          matiere,
          grade
        });

        console.log('Correcteur ajouté avec succès', response.data);
        // Traitez le succès ici, par exemple afficher un message ou rediriger

        setOpen(true); // Afficher le message de succès
        setTimeout(() => {
          navigate('/administrateur/dashboard/correcteur'); // Naviguer après un délai
        }, 3000); // Délai de 2 secondes avant de naviguer

      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || 'Authentication failed. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

  return (
    <>
      <Breadcrumb pageName="Nouveau Correcteur" />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9 w-full">
          {/* Formulaire de création de correcteur */}
          <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Formulaire
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
                      <DialogTitle className="text-xl font-medium text-gray-900">Ajout avec succès</DialogTitle>
                      <p className="mt-2 text-sm font-medium text-gray-500 dark:text-black">
                        Le correcteur a été enregistré!
                      </p>
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </Dialog>


            <Dialog open={openVerify} onClose={() => setOpenVerify(false)} className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
              {/* Arrière-plan grisé */}
              <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />

              {/* Contenu de la modal */}
              <div className="flex items-center justify-center min-h-screen">
                <DialogPanel className="relative mx-auto w-full max-w-md rounded-lg bg-white shadow-lg p-6">
                  {/* Icône et Message */}
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <CheckIcon className="h-12 w-12 text-warning" aria-hidden="true" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-medium text-warning">Verification de votre CIN</DialogTitle>
                      <p className="mt-2 text-sm text-gray-500 dark:text-black">
                        Le CIN que tu as saisi existe déjà!
                        <br /> Veuillez saisir un autre ou verifiez bien.
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

                {/* Ligne pour l'email et le téléphone */}
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
                      Téléphone (Madagascar) <span className="text-meta-1">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      {/* Liste déroulante pour le préfixe */}
                      <select
                        value={prefix}
                        onChange={(e) => {
                          setPrefix(e.target.value);
                          setFormData({ ...formData, telephone: e.target.value + phoneNumber.replace(/\s/g, '') }); // Mettre à jour formData avec le nouveau préfixe
                        }}
                        className="w-60 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      >
                        <option value="032">Orange: 032</option>
                        <option value="037">Orange: 037</option>
                        <option value="038">Telma: 038</option>
                        <option value="034">Telma: 034</option>
                        <option value="033">Airtel: 033</option>
                      </select>

                      {/* Champ pour les 7 chiffres restants */}
                      <input
                        type="text"
                        value={phoneNumber} // Utilise le numéro formaté
                        onChange={handlePhoneChange}
                        maxLength={9} // Limite à 10 caractères (2 pour le préfixe + 7 pour le numéro)
                        placeholder="Numéro (7 chiffres)"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        required
                      />
                    </div>

                    {/* Afficher le numéro complet */}
                    <p className="mt-2">Numéro complet: {prefix} {phoneNumber}</p>
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

                {/* Ligne pour spécialité et grade */}
                <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                  <div className="w-full xl:w-1/2">
                    <label htmlFor="specialite" className="mb-2.5 block text-black dark:text-white">
                      Baccalauréat d'enseignement <span className="text-meta-1">*</span>
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
                          <option key={index} value={specialite}>{specialite}</option>
                        ))
                      ) : (
                        <option disabled>Chargement...</option>
                      )}
                    </select>
                    {/* Afficher la spécialité sélectionnée */}
                    {formData.specialite && (
                      <p className="mt-2 text-black dark:text-white">
                        Spécialité sélectionnée : <strong>{formData.specialite}</strong>
                      </p>
                    )}
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label htmlFor="secteur" className="mb-2.5 block text-black dark:text-white">
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
                          <option key={index} value={secteur}>{secteur}</option>
                        ))
                      ) : (
                        <option disabled>Veuillez sélectionner une spécialité d'abord</option>
                      )}
                    </select>
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                  <div className="w-full xl:w-1/2">
                    <label htmlFor="option" className="mb-2.5 block text-black dark:text-white">
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
                          <option key={index} value={option}>{option}</option>
                        ))
                      ) : (
                        <option disabled>Veuillez sélectionner un secteur d'abord</option>
                      )}
                    </select>
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label htmlFor="matiere" className="mb-2.5 block text-black dark:text-white">
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
                      <option value="">Sélectionnez une matière{formData.option && (
                        <p className="mt-2 text-black dark:text-white">
                          selon l'option selectionné : <strong>{formData.option}</strong>
                        </p>
                      )}</option>
                      {matieres && matieres.length > 0 ? (
                        matieres.map((matiere, index) => (
                          <option key={index} value={matiere}>{matiere}</option>
                        ))
                      ) : (
                        <option disabled>Veuillez sélectionner une option d'abord</option>
                      )}
                    </select>
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
                    Listes des correcteurs
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
                                              dark:bg-transparent dark:text-white dark:hover:border-primary dark:hover:text-primary ${loading ? "cursor-not-allowed opacity-50" : ""
                      }`}
                  >
                    {loading ? "Chargement..." : "Créer"}
                  </button>
                </div>



              </div>
            </form>
          </div>
        </div >
      </div >
    </>
  );
};

export default CreateCorrecteur;

