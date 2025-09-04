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
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Archive } from '../../../../types/archive';
import { BsFilePdfFill, BsSearch } from 'react-icons/bs';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ArchivePdf from './ArchivePdf';
import API_ARCHIVE from '../../../../api/archivage';
import API_BACC from '../../../../api/baccalaureat';
import { toast } from 'react-toastify';

const ShowArchivePayment = () => {
  const [formData, setFormData] = useState({
    specialite: '',
    secteur: '',
    option: '',
    matiere: '',
  });

  const [archives, setArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // État pour le Dialog
  const [open2, setOpen2] = useState(false); // État pour le Dialog
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(5); // Modifier cette valeur pour ajuster le nombre de correcteurs par page
  const [selectedYear, setSelectedYear] = useState<string>('');

  const [specialites, setSpecialites] = useState<string[]>([]); // État pour stocker les spécialités
  const [secteurs, setSecteurs] = useState<string[]>([]); // État pour stocker les secteurs
  const [options, setOptions] = useState<string[]>([]); // État pour stocker les options
  const [matieres, setMatieres] = useState<string[]>([]); // État pour stocker les matières

  const [searchSpecialite, setSearchSpecialite] = useState('');
  const [searchSecteur, setSearchSecteur] = useState('');
  const [searchOption, setSearchOption] = useState('');
  const [searchMatiere, setSearchMatiere] = useState('');
  const [searchItem, setSearchItem] = useState('');

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        const response = await axios.get(
          API_ARCHIVE.listesArchive
        );
        setArchives(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArchive();
  }, []);

  // Récupérer les spécialités depuis le backend au montage du composant
  useEffect(() => {
    console.log('Fetching specialites...');
    const fetchSpecialites = async () => {
      try {
        const response = await axios.get(
          API_BACC.specialisteBacc
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

  // Fonction pour filtrer les paiements par statut et par critères spécifiques
  const combinedArchive = archives.filter((archive) => {
    const isYearMatch = archive.session.toString().includes(selectedYear);
    const isNameMatch =
      archive.nom.toLowerCase().includes(searchItem.toLowerCase()) ||
      archive.prenom.toLowerCase().includes(searchItem.toLowerCase()) ||
      archive.idVacation.toLowerCase().includes(searchItem.toLowerCase()) ||
      archive.idCorrecteur.toLowerCase().includes(searchItem.toLowerCase());

    const isCorrecteurMatch =
      archive.specialite
        .toLowerCase()
        .includes(searchSpecialite.toLowerCase()) &&
      archive.secteur.toLowerCase().includes(searchSecteur.toLowerCase()) &&
      archive.option.toLowerCase().includes(searchOption.toLowerCase()) &&
      archive.matiere.toLowerCase().includes(searchMatiere.toLowerCase());

    return isYearMatch && isNameMatch && isCorrecteurMatch;
  });

  // Calculer les indices de début et de fin pour les correcteurs affichés
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentTarifs = combinedArchive.slice(
    indexOfFirstPayment,
    indexOfLastPayment,
  );

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <p className="flex h-screen items-center justify-center text-black dark:text-white">
        Chargement de tableau d'archivage des paiements des correcteurs...
      </p>
    );

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(combinedArchive.length / paymentsPerPage);

  const cancelDelete = () => {
    setOpen(false);
  };

  // Fonction pour supprimer un paiement
  const confirmDelete = async (idPaiement: string) => {
    try {
      // Suppression du paiement par son identifiant MongoDB (_id)
      await axios.delete(`${API_ARCHIVE.supprimerArchive}/${idPaiement}`);

      // Mettre à jour l'état en supprimant le paiement localement de la liste
      setArchives(
        archives.filter((archive) => archive.idPaiement !== idPaiement),
      );

      // setOpen2(true);
      toast.success('Suppression avec succès.')
      setOpen(false);
    } catch (err) {
      toast.error('Erreur lors de la suppression du paiement.');
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
      <Breadcrumb pageName="Paiement des correcteurs archivés" />

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
                  L'archivage des paiments a été supprimé!
                </p>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
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
                <option value={new Date().getFullYear()}>
                  actuel: {new Date().getFullYear()}
                </option>
                <option value={new Date().getFullYear() - 1}>
                  {new Date().getFullYear() - 1}
                </option>
                <option value={new Date().getFullYear() - 2}>
                  {new Date().getFullYear() - 2}
                </option>
                <option value={new Date().getFullYear() - 3}>
                  {new Date().getFullYear() - 3}
                </option>
              </select>
            </div>
            <PDFDownloadLink
              document={<ArchivePdf archives={combinedArchive} />}
              fileName="arhives.pdf"
              className="rounded border-[1.5px] border-primary bg-transparent py-4 px-10 text-black outline-none transition hover:border-primary hover:text-primary focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-primary dark:bg-form-input dark:text-white dark:focus:border-primary dark:hover:border-primary dark:hover:text-primary"
            >
              <span className="flex flex-wrap items-center justify-center">
                <BsFilePdfFill className="w-8 h-5" /> Créer en PDF
              </span>
            </PDFDownloadLink>
          </div>
          <div className="mb-2 flex flex-wrap gap-5 xl:gap-7.5 justify-end">
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
                    <tr key={payment.idPaiement}>
                      <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                          {payment.idPaiement}
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
                          <Link
                            to={`/présidence-service-finance/archivage-detail/${payment.idPaiement}`}
                            className="hover:text-primary"
                          >
                            <EyeIcon className="h-auto w-5 text-secondary" />
                          </Link>
                          <button onClick={() => setOpen(true)}>
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
                                          {payment.idPaiement} ?
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
                                    onClick={cancelDelete}
                                    className="mr-3 ml-3 inline-flex h-11 items-center justify-center rounded-md border
                                                                        border-secondary bg-transparent text-black transition hover:bg-transparent
                                                                        hover:border-secondary hover:text-secondary dark:border-graydark 
                                                                        dark:bg-transparent dark:text-strokedark dark:hover:border-secondary dark:hover:text-secondary"
                                  >
                                    <span className='m-5'>Annuler</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      confirmDelete(payment.idPaiement)
                                    }
                                    className="mr-3 ml-3 inline-flex h-11 items-center justify-center rounded-md border
                                                                        border-danger bg-transparent text-black transition hover:bg-transparent
                                                                        hover:border-danger hover:text-danger dark:border-graydark 
                                                                        dark:bg-transparent dark:text-strokedark dark:hover:border-danger dark:hover:text-danger"
                                  >
                                    <span className='m-5'>Oui, supprimer</span>
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
            className={`py-2 px-4 rounded ${currentPage === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-primary text-white'
              }`}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <button
            className={`py-2 px-4 rounded ${currentPage === totalPages
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

export default ShowArchivePayment;
