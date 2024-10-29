import { Link } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Correcteur } from '../../../types/correcteur';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import {
  CheckCircleIcon,
  EyeIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/outline';
import CardDataStats from '../../../components/CardDataStats';
import { BsSearch } from 'react-icons/bs';

const ShowCorrecteur = () => {
  const [formData, setFormData] = useState({
    specialite: '',
    secteur: '',
    option: '',
    matiere: '',
  });

  const [correcteurs, setCorrecteurs] = useState<Correcteur[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [open, setOpen] = useState(false); // État pour le Dialog
  const [open2, setOpen2] = useState(false); // État pour le Dialog
  const [currentPage, setCurrentPage] = useState(1);
  const [correcteursPerPage] = useState(5); // Modifier cette valeur pour ajuster le nombre de correcteurs par page

  const [specialites, setSpecialites] = useState<string[]>([]); // État pour stocker les spécialités
  const [secteurs, setSecteurs] = useState<string[]>([]); // État pour stocker les secteurs
  const [options, setOptions] = useState<string[]>([]); // État pour stocker les options
  const [matieres, setMatieres] = useState<string[]>([]); // État pour stocker les matières
  // État pour les filtres de recherche
  const [searchItem, setSearchItem] = useState('');

  const [searchSpecialite, setSearchSpecialite] = useState('');
  const [searchSecteur, setSearchSecteur] = useState('');
  const [searchOption, setSearchOption] = useState('');
  const [searchMatiere, setSearchMatiere] = useState('');
  const [totalCorrecteurs, setTotalCorrecteurs] = useState('0');
  const [actifs, setActifs] = useState(0);
  const [nonActifs, setNonActifs] = useState(0);

  // Fonction pour mettre à jour le statut des correcteurs
  const updateCorrecteurStatus = async (session: number) => {
    try {
      // Envoie une requête PUT pour mettre à jour les statuts des correcteurs
      await axios.put('http://localhost:3000/api/correcteur/updateStatus', {
        session: session,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statuts:', error);
    }
  };

  const fetchCorrecteurs = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/api/correcteur/all',
      );
      setCorrecteurs(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (session: number) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/correcteur/comptage',
        {
          session: session,
        },
      );
      setActifs(response.data.actifs);
      setNonActifs(response.data.nonActifs);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Met à jour les statuts puis récupère les correcteurs
    const updateAndFetchCorrecteurs = async () => {
      const dateCurent = new Date().getFullYear();
      await updateCorrecteurStatus(dateCurent); // Mise à jour des statuts
      fetchStats(dateCurent); // Remplace par l'année souhaitée
      fetchCorrecteurs(); // Récupère les correcteurs après la mise à jour
    };

    updateAndFetchCorrecteurs();
  }, []); // Le tableau vide [] signifie que cela se déclenche une fois au chargement

  useEffect(() => {
    const fetchCorrecteursCount = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/correcteur/count',
        );
        setTotalCorrecteurs(response.data.totalCorrecteurs.toString());
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCorrecteursCount();
  }, []);

  // Récupérer les spécialités depuis le backend au montage du composant
  useEffect(() => {
    console.log('Fetching specialites...');
    const fetchSpecialites = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/matiere-bacc/specialiste',
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
        `http://localhost:3000/api/matiere-bacc/secteurs?specialite=${specialite}`,
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
        `http://localhost:3000/api/matiere-bacc/options?secteur=${secteur}`,
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
        `http://localhost:3000/api/matiere-bacc/matieres?option=${option}`,
      );
      setMatieres(response.data.matieres); // Mettre à jour les matières
    } catch (err) {
      console.error('Erreur lors de la récupération des matières :', err);
    }
  };

  const getGradeStyles = (grade: string) => {
    switch (grade) {
      case 'Expert':
        return 'bg-primary text-success';
      case 'Senior':
        return 'bg-success text-primary';
      case 'Intermédiaire':
        return 'bg-warning text-warning';
      case 'Junior':
        return 'bg-danger text-danger';
      default:
        return 'bg-danger text-danger'; // Couleur par défaut si le grade n'est pas reconnu
    }
  };

  // Filtrage des correcteurs en fonction des critères de recherche
  const filteredCorrecteurs = correcteurs.filter((correcteur) => {
    return (
      correcteur.nom.toLowerCase().includes(searchItem.toLowerCase()) ||
      correcteur.prenom.toLowerCase().includes(searchItem.toLowerCase()) ||
      (correcteur.idCorrecteur
        .toLowerCase()
        .includes(searchItem.toLowerCase()) &&
        correcteur.specialite
          .toLowerCase()
          .includes(searchSpecialite.toLowerCase()) &&
        correcteur.secteur
          .toLowerCase()
          .includes(searchSecteur.toLowerCase()) &&
        correcteur.option.toLowerCase().includes(searchOption.toLowerCase()) &&
        correcteur.matiere.toLowerCase().includes(searchMatiere.toLowerCase()))
    );
  });

  // Pagination
  const indexOfLastCorrecteur = currentPage * correcteursPerPage;
  const indexOfFirstCorrecteur = indexOfLastCorrecteur - correcteursPerPage;
  const currentCorrecteurs = filteredCorrecteurs.slice(
    indexOfFirstCorrecteur,
    indexOfLastCorrecteur,
  );

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <p className="flex h-screen items-center justify-center text-black dark:text-white">
        Chargement des correcteurs...
      </p>
    );

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredCorrecteurs.length / correcteursPerPage);

  const handleDeleting = () => {
    setOpen(true);
    setDropdownOpen(false);
  };

  const cancelDelete = () => {
    setOpen(false);
  };

  // Fonction pour supprimer un correcteur
  const confirmDelete = async (idCorrecteur: string) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/correcteur/${idCorrecteur}`,
      );
      setCorrecteurs(
        correcteurs.filter(
          (correcteur) => correcteur.idCorrecteur !== idCorrecteur,
        ),
      );
      setOpen2(true); // Afficher le message de succès
    } catch (err) {
      alert('Erreur lors de la suppression du correcteur.');
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
      <Breadcrumb pageName="Correcteurs" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-4">
        <CardDataStats
          title="Totale des correcteurs"
          titleColor="#007BFF"
          total={totalCorrecteurs}
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Totale des correcteurs actifs"
          titleColor="#228B22"
          total={actifs.toString()}
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Totale des correcteurs non actifs"
          titleColor="#D14B4B"
          total={nonActifs.toString()}
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats>
      </div>

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
                <DialogTitle className="text-xl font-medium text-gray-900">
                  Suppression avec succès
                </DialogTitle>
                <p className="mt-2 text-sm text-gray-500">
                  Le correcteur a été supprimé!
                </p>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-4 flex flex-wrap gap-5 xl:gap-7.5 justify-end">
            <div className="relative w-full xl:w-1/2 focus:text-primary">
              {/* Champ de recherche */}
              <input
                type="text"
                placeholder="Rechercher par nom ou ID du correcteur..."
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 pl-12 pr-5 outline-none
    transition focus:border-primary active:border-primary disabled:cursor-default text-black 
    dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <BsSearch className="absolute left-3 top-1/2 bottom-1/2 focus:text-primary active:text-primary transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none dark:text-gray-200 dark:focus:text-primary" />
            </div>

            <Link
              to="/administrateur/dashboard/nouveau-correcteur"
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
                <tr className="bg-gray-2 text-center dark:bg-meta-4">
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    N° Matricule
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Nom
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Prenom
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    CIN
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Numero Telephone
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                    Adresse
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                    Adresse Professionnelle
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Grade
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                    Bacc specialité
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Secteur
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                    Option
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                    Matière specialisé
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                    Statut
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentCorrecteurs.length > 0 ? (
                  currentCorrecteurs.map((correcteur) => (
                    <tr key={correcteur.idCorrecteur} className="text-center">
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {correcteur.idCorrecteur}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {correcteur.nom}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {correcteur.prenom}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {correcteur.cin}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {correcteur.telephone}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {correcteur.adresse}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {correcteur.adresseProfession}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p
                          className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getGradeStyles(
                            correcteur.grade,
                          )}`}
                        >
                          {correcteur.grade}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {correcteur.specialite}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {correcteur.secteur}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {correcteur.option}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {correcteur.matiere}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {correcteur.statut}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center justify-center space-x-3.5">
                          <Link
                            to={`/administrateur/dashboard/correcteur/${correcteur.idCorrecteur}`}
                            className="hover:text-primary"
                          >
                            <EyeIcon className="h-auto w-5 text-secondary" />
                          </Link>
                          <Link
                            to={`/administrateur/dashboard/modifier-correcteur/${correcteur.idCorrecteur}`}
                            className="hover:text-primary"
                          >
                            <PencilSquareIcon className="h-auto w-5 text-primary" />
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
                              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg dark:bg-black">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 dark:bg-black">
                                  <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 dark:bg-red-600">
                                      <CheckCircleIcon
                                        aria-hidden="true"
                                        className="h-6 w-6 text-red-600 dark:text-red-200"
                                      />
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                      <DialogTitle
                                        as="h3"
                                        className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"
                                      >
                                        Confirmation
                                      </DialogTitle>
                                      <div className="mt-2">
                                        <p className="text-sm text-black dark:text-white">
                                          Voulez-vous vraiment supprimer ce
                                          correcteur dont l'ID est :{' '}
                                          {correcteur.idCorrecteur} ?
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 mb-4 flex justify-end">
                                  <button
                                    onClick={cancelDelete}
                                    className="mr-2 bg-secondary text-black px-4 py-2 rounded dark:bg-secondary dark:text-white"
                                  >
                                    Annuler
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      confirmDelete(correcteur.idCorrecteur)
                                    }
                                    className="mr-2 bg-red-500 text-white px-4 py-2 rounded dark:bg-red-600"
                                  >
                                    Oui, supprimer
                                  </button>
                                </div>
                              </DialogPanel>
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

export default ShowCorrecteur;
