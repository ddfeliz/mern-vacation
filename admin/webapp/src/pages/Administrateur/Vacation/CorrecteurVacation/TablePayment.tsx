import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { EyeIcon } from '@heroicons/react/24/outline';
import { BsCashCoin } from 'react-icons/bs';
import { Payment } from '../../../../types/Payment';

const TablePayment = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]); // Nouvel état pour les paiements filtrés
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(5); // Modifier cette valeur pour ajuster le nombre de correcteurs par page

  const fetchTarifs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/payment/all');
      setPayments(response.data);
      setFilteredPayments(response.data); // Initialiser avec tous les paiements
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTarifs();
  }, []);

  // Calculer les indices de début et de fin pour les correcteurs affichés
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentTarifs = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment,
  );

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(payments.length / paymentsPerPage);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mb-4"></div>
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-2 flex flex-wrap gap-5 xl:gap-7.5 justify-start">
            <Link
              to="/administrateur/dashboard/paiement-liste"
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              <span>
                <BsCashCoin />
              </span>
              Voir les liste du paiement des correcteurs
            </Link>
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
                          <Link
                            to={`/administrateur/dashboard/paiement/${payment.idPayment}`}
                            className="hover:text-primary"
                          >
                            <EyeIcon className="h-auto w-5 text-secondary" />
                          </Link>
                        </div>
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

export default TablePayment;
