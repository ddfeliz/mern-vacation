import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';

const EditTarif = () => {
  const [formData, setFormData] = useState({
    optionTarif: '',
    nombreTarif: '',
    MontantTarif: '',
  });
  const { idTarif } = useParams<{ idTarif: string }>(); // Récupérer l'ID du tarif depuis l'URL
  const [loading, setLoading] = useState(false); // État pour gérer le chargement
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Récupération des informations du tarif à partir de l'API
    const fetchTarif = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://gestion-vacation.onrender.com/api/tarif/${idTarif}`,
        );
        const tarif = response.data;

        setFormData({
          optionTarif: tarif.optionTarif,
          nombreTarif: tarif.nombreTarif,
          MontantTarif: tarif.MontantTarif,
        });
      } catch (err) {
        setError('Erreur lors de la récupération des informations du tarif.');
      } finally {
        setLoading(false);
      }
    };

    fetchTarif();
  }, [idTarif]);

  // Utilisation de useEffect pour afficher l'erreur pendant 5 secondes
  useEffect(() => {
    if (error) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setError(''); // Réinitialiser l'erreur après l'affichage
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRetour = () => {
    navigate('/présidence-service-finance/tarif');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { optionTarif, nombreTarif, MontantTarif } = formData;

    try {
      const response = await axios.put(
        `https://gestion-vacation.onrender.com/api/tarif/${idTarif}`,
        {
          optionTarif,
          nombreTarif,
          MontantTarif,
        },
      );

      console.log('Tarifs mis à jour avec succès', response.data);
      setOpen(true); // Afficher le message de succès
      setTimeout(() => {
        navigate('/présidence-service-finance/tarif'); // Naviguer après un délai
      }, 3000); // Délai de 3 secondes avant de naviguer
    } catch (error) {
      setError('Erreur lors de la mise à jour du tarif.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Modification du tarif" />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9 w-full">
          {/* Formulaire de modification du tarif */}
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
              <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />
              <div className="flex items-center justify-center min-h-screen">
                <DialogPanel className="relative mx-auto w-full max-w-md rounded-lg bg-white shadow-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon
                        className="h-12 w-12 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-medium text-gray-900">
                        Mise à jour réussie
                      </DialogTitle>
                      <p className="mt-2 text-sm text-gray-500">
                        Le tarif a été enregistré!
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
                      Nombre du tarif <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="number"
                      name="nombreTarif"
                      id="nombreTarif"
                      placeholder="Entrez le nombre du tarif désigné"
                      value={formData.nombreTarif}
                      onChange={handleChange}
                      required
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
                      value={formData.MontantTarif}
                      onChange={handleChange}
                      required
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
                    type="submit"
                    className={`mr-3 inline-flex w-60 h-11 items-center justify-center rounded-md border
                                             border-primary bg-transparent text-black transition hover:bg-transparent
                                             hover:border-primary hover:text-primary dark:border-primary 
                                              dark:bg-transparent dark:text-white dark:hover:border-primary dark:hover:text-primary ${
                                                loading
                                                  ? 'cursor-not-allowed opacity-50'
                                                  : ''
                                              }`}
                  >
                    {loading ? (
                      'Mise à jour en cours...'
                    ) : (
                      <PencilSquareIcon className="h-auto w-5 text-primary" />
                    )}
                  </button>
                </div>
              </div>
            </form>

            {visible && error && (
              <div className="p-6 text-red-600">
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTarif;
