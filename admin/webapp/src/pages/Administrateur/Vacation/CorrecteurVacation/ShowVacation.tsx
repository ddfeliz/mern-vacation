import { Link } from 'react-router-dom';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import {
  CheckCircleIcon,
  EyeIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Vacation } from '../../../../types/vacation';
import CardDataStats from '../../../../components/CardDataStats';
import VacationPdf from './VacationPdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { BsFilePdfFill, BsSearch } from 'react-icons/bs';

const ShowVacation: React.FC = () => {
  const [formData, setFormData] = useState({
    specialite: '',
    secteur: '',
    option: '',
    matiere: '',
  });

  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [totalCopies, setTotalCopies] = useState('0');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // État pour le Dialog
  const [open2, setOpen2] = useState(false); // État pour le Dialog
  const [openEdit, setOpenEdit] = useState(false); // État pour le Dialog de mise à jour
  const [openSuccess, setOpenSuccess] = useState(false);
  const [selectedVacation, setSelectedVacation] = useState<Vacation | null>(
    null,
  ); // Vacation sélectionnée pour mise à jour
  const [newNbCopie, setNewNbCopie] = useState(0); // État pour stocker le nouveau nombre de copie
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVacations, setTotalVacations] = useState('0');
  const [vacationsPerPage] = useState(5); // Modifier cette valeur pour ajuster le nombre de vacation par page

  const [specialites, setSpecialites] = useState<string[]>([]); // État pour stocker les spécialités
  const [secteurs, setSecteurs] = useState<string[]>([]); // État pour stocker les secteurs
  const [options, setOptions] = useState<string[]>([]); // État pour stocker les options
  const [matieres, setMatieres] = useState<string[]>([]); // État pour stocker les matières

  const [searchSpecialite, setSearchSpecialite] = useState('');
  const [searchSecteur, setSearchSecteur] = useState('');
  const [searchOption, setSearchOption] = useState('');
  const [searchMatiere, setSearchMatiere] = useState('');
  const [searchItem, setSearchItem] = useState('');

  // Utiliser useEffect pour faire la requête à l'API au chargement du composant

  const fetchTotalCopies = async () => {
    try {
      // Faire la requête GET vers l'endpoint de l'API
      const response = await axios.get(
        'https://gestion-vacation.onrender.com/api/vacation/total-copies',
      );

      // Stocker le total des copies dans l'état
      setTotalCopies(response.data.totalCopies.toString());
      setLoading(false); // Fin du chargement
    } catch (err) {
      setLoading(false); // Fin du chargement
    }
  };

  const fetchVacationCount = async () => {
    try {
      const responseVacation = await axios.get(
        'https://gestion-vacation.onrender.com/api/vacation/count',
      );
      setTotalVacations(responseVacation.data.totalVacation.toString());
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchTotalCopies();
    fetchVacationCount();
  }, []); // Le tableau vide [] signifie que le useEffect se déclenche une seule fois au chargement du composant

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const response = await axios.get(
          'https://gestion-vacation.onrender.com/api/vacation/all',
        );
        setVacations(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVacations();
  }, []);

  // Récupérer les spécialités depuis le backend au montage du composant
  useEffect(() => {
    console.log('Fetching specialites...');
    const fetchSpecialites = async () => {
      try {
        const response = await axios.get(
          'https://gestion-vacation.onrender.com/api/matiere-bacc/specialiste',
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
        `https://gestion-vacation.onrender.com/api/matiere-bacc/secteurs?specialite=${specialite}`,
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
        `https://gestion-vacation.onrender.com/api/matiere-bacc/options?secteur=${secteur}`,
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
        `https://gestion-vacation.onrender.com/api/matiere-bacc/matieres?option=${option}`,
      );
      setMatieres(response.data.matieres); // Mettre à jour les matières
    } catch (err) {
      console.error('Erreur lors de la récupération des matières :', err);
    }
  };

  // Filtrer les vacations par année
  const filteredVacations = vacations.filter((vacation) => {
    const isYearMatch = vacation.session.toString().includes(selectedYear);
    const isNameMatch =
      vacation.nom.toLowerCase().includes(searchItem.toLowerCase()) ||
      vacation.prenom.toLowerCase().includes(searchItem.toLowerCase()) ||
      vacation.idVacation.toLowerCase().includes(searchItem.toLowerCase()) ||
      vacation.idCorrecteur.toLowerCase().includes(searchItem.toLowerCase());

    const isCorrecteurMatch =
      vacation.specialite
        .toLowerCase()
        .includes(searchSpecialite.toLowerCase()) &&
      vacation.secteur.toLowerCase().includes(searchSecteur.toLowerCase()) &&
      vacation.option.toLowerCase().includes(searchOption.toLowerCase()) &&
      vacation.matiere.toLowerCase().includes(searchMatiere.toLowerCase());

    return isYearMatch && isNameMatch && isCorrecteurMatch;
  });

  // Calculer le total des copies pour les vacances filtrées
  const totalCopiesFiltered = filteredVacations.reduce(
    (total, vacation) => total + vacation.nbcopie,
    0,
  );

  // Calculer les indices de début et de fin pour les correcteurs affichés
  const indexOfLastVacation = currentPage * vacationsPerPage;
  const indexOfFirstVacation = indexOfLastVacation - vacationsPerPage;
  const currentVacations = filteredVacations.slice(
    indexOfFirstVacation,
    indexOfLastVacation,
  );

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <p className="flex h-screen items-center justify-center text-black dark:text-white">
        Chargement des vacations...
      </p>
    );

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(vacations.length / vacationsPerPage);

  // Fonction pour ouvrir le modal d'édition avec les données du vacation sélectionné
  const openEditModal = (vacation: Vacation) => {
    setSelectedVacation(vacation);
    setNewNbCopie(0); // Réinitialiser le nombre de copie
    setOpenEdit(true);
  };

  // Fonction pour confirmer la mise à jour
  const handleUpdateNbCopie = async () => {
    if (!selectedVacation) return;

    try {
      const updatedVacation = {
        ...selectedVacation,
        nbcopie: selectedVacation.nbcopie + newNbCopie,
        session: new Date().getFullYear(),
      };

      // Mise à jour dans le backend
      await axios.put(
        `https://gestion-vacation.onrender.com/api/vacation/${selectedVacation.idVacation}`,
        updatedVacation,
      );

      // Mettre à jour le tableau des vacations
      setVacations((prev) =>
        prev.map((vac) =>
          vac.idVacation === selectedVacation.idVacation
            ? updatedVacation
            : vac,
        ),
      );

      setOpenEdit(false); // Fermer le modal
      setOpenSuccess(true);
      fetchTotalCopies();
      setTimeout(() => {}, 2000); // Délai de 2 secondes avant de naviguer
    } catch (err) {
      alert('Erreur lors de la mise à jour du nombre de copies.');
    }
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
      await axios.delete(`https://gestion-vacation.onrender.com/api/vacation/${idVacation}`);
      setVacations(
        vacations.filter((vacation) => vacation.idVacation !== idVacation),
      );
      setOpen2(true); // Afficher le message de succès
    } catch (err) {
      alert('Erreur lors de la suppression du vacation.');
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
      setSearchSpecialite(value);
    }

    if (name === 'secteur') {
      fetchOption(value);
      setFormData((prevData) => ({
        ...prevData,
        option: '',
        matiere: '',
      }));
      setMatieres([]);
      setSearchSecteur(value);
    }

    if (name === 'option') {
      fetchMatieres(value);
      setSearchOption(value);
    }

    if (name === 'matiere') {
      setSearchMatiere(value);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Vacations" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-4">
        <CardDataStats
          title="Total des correcteurs vacataires"
          titleColor="#007BFF"
          total={totalVacations}
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C10.3431 2 9 3.34315 9 5C9 6.65685 10.3431 8 12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2ZM12 10C9.79086 10 8 11.7909 8 14V18C8 18.5523 8.44772 19 9 19H15C15.5523 19 16 18.5523 16 18V14C16 11.7909 14.2091 10 12 10Z"
              fill=""
            />

            <path
              d="M18 8H6C5.44772 8 5 8.44772 5 9V21C5 21.5523 5.44772 22 6 22H18C18.5523 22 19 21.5523 19 21V9C19 8.44772 18.5523 8 18 8ZM7 10H17V12H7V10ZM7 14H14V16H7V14Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Totale des copies selon le recherche spécifié"
          titleColor="#007BFF"
          total={totalCopiesFiltered.toString()}
        >
          <svg
            className="fill-primary dark:fill-white"
            width="30"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 0H7C4.8 0 3 1.8 3 4v16c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4V7l-6-7zM7 2h10l5 5h-5c-1.1 0-2 .9-2 2v12H7V2zm6 14h-4v-2h4v2zm0-4h-4v-2h4v2z"
              fill=""
            />
            <path d="M11 14h2v2h-2z" fill="" />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Totale des copies corrigées"
          titleColor="#007BFF"
          total={totalCopies.toString()}
        >
          <svg
            className="fill-primary dark:fill-white"
            width="30"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 0H7C4.8 0 3 1.8 3 4v16c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4V7l-6-7zM7 2h10l5 5h-5c-1.1 0-2 .9-2 2v12H7V2zm6 14h-4v-2h4v2zm0-4h-4v-2h4v2z"
              fill=""
            />
            <path d="M11 14h2v2h-2z" fill="" />
          </svg>
        </CardDataStats>
      </div>

      {/* Modal de mise à jour du nombre de copies */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      >
        <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="flex items-center justify-center min-h-screen">
          <DialogPanel className="relative mx-auto w-full max-w-md rounded-lg bg-white shadow-lg p-6">
            <DialogTitle className="text-xl font-medium text-gray-900">
              Mettre à jour le nombre de copies
            </DialogTitle>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Ajouter le nombre de copies
              </label>
              <input
                type="number"
                value={newNbCopie}
                onChange={(e) => setNewNbCopie(parseInt(e.target.value))}
                required
                className="mt-1 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpdateNbCopie}
                className={`mr-2 bg-blue-500 text-white px-4 py-2 rounded ${
                  newNbCopie <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={newNbCopie <= 0} // Désactiver le bouton si la valeur est nulle ou négative
              >
                Mise à jour
              </button>
              <button
                onClick={() => setOpenEdit(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Annuler
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog
        open={open2}
        onClose={() => setOpen2(false)}
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
                <DialogTitle className="text-xl font-medium text-success">
                  Suppression avec succès
                </DialogTitle>
                <p className="mt-2 text-sm text-gray-500">
                  Le vacation du correcteur a été supprimé!
                </p>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog
        open={openSuccess}
        onClose={() => setOpenSuccess(false)}
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
                <DialogTitle className="text-xl font-medium text-success">
                  Mise à jour avec succès
                </DialogTitle>
                <p className="mt-2 text-sm text-gray-500">
                  Le nombre des copies du correcteur a été mis à jour!
                </p>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-4 flex flex-wrap gap-5 xl:gap-7.5 justify-end">
            <PDFDownloadLink
              document={<VacationPdf vacations={filteredVacations} />}
              fileName="vacations.pdf"
              className="rounded border-[1.5px] border-stroke bg-transparent py-4 px-10 text-black outline-none transition hover:border-primary hover:text-primary focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:hover:border-primary dark:hover:text-primary"
            >
              <span className="flex flex-wrap items-center justify-center">
                <BsFilePdfFill className="w-8 h-5" /> Créer en PDF
              </span>
            </PDFDownloadLink>

            <Link
              to="/administrateur/dashboard/nouveau-vacation"
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                    fill="currentColor"
                  />
                  <path
                    d="M4 19C4 16.2386 9.58172 14 12 14C14.4183 14 20 16.2386 20 19V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V19Z"
                    fill="currentColor"
                  />
                  <path
                    d="M18 8H20V10H22V12H20V14H18V12H16V10H18V8Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Nouveau
            </Link>
          </div>
          <div className="mb-4 flex flex-wrap gap-5 xl:gap-7.5 justify-center items-center">
            {/* Champ de recherche */}
            <div className="w-full md:w-1/2 xl:w-1/3 relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-12 pr-5 outline-none
        transition focus:border-primary active:border-primary disabled:cursor-default text-black 
        dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none dark:text-gray-200 dark:focus:text-primary" />
            </div>

            {/* Sélecteur de recherche par année */}
            <div className="w-full md:w-1/2 xl:w-1/3">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none 
        transition focus:border-primary active:border-primary disabled:cursor-default 
        disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Filtrer par année...</option>
                <option value={new Date().getFullYear() - 3}>
                  {new Date().getFullYear() - 3}
                </option>
                <option value={new Date().getFullYear() - 2}>
                  {new Date().getFullYear() - 2}
                </option>
                <option value={new Date().getFullYear() - 1}>
                  {new Date().getFullYear() - 1}
                </option>
                <option value={new Date().getFullYear()}>
                  Année Actuelle: {new Date().getFullYear()}
                </option>
                <option value={new Date().getFullYear() + 1}>
                  {new Date().getFullYear() + 1}
                </option>
                <option value={new Date().getFullYear() + 2}>
                  {new Date().getFullYear() + 2}
                </option>
              </select>
            </div>
          </div>

          <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
            <span className="text-secondary text-sm mt-5">Filtré par:</span>
            <div className="w-full xl:w-1/4">
              <label
                htmlFor="specialite"
                className="mb-2.5 block text-black dark:text-white"
              >
                Spécialité <span className="text-meta-1">*</span>
              </label>
              <select
                name="specialite"
                id="specialite"
                value={formData.specialite}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none 
                                transition focus:border-primary active:border-primary disabled:cursor-default 
                                disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Sélectionnez une spécialité</option>
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
            </div>

            <div className="w-full xl:w-1/4">
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
            <div className="w-full xl:w-1/4">
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

            <div className="w-full xl:w-1/4">
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
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray text-left dark:bg-meta-4">
                  <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white">
                    ID Vacation
                  </th>
                  <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white">
                    ID Correcteur
                  </th>
                  <th className="min-w-[300px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Nom complet
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    CIN
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                    Bacc specialité
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Secteur
                  </th>
                  <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white">
                    Option
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                    Matière specialisé
                  </th>
                  <th className="min-w-[160px] py-4 px-4 font-medium text-black dark:text-white">
                    Nombre du copie corrigé
                  </th>
                  <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white">
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
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {vacation.idVacation}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {vacation.idCorrecteur}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {vacation.nom} {vacation.prenom}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {vacation.cin}
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
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {vacation.nbcopie}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {vacation.session}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center justify-center space-x-3.5">
                          <button
                            onClick={() => openEditModal(vacation)}
                            className="hover:text-primary"
                          >
                            <PlusIcon className="h-auto w-5 text-green-600" />
                          </button>
                          <Link
                            to={`/administrateur/dashboard/vacation/${vacation.idVacation}`}
                            className="hover:text-primary"
                          >
                            <EyeIcon className="h-auto w-5 text-secondary" />
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
                                    className="mr-2 bg-blue-500 text-white px-4 py-2 rounded dark:bg-blue-600"
                                  >
                                    Oui
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
      </div>
    </>
  );
};

export default ShowVacation;
