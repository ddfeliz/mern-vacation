import { Link, useNavigate } from 'react-router-dom';
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
  CheckIcon,
  EyeIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/outline';
import { BsCashCoin, BsFilePdfFill, BsSearch } from 'react-icons/bs';
import { Payment } from '../../../../types/Payment';
import CardDataStats from '../../../../components/CardDataStats';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PaymentPdf from './PaymentPdf';

const ShowPaymentVacation = () => {
  const [formData, setFormData] = useState({
    specialite: '',
    secteur: '',
    option: '',
    matiere: '',
  });

  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalCopies, setTotalCopies] = useState('0');
  const [totalMontants, setTotalMontants] = useState('0');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]); // Nouvel état pour les paiements filtrés
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(''); // État pour le statut de paiement
  const [open, setOpen] = useState(false); // État pour le Dialog
  const [open2, setOpen2] = useState(false); // État pour le Dialog
  const [openUpdatePayment, setOpenUpdatePayment] = useState(false); // État pour le Dialog
  const [openArchive, setOpenArchive] = useState(false); // État pour le Dialog
  const [openArchiveSuccess, setOpenArchiveSuccess] = useState(false); // État pour le Dialog
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(5); // Modifier cette valeur pour ajuster le nombre de correcteurs par page

  const [specialites, setSpecialites] = useState<string[]>([]); // État pour stocker les spécialités
  const [secteurs, setSecteurs] = useState<string[]>([]); // État pour stocker les secteurs
  const [options, setOptions] = useState<string[]>([]); // État pour stocker les options
  const [matieres, setMatieres] = useState<string[]>([]); // État pour stocker les matières

  const [searchSpecialite, setSearchSpecialite] = useState('');
  const [searchSecteur, setSearchSecteur] = useState('');
  const [searchOption, setSearchOption] = useState('');
  const [searchMatiere, setSearchMatiere] = useState('');
  const [searchItem, setSearchItem] = useState('');

  const [totalPaid, setTotalPaid] = useState('0');
  const [totalUnpaid, setTotalUnpaid] = useState('0');

  const navigate = useNavigate();

  const fetchTotalCopies = async () => {
    try {
      // Faire la requête GET vers l'endpoint de l'API
      const response = await axios.get(
        'https://gestion-vacation.onrender.com/api/payment/total-copie',
      );

      // Stocker le total des copies dans l'état
      setTotalCopies(response.data.totalCopies.toString());
      setLoading(false); // Fin du chargement
    } catch (err) {
      setLoading(false); // Fin du chargement
    }
  };

  const fetchTotalMontants = async () => {
    try {
      // Faire la requête GET vers l'endpoint de l'API
      const response = await axios.get(
        'https://gestion-vacation.onrender.com/api/payment/total-montant',
      );

      // Formatage du montant total en tant qu'argent en ariary malgache
      const formattedMontantTotal = new Intl.NumberFormat('fr-MG', {
        style: 'currency',
        currency: 'MGA', // Code de la devise pour l'ariary malgache
        minimumFractionDigits: 0, // Pas de décimales pour l'ariary
        maximumFractionDigits: 0,
      }).format(response.data.montantTotal);

      // Stocker le montant total formaté dans l'état
      setTotalMontants(formattedMontantTotal);
      setLoading(false); // Fin du chargement
    } catch (err) {
      setLoading(false); // Fin du chargement
    }
  };

  const fetchTarifs = async () => {
    try {
      const response = await axios.get('https://gestion-vacation.onrender.com/api/payment/all');
      setPayments(response.data);
      setFilteredPayments(response.data); // Initialiser avec tous les paiements

      // Filtrer et calculer le total des paiements "Payé"
      const totalPaidAmount = response.data
        .filter((payment: Payment) => payment.statut === 'Payé')
        .reduce(
          (acc: number, payment: Payment) => acc + payment.montantTotal,
          0,
        );

      // Filtrer et calculer le total des paiements "Non payé"
      const totalUnpaidAmount = response.data
        .filter((payment: Payment) => payment.statut === 'Non payé')
        .reduce(
          (acc: number, payment: Payment) => acc + payment.montantTotal,
          0,
        );

      // Formatage des montants
      setTotalPaid(
        new Intl.NumberFormat('fr-MG', {
          style: 'currency',
          currency: 'MGA',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(totalPaidAmount),
      );
      setTotalUnpaid(
        new Intl.NumberFormat('fr-MG', {
          style: 'currency',
          currency: 'MGA',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(totalUnpaidAmount),
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalCopies();
    fetchTotalMontants();
    fetchTarifs();
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

  // Fonction pour filtrer les paiements par statut et par critères spécifiques
  const combinedFilteredPayments = filteredPayments.filter((payment) => {
    const isNameMatch =
      payment.nom.toLowerCase().includes(searchItem.toLowerCase()) ||
      payment.prenom.toLowerCase().includes(searchItem.toLowerCase()) ||
      payment.idVacation.toLowerCase().includes(searchItem.toLowerCase()) ||
      payment.idCorrecteur.toLowerCase().includes(searchItem.toLowerCase());

    const isCorrecteurMatch =
      payment.specialite
        .toLowerCase()
        .includes(searchSpecialite.toLowerCase()) &&
      payment.secteur.toLowerCase().includes(searchSecteur.toLowerCase()) &&
      payment.option.toLowerCase().includes(searchOption.toLowerCase()) &&
      payment.matiere.toLowerCase().includes(searchMatiere.toLowerCase());

    return isNameMatch && isCorrecteurMatch;
  });

  // Fonction pour filtrer les paiements selon le statut sélectionné
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const status = event.target.value;
    setSelectedStatus(status);
    if (status === '') {
      setFilteredPayments(payments); // Afficher tous les paiements si aucun filtre n'est sélectionné
    } else {
      setFilteredPayments(
        payments.filter((payment) => payment.statut === status),
      );
    }
  };

  // Calculer les indices de début et de fin pour les correcteurs affichés
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentTarifs = combinedFilteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment,
  );

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <p className="flex h-screen items-center justify-center text-black dark:text-white">
        Chargement de tableau des paiements des correcteurs...
      </p>
    );

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(
    combinedFilteredPayments.length / paymentsPerPage,
  );

  const handleDeleting = () => {
    setOpen(true);
  };

  const cancelDelete = () => {
    setOpen(false);
  };

  // Fonction pour ouvrir le modal d'édition avec les données du vacation sélectionné
  const openEditModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setOpenUpdatePayment(true);
  };

  // Fonction pour confirmer la mise à jour
  const updateStatus = async () => {
    if (!selectedPayment) return;

    try {
      const updatedPayment = { ...selectedPayment, statut: 'Payé' };

      // Mise à jour dans le backend
      await axios.put(
        `https://gestion-vacation.onrender.com/api/payment/${selectedPayment.idPayment}`,
        updatedPayment,
      );

      // Mettre à jour le tableau des vacations
      setPayments((prev) =>
        prev.map((pay) =>
          pay.idPayment === selectedPayment.idPayment ? updatedPayment : pay,
        ),
      );

      setOpenUpdatePayment(false); // Fermer le modal
      // setOpenSuccess(true);
      fetchTarifs();
      fetchTotalCopies();
      fetchTotalMontants();
      setTimeout(() => {}, 2000); // Délai de 2 secondes avant de naviguer
    } catch (err) {
      alert('Erreur lors de la mise à jour du nombre de copies.');
    }
  };

  // Fonction pour supprimer un correcteur
  const confirmDelete = async (idPayment: string) => {
    try {
      await axios.delete(`https://gestion-vacation.onrender.com/api/payment/${idPayment}`);
      setPayments(
        payments.filter((payment) => payment.idPayment !== idPayment),
      );
      setOpen2(true); // Afficher le message de succès
      setOpen(false);
      setTimeout(() => {
        navigate('/administrateur/dashboard/nouveau-paiement');
      }, 2000); // Délai de 2 secondes avant de naviguer
    } catch (err) {
      alert('Erreur lors de la suppression du tarif.');
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const currentYear = new Date().getFullYear();
      await axios.post('https://gestion-vacation.onrender.com/api/archive/archive-payments', {
        session: currentYear,
      });
      setOpenArchiveSuccess(true);
      setOpenArchive(false);
      setTimeout(() => {
        navigate('/administrateur/dashboard/nouveau-paiement');
      }, 2000); // Délai de 2 secondes avant de naviguer
    } catch (error) {
      setMessage('Erreur lors de la réinitialisation des paiements.');
      console.log(error);
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
      <Breadcrumb pageName="Paiement des correcteurs" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-4">
        {/* <CardDataStats
          title="Totale des correcteurs"
          titleColor="#007BFF"
          total=""
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
        </CardDataStats> */}
        <CardDataStats
          title="Totale des montants à payer aux correcteurs"
          titleColor="#D14B4B"
          total={totalMontants}
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
          title="Totale des copies à payer aux correcteurs"
          titleColor=""
          total={totalCopies}
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="3"
              width="20"
              height="18"
              rx="2"
              ry="2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M2 6H22M2 12H22M2 18H22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <path
              d="M6 12L10 16L18 8"
              stroke="#A4D65E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Montant payé" titleColor="" total={totalPaid}>
          <svg
            className="fill-success dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="5"
              width="20"
              height="14"
              rx="2"
              ry="2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />

            <path
              d="M12 7C9.5 7 8 8 8 9.5C8 11 10 12 12 12C14 12 15.5 13 15.5 14.5C15.5 16 13.5 17 12 17M12 7V17M12 17V19M8 19H16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 15L10 19L18 11"
              stroke="green"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Montant non payé"
          titleColor=""
          total={totalUnpaid}
        >
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="5"
              width="20"
              height="14"
              rx="2"
              ry="2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />

            <path
              d="M12 7C9.5 7 8 8 8 9.5C8 11 10 12 12 12C14 12 15.5 13 15.5 14.5C15.5 16 13.5 17 12 17M12 7V17M12 17V19M8 19H16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <line x1="4" y1="4" x2="20" y2="20" stroke="red" strokeWidth="2" />
          </svg>
        </CardDataStats>
      </div>

      {/* Modal de Confirmation avec Dialog */}
      <Dialog
        open={openUpdatePayment}
        onClose={() => setOpenUpdatePayment(false)}
        className="relative z-10"
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg dark:bg-gray-800">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 dark:bg-gray-800">
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
                      Confirmation du paiement
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Voulez-vous vraiment effectuer ce paiement?{' '}
                        <span className="text-danger">
                          Cette action est irreversible!
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 mb-4 flex justify-end">
                <button
                  onClick={updateStatus}
                  className="mr-2 bg-blue-500 text-white px-4 py-2 rounded dark:bg-blue-600"
                >
                  Oui
                </button>
                <button
                  onClick={() => setOpenUpdatePayment(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded dark:bg-gray-600 dark:text-gray-200"
                >
                  Annuler
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* Modal de Confirmation Archive avec Dialog */}
      <Dialog
        open={openArchive}
        onClose={() => setOpenArchive(false)}
        className="relative z-10"
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />
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
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"
                    >
                      Confirmation d'archiver les liste paiement
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Voulez-vous vraiment archiver ces listes des paiemet du
                        session {new Date().getFullYear()}?
                        <span className="mx-2 text-danger">
                          Cette action est irreversible!
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 mb-4 flex justify-end">
                <button
                  onClick={handleReset}
                  className="mr-2 bg-red-500 text-white px-4 py-2 rounded dark:bg-red-600"
                  disabled={loading}
                >
                  {loading ? 'archivage en cours...' : 'Oui, archiver'}
                </button>
                <button
                  onClick={() => setOpenArchive(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded dark:bg-gray-600 dark:text-gray-200"
                >
                  Annuler
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={openArchiveSuccess}
        onClose={() => setOpenArchiveSuccess(false)}
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
                  Archivage avec succès
                </DialogTitle>
                <p className="mt-2 text-sm text-gray-500">
                  L' archive du paiement des correcteurs en session{' '}
                  {new Date().getFullYear()} a été effectué !
                </p>
              </div>
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
                <DialogTitle className="text-xl font-medium text-gray-900">
                  Suppression avec succès
                </DialogTitle>
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
          <div className="mb-4 flex flex-wrap gap-5 xl:gap-7.5 justify-center">
            <button
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-danger py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
              onClick={() => setOpenArchive(true)}
            >
              Réinitialiser les paiements
            </button>
            {message && <p>{message}</p>}

            
            <PDFDownloadLink
              document={<PaymentPdf payments={filteredPayments} />}
              fileName="paiements.pdf"
              className="rounded border-[1.5px] border-stroke bg-transparent py-4 px-10 text-black outline-none transition hover:border-primary hover:text-primary focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:hover:border-primary dark:hover:text-primary"
            >
              <span className="flex flex-wrap items-center justify-center">
                <BsFilePdfFill className="w-8 h-5" /> Créer en PDF
              </span>
            </PDFDownloadLink>

            <Link
              to="/administrateur/dashboard/nouveau-paiement"
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <BsCashCoin />
                <PlusIcon />
              </span>
              Nouveau Paiement
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
              {/* Liste déroulante pour filtrer par statut */}
              <select
                id="statusFilter"
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-10 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Filtré par statut</option>
                <option value="Payé">Payé</option>
                <option value="Non payé">Non payé</option>
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
                <tr className="bg-gray-2 text-center dark:bg-meta-4">
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    ID Paiement
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    ID Vacation
                  </th>
                  <th className="min-w-[160px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    ID Correcteur
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Nom Complet
                  </th>
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    CIN
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Spécialité Bacc
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Secteur
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Option
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Matière
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Nombre des copies Corrigées
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Session
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Option du tarif
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Montant totale
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Status du paiement
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTarifs.length > 0 ? (
                  currentTarifs.map((payment) => (
                    <tr key={payment.idPayment}>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {payment.idPayment}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {payment.idVacation}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {payment.idCorrecteur}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {payment.nom} {payment.prenom}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {payment.cin}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {payment.specialite}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {payment.secteur}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {payment.option}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {payment.matiere}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {payment.nbcopie}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {payment.session}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {payment.optionTarif}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {payment.montantTotal} Ar
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {payment.statut}
                        </h5>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center justify-center space-x-3.5">
                          {payment.statut === 'Non payé' && (
                            <button
                              onClick={() => openEditModal(payment)}
                              className="hover:text-primary"
                            >
                              <CheckIcon className="h-auto w-5 text-green-600" />
                            </button>
                          )}
                          <Link
                            to={`/administrateur/dashboard/paiement/${payment.idPayment}`}
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
                              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg dark:bg-gray-800">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 dark:bg-gray-800">
                                  <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 sm:mx-0 sm:h-10 sm:w-10 dark:bg-blue-600">
                                      <QuestionMarkCircleIcon
                                        aria-hidden="true"
                                        className="h-6 w-6 text-white dark:text-gray-200"
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
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                          Voulez-vous vraiment supprimer ce
                                          correcteur <br /> dont l'ID est:{' '}
                                          {payment.idPayment} ?
                                          <span className="mx-2 text-danger">
                                            Cette action est irreversible!
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 mb-4 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      confirmDelete(payment.idPayment)
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

export default ShowPaymentVacation;
