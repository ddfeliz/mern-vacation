import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import { Dialog } from '@headlessui/react';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  DocumentCurrencyDollarIcon,
  StopCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Vacation } from '../../../../types/vacation';
import { Tarif } from '../../../../types/tarif';
import API_TARIF from '../../../../api/tarif';
import API_VACATION from '../../../../api/vacation';
import API_PAIEMENT from '../../../../api/paiement';
import { toast } from 'react-toastify';

const DetailVacation = () => {
  const [formData, setFormData] = useState({
    idVacation: '',
    idCorrecteur: '',
    immatricule: '',
    firstName: '',
    lastName: '',
    cin: '',
    pochette: '',
    specialite: '',
    secteur: '',
    option: '',
    matiere: '',
    nbcopie: '',
    optionTarif: '',
    montantTotal: '',
  });
  const { immatricule } = useParams<{ immatricule: string }>();
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [vacationsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false); // État pour le Dialog

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  const [openVerify, setOpenVerify] = useState(false);
  const [openVerifyPayment, setOpenVerifyPayment] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [montantTotal, setMontantTotal] = useState<number | null>(null);
  const [optionTarifChoisi, setOptionTarifChoisi] = useState<string | null>(
    null,
  ); // Nouvel état pour afficher l'option tarif choisi

  const navigate = useNavigate();

  // Fetch all tariffs on component mount
  useEffect(() => {
    const fetchTarifs = async () => {
      try {
        const tarifResponse = await axios.get(
          API_TARIF.listesTarif
        );
        setTarifs(tarifResponse.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des tarifs : ', err);
      }
    };

    fetchTarifs();
  }, []);

  const handleRetour = () => {
    navigate('/présidence-service-finance/vacation');
  };

  const handleView = () => {
    navigate('/présidence-service-finance/nouveau-vacation');
  };

  const handleDeleting = () => {
    setOpen(true);
  };

  const cancelDelete = () => {
    setOpen(false);
  };

  // Fonction pour supprimer un correcteur
  const confirmDelete = async (idVacation: string) => {
    try {
      await axios.delete(`${API_VACATION.supprimerVacation}/${idVacation}`);
      setVacations(
        vacations.filter((vacation) => vacation.idVacation !== idVacation),
      );
      toast.success('Suppression avec succès.')
      setTimeout(() => {
        navigate('/présidence-service-finance/vacation'); // Naviguer après un délai
      }, 3000); // Délai de 2 secondes avant de naviguer
    } catch (err) {
      toast.error('Erreur lors de la suppression du correcteur.');
    }
  };

  useEffect(() => {
    const fetchVacation = async () => {
      try {
        // Inclure idCorrecteur dans l'URL de la requête
        const response = await axios.get<Vacation[]>(
          // `http://localhost:3000/api/vacation/correcteur/${immatricule}`,
          `${API_VACATION.avoirIdVacation}/${immatricule}`,
        );
        setVacations(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des détails du correcteur');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacation();
  }, [immatricule]);

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(vacations.length / vacationsPerPage);
  const indexOfLastVacation = currentPage * vacationsPerPage;
  const indexOfFirstVacation = indexOfLastVacation - vacationsPerPage;
  const currentVacations = vacations.slice(
    indexOfFirstVacation,
    indexOfLastVacation,
  );

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Fonction pour ouvrir le modal et récupérer les données de vacation
  const handleOpenModal = async (idVacation: string) => {
    // Typage du paramètre idVacation
    try {
      // Appel API pour récupérer les données de la vacation
      const response = await axios.get(
        // `http://localhost:3000/api/vacation/${idVacation}`,
        `${API_VACATION.avoirIMVacation}/${idVacation}`,
      );
      const fetchedData = response.data;
      setIsModalOpen(true);

      setMontantTotal(null); // Réinitialiser le montant total
      setOptionTarifChoisi(null); // Réinitialiser l'option tarif choisi

      // Remplir le formulaire avec les valeurs récupérées
      setFormData({
        idVacation: fetchedData.idVacation || '',
        idCorrecteur: fetchedData.idCorrecteur || '',
        immatricule: fetchedData.immatricule || '',
        firstName: fetchedData.nom || '',
        lastName: fetchedData.prenom || '',
        cin: fetchedData.cin || '',
        specialite: fetchedData.specialite || '',
        secteur: fetchedData.secteur || '',
        option: fetchedData.option || '',
        matiere: fetchedData.matiere || '',
        pochette: fetchedData.pochette || '',
        nbcopie: fetchedData.nbcopie ? fetchedData.nbcopie.toString() : '',
        optionTarif: optionTarifChoisi || '',
        montantTotal: montantTotal?.toString() || '',
      });
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des données de vacation',
        error,
      );
    }
  };

  const calculatePayement = () => {
    if (!formData.nbcopie) {
      // setOpenVerify(true);
      return;
    } else {
      let montant = 0;
      let optionTarif = '';

      if (Number(formData.nbcopie) < 50) {
        const tarifForfetaire = tarifs.find(
          (tarif) => tarif.optionTarif === 'Par forfaitaire',
        );
        montant = tarifForfetaire ? tarifForfetaire.MontantTarif : 0;
        optionTarif = 'Par forfaitaire';
      } else {
        const tarifParNombre = tarifs.find(
          (tarif) => tarif.optionTarif === 'Par nombre du copie',
        );
        montant = tarifParNombre
          ? tarifParNombre.MontantTarif * Number(formData.nbcopie)
          : 0;
        optionTarif = 'Par nombre du copie';
      }

      setMontantTotal(montant);
      setOptionTarifChoisi(optionTarif); // Met à jour l'option tarif choisi
      setFormData({
        ...formData,
        optionTarif,
        montantTotal: montant.toString(),
      });
    }
  };

  // Fonction pour fermer le modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Si le champ modifié est nbcopie, recalculer le montant total
    if (name === 'nbcopie') {
      calculatePayement(); // Passer la nouvelle valeur pour le calcul
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true); // Démarrer le chargement

    // Préparez les données à envoyer
    const {
      idVacation,
      idCorrecteur,
      immatricule,
      firstName,
      lastName,
      cin,
      specialite,
      secteur,
      option,
      matiere,
      pochette,
      nbcopie,
      optionTarif,
      montantTotal,
    } = formData;

    if (!montantTotal || !optionTarif) {
      console.log('Condition manquante pour montantTotal ou idVacation');
      setOpenVerify(true);
    }

    try {
      console.log('Data sent to server:', formData); // Vérifier ce qui est envoyé
      const response = await axios.post(
        // 'http://localhost:3000/api/paiement/ajoute',
        API_PAIEMENT.ajoutPaiement,
        {
          idVacation,
          idCorrecteur,
          immatricule,
          nom: lastName,
          prenom: firstName,
          cin,
          specialite,
          secteur,
          option,
          matiere,
          pochette,
          nbcopie,
          optionTarif,
          montantTotal,
        },
      );

      console.log('Paiement ajouté avec succès', response.data);
      // Traitez le succès ici, par exemple afficher un message ou rediriger

      setOpenSuccess(true); // Afficher le message de succès
      // setTimeout(() => {
      //   navigate('/présidence-service-finance/paiement-liste'); // Naviguer après un délai
      // }, 3000); // Délai de 2 secondes avant de naviguer
    } catch (err: any) {
      if (err.response) {
        setError(
          err.response.data.message ||
            'Authentication failed. Please try again.',
        );
        setOpenVerifyPayment(true);
      } else {
        setError('An error occurred. Please try again.');
      }

      console.log(error);
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

  // Affichage d'un loader pendant le chargement
  if (loading)
    return (
      <p className="flex h-screen items-center justify-center text-black dark:text-white">
        Chargement de detail des vacations du correcteur...
      </p>
    );

  return (
    <>
      <Breadcrumb pageName="Detail du vacation" />

      <div className="grid grid-cols-1 gap-9">
        <div className="max-w-full overflow-x-auto rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="vacation-info mb-4">
            <div className="flex justify-center space-x-12">
              <div className="info-item">
                <h5 className="font-medium text-black dark:text-white">
                  ID Correcteur: {currentVacations[0]?.idCorrecteur}
                </h5>
              </div>
              <div className="info-item">
                <h5 className="font-medium text-black dark:text-white">
                  N° immatricule: {currentVacations[0]?.immatricule}
                </h5>
              </div>
              <div className="info-item">
                <h5 className="font-medium text-black dark:text-white">
                  Nom complet: {currentVacations[0]?.nom}{' '}
                  {currentVacations[0]?.prenom}
                </h5>
              </div>
              <div className="info-item">
                <h5 className="font-medium text-black dark:text-white">
                  CIN: {currentVacations[0]?.cin}
                </h5>
              </div>
            </div>
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray text-left dark:bg-meta-4">
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
                  Nombre du copie corrigée
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
              {currentVacations.length > 0 ? (
                currentVacations.map((vacation) => (
                  <tr key={vacation.idVacation}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {vacation.idVacation}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {vacation.specialite}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {vacation.secteur}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {vacation.option}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {vacation.matiere}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {vacation.nbcopie}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {vacation.session}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center justify-center space-x-3.5">
                        <Link to="#" className="hover:text-primary">
                          <DocumentCurrencyDollarIcon
                            className="h-auto w-5 text-success"
                            onClick={() => handleOpenModal(vacation.idVacation)}
                          />
                        </Link>
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
                                        {vacation.idVacation} ?
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 mb-4 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() =>
                                    confirmDelete(vacation.idVacation)
                                  }
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

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg w-2/3 max-h-[90vh] overflow-auto shadow-lg dark:bg-meta-4">
                <h2 className="font-semibold mb-4 text-center text-title-lg">
                  Créer un paiement pour un vacation
                </h2>

                {/* Dialog de vérification */}
                <Dialog
                  open={openVerify || openVerifyPayment || openSuccess}
                  onClose={() => {
                    setOpenVerify(false);
                    setOpenVerifyPayment(false);
                    setOpenSuccess(false);
                  }}
                  className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-50"></div>
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="relative mx-auto w-full max-w-md rounded-lg bg-white shadow-lg p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {openVerify ? (
                            <StopCircleIcon className="h-12 w-12 text-danger" />
                          ) : openVerifyPayment ? (
                            <CheckCircleIcon className="h-12 w-12 text-warning" />
                          ) : (
                            <CheckCircleIcon className="h-12 w-12 text-success" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-medium text-danger">
                            {openVerify
                              ? 'Des erreurs sont survenues'
                              : openVerifyPayment
                              ? 'Vérification du paiement'
                              : 'Succès!'}
                          </h3>
                          <p className="mt-2 text-sm text-gray-500">
                            {openVerify
                              ? 'Veuillez compléter les champs manquants !'
                              : openVerifyPayment
                              ? 'Ce paiement existe déjà ! Veuillez vérifier vos sources.'
                              : `Le paiement s'est deroulé avec succès`}
                          </p>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="mt-8 mr-3 ml-3 inline-flex h-11 items-center justify-center rounded-md border
                   border-secondary bg-transparent text-black transition hover:bg-transparent
                   hover:border-secondary hover:text-secondary dark:border-strokedark 
                   dark:bg-transparent dark:text-secondary dark:hover:border-secondary dark:hover:text-secondary"
                              style={{ width: '100px' }} // Ajustez la largeur selon vos besoins
                              onClick={() => {
                                setOpenVerify(false);
                                setOpenVerifyPayment(false);
                                setOpenSuccess(false);
                              }}
                            >
                              Fermer
                            </button>
                            {openSuccess && (
                              <button
                                type="button"
                                className="mt-8 mr-3 ml-3 inline-flex h-11 items-center justify-center rounded-md border
                   border-success bg-transparent text-black transition hover:bg-transparent
                   hover:border-success hover:text-success dark:border-strokedark 
                   dark:bg-transparent dark:text-success dark:hover:border-success dark:hover:text-success"
                                style={{ width: '100px' }}
                                onClick={() => {
                                  setOpenSuccess(false);
                                  navigate('/présidence-service-finance/paiement-liste');
                                }} // Ferme uniquement openSuccess
                              >
                                OK
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                    <div className="w-full xl:w-1/3">
                      <label
                        htmlFor="idVacation"
                        className="mb-2.5 block text-black dark:text-white"
                      >
                        ID vacation <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="idVacation"
                        id="idVacation"
                        placeholder="..."
                        value={formData.idVacation}
                        onChange={handleChange}
                        required
                        disabled
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    <div className="w-full xl:w-1/3">
                      <label
                        htmlFor="idCorrecteur"
                        className="mb-2.5 block text-black dark:text-white"
                      >
                        ID du Correcteur <span className="text-meta-1">*</span>
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
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    <div className="w-full xl:w-1/3">
                      <label
                        htmlFor="immatricule"
                        className="mb-2.5 block text-black dark:text-white"
                      >
                        N° immaticule <span className="text-meta-1">*</span>
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
                  </div>

                  <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
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
                  </div>

                  <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
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
                    <div className="w-full xl:w-1/2">
                      <label
                        htmlFor="pochette"
                        className="mb-2.5 block text-black dark:text-white"
                      >
                        Code pochette <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="pochette"
                        id="pochette"
                        placeholder="..."
                        value={formData.pochette}
                        onChange={handleChange}
                        required
                        disabled
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                        placeholder="..."
                        value={formData.nbcopie}
                        onChange={handleChange}
                        required
                        disabled
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="mb-2 mt-2 border-b border-stroke py-2 px-6.5 dark:border-strokedark">
                    <div className="mb-4.5 flex flex-col xl:flex-row gap-6 justify-center">
                      <div className="w-full xl:w-1/2 text-center">
                        <label className="mb-2.5 block text-black dark:text-white">
                          <span className="text-meta-1">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={calculatePayement}
                          className="mb-2.5 bg-primary text-white py-3 px-5 rounded hover:bg-opacity-90"
                        >
                          Cliquez ici pour obtenir le montant du vacation
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4.5 mt-4.5 flex flex-col xl:flex-row gap-6">
                    <div className="w-full xl:w-1/2">
                      <label
                        htmlFor="optionTarif"
                        className="mb-2.5 block text-black dark:text-white"
                      >
                        Option du tarif <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="optionTarif"
                        id="optionTarif"
                        placeholder="..."
                        value={formData.optionTarif}
                        onChange={handleChange}
                        required
                        disabled
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label
                        htmlFor="montantTotal"
                        className="mb-2.5 block text-black dark:text-white"
                      >
                        Montant total (en Ar){' '}
                        <span className="text-meta-1">*</span>
                      </label>
                      <input
                        type="number"
                        name="montantTotal"
                        id="montantTotal"
                        placeholder="..."
                        value={formData.montantTotal}
                        onChange={handleChange}
                        required
                        disabled
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center space-x-3 mt-6">
                    <button
                      type="button"
                      className="mr-3 ml-3 inline-flex h-11 items-center justify-center rounded-md border
                                         border-secondary bg-transparent text-black transition hover:bg-transparent
                                         hover:border-secondary hover:text-secondary dark:border-strokedark 
                                          dark:bg-transparent dark:text-secondary dark:hover:border-secondary dark:hover:text-secondary"
                      style={{ width: '180px' }} // Ajustez la largeur selon vos besoins
                      onClick={handleCloseModal}
                    >
                      Fermer
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`mr-3 inline-flex w-40 h-11 items-center justify-center rounded-md border
                                             border-primary bg-transparent text-black transition hover:bg-transparent
                                             hover:border-primary hover:text-primary dark:border-strokedark 
                                              dark:bg-transparent dark:text-primary dark:hover:border-primary dark:hover:text-primary ${
                                                loading
                                                  ? 'cursor-not-allowed opacity-50'
                                                  : ''
                                              }`}
                    >
                      {loading ? 'Chargement...' : 'Créer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Pagination */}
      <div className="flex justify-center space-x-2 mt-4">
        <button
          className={`py-2 px-4 rounded ${
            currentPage === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-primary text-white'
          }`}
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <button
          className={`py-2 px-4 rounded ${
            currentPage === totalPages
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
          Nouveau vacation
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

export default DetailVacation;
