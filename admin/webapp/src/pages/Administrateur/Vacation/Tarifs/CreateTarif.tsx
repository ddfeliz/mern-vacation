import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { CheckCircleIcon, CheckIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';

const CreateTarif = () => {
  const [formData, setFormData] = useState({
    optionTarif: '',
    nombreTarif: '',
    MontantTarif: '',
  });
  const [loading, setLoading] = useState(false); // État pour gérer le chargement

  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [error, setError] = useState('');
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

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;

    // Mettre à jour l'état pour l'option sélectionnée
    setFormData({ ...formData, [name]: value });

    // Définir les valeurs de nombreTarif et MontantTarif selon l'option choisie
    if (name === 'optionTarif') {
      if (value === 'Par nombre du copie') {
        setFormData({
          ...formData,
          optionTarif: 'Par nombre du copie',
          nombreTarif: '1',
          MontantTarif: '900',
        });
      } else if (value === 'Par forfaitaire') {
        setFormData({
          ...formData,
          optionTarif: 'Par forfaitaire',
          nombreTarif: '50',
          MontantTarif: '44000',
        });
      } else {
        // Si aucune option n'est sélectionnée, réinitialiser les champs
        setFormData({ ...formData, nombreTarif: '', MontantTarif: '' });
      }
    }
  };

  const handleReset = () => {
    setFormData({
      optionTarif: '',
      nombreTarif: '',
      MontantTarif: '',
    });
  };
  const handleView = () => {
    navigate('/administrateur/dashboard/tarif');
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true); // Démarrer le chargement

    // Préparez les données à envoyer
    const { optionTarif, nombreTarif, MontantTarif } = formData;

    try {
      // Vérifier si le tarif existe déjà
      const responseCheck = await axios.get(
        `https://gestion-vacation.onrender.com/api/tarif/check`,
        {
          params: { optionTarif, nombreTarif, MontantTarif },
        },
      );

      if (responseCheck.data.exists) {
        setOpenVerify(true);
        setLoading(false);
        return; // Ne pas continuer si le tarif existe
      } else {
        const response = await axios.post(
          'https://gestion-vacation.onrender.com/api/tarif/add',
          {
            optionTarif,
            nombreTarif,
            MontantTarif,
          },
        );

        console.log('Correcteur ajouté avec succès', response.data);
        // Traitez le succès ici, par exemple afficher un message ou rediriger

        setOpen(true); // Afficher le message de succès
        setTimeout(() => {
          navigate('/administrateur/dashboard/tarif'); // Naviguer après un délai
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
      <Breadcrumb pageName="Nouveau Tarif" />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9 w-full">
          {/* Formulaire de création de correcteur */}
          <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Formulaire du tarif du vacation
              </h3>
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
                        Le tarif a été enregistré!
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
                      <CheckIcon
                        className="h-12 w-12 text-warning"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-medium text-warning">
                        Verification du Tarif
                      </DialogTitle>
                      <p className="mt-2 text-sm text-gray-500 font-light dark:text-black">
                        Le Tarif que tu as saisi existe déjà!
                        <br /> Veuillez saisir un autre ou verifiez bien.
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
                      htmlFor="optionTarif"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      Option du tarif <span className="text-meta-1">*</span>
                    </label>
                    <select
                      name="optionTarif"
                      id="optionTarif"
                      value={formData.optionTarif}
                      onChange={handleChange}
                      required
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Sélectionnez une option du tarif</option>
                      <option value="Par nombre du copie">
                        Par nombre du copie
                      </option>
                      <option value="Par forfaitaire">Par forfaitaire</option>
                    </select>
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label
                      htmlFor="nombreTarif"
                      className="mb-2.5 block text-black dark:text-white"
                    >
                      Nombre du tarifs <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="number"
                      name="nombreTarif"
                      id="nombreTarif"
                      placeholder="Entrez le nombre du tarif designé"
                      value={formData.nombreTarif}
                      onChange={handleChange}
                      readOnly
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                {/* Ligne pour l'email et le téléphone */}
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
                      placeholder="Entrez le nombre d'années d'expérience"
                      value={formData.MontantTarif}
                      onChange={handleChange}
                      readOnly
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
                    Listes des tarifs
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

export default CreateTarif;
