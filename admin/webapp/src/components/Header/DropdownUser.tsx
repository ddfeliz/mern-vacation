import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { CheckCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { Utilisateur } from '../../types/utilisateur';
import { useDispatch } from 'react-redux';
import { logout, setAuthenticationStatus } from '../../slices/authSlice';

const DropdownUser = () => {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [open, setOpen] = useState(false); // État pour le Dialog
  const [openUtilisateur, setOpenUtilisateur] = useState(false); // État pour le Dialog
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleLogout = () => {
    setOpen(true);
    setDropdownOpen(false);
  };

  const confirmLogout = () => {
    setOpen(false);
    // Supprimer le token du localStorage
    localStorage.removeItem('token');

    // Réinitialiser l'état de l'authentification dans Redux
    dispatch(logout());
    dispatch(setAuthenticationStatus(false));

    navigate('/', {replace: true}); 
  };

  const cancelLogout = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchUtilisateurProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token JWT manquant');
        }

        const response = await axios.get<Utilisateur>(
          'http://localhost:3000/api/utilisateur/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUtilisateur(response.data); // Ajustez en fonction de la structure de la réponse
      } catch (err: any) {
        setError('Erreur lors de la récupération du profil utilisateur');
        console.error(err);
      }
    };

    fetchUtilisateurProfile();
  }, []);

  if (error) {
    return <div>{error}</div>; // Affiche l'erreur si elle existe
  }

  if (!utilisateur) {
    return null; // Aucun admin n'est trouvé
  }
  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {utilisateur.nom} {utilisateur.prenom}
          </span>
          <span className="block text-xs">{utilisateur.email}</span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <UserCircleIcon className="w-12" />
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <button
                onClick={() => setOpenUtilisateur(true)}
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499ZM11 2.16562C9.28125 2.16562 7.90625 3.50624 7.90625 5.12187C7.90625 6.73749 9.28125 8.07812 11 8.07812C12.7188 8.07812 14.0938 6.73749 14.0938 5.12187C14.0938 3.50624 12.7188 2.16562 11 2.16562Z"
                    fill=""
                  />
                  <path
                    d="M17.7719 21.4156H4.2281C3.5406 21.4156 2.9906 20.8656 2.9906 20.1781V17.0844C2.9906 13.7156 5.7406 10.9656 9.10935 10.9656H12.925C16.2937 10.9656 19.0437 13.7156 19.0437 17.0844V20.1781C19.0094 20.8312 18.4594 21.4156 17.7719 21.4156ZM4.53748 19.8687H17.4969V17.0844C17.4969 14.575 15.4344 12.5125 12.925 12.5125H9.07498C6.5656 12.5125 4.5031 14.575 4.5031 17.0844V19.8687H4.53748Z"
                    fill=""
                  />
                </svg>
                Mon profile
              </button>
            </li>
          </ul>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <svg
              className="fill-current"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.05312 10.3469 5.39687 10.7594 5.39687C11.1719 5.39687 11.55 5.05312 11.55 4.64062V2.23437C11.55 2.16562 11.5844 2.13124 11.6531 2.13124H15.5375C16.3625 2.13124 17.0156 2.78437 17.0156 3.60937V18.3562C17.0156 19.1812 16.3625 19.8344 15.5375 19.8344H11.6531C11.5844 19.8344 11.55 19.8 11.55 19.7312V17.3594C11.55 16.9469 11.2062 16.6031 10.7594 16.6031C10.3125 16.6031 10.0031 16.9469 10.0031 17.3594V19.7312C10.0031 20.625 10.7594 21.3812 11.6531 21.3812H15.5375C17.2219 21.3812 18.5625 20.0062 18.5625 18.3562V3.64374C18.5625 1.95937 17.1875 0.618744 15.5375 0.618744Z"
                fill=""
              />
              <path
                d="M6.05001 11.7563H12.2031C12.6156 11.7563 12.9594 11.4125 12.9594 11C12.9594 10.5875 12.6156 10.2438 12.2031 10.2438H6.08439L8.21564 8.07813C8.52501 7.76875 8.52501 7.2875 8.21564 6.97812C7.90626 6.66875 7.42501 6.66875 7.11564 6.97812L3.67814 10.4844C3.36876 10.7938 3.36876 11.275 3.67814 11.5844L7.11564 15.0906C7.25314 15.2281 7.45939 15.3312 7.66564 15.3312C7.87189 15.3312 8.04376 15.2625 8.21564 15.125C8.52501 14.8156 8.52501 14.3344 8.21564 14.025L6.05001 11.7563Z"
                fill=""
              />
            </svg>
            Déconnexion
          </button>
        </div>
      )}
      {/* <!-- Dropdown End --> */}

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
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Voulez-vous vraiment vous déconnecter ?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 mb-4 flex justify-end">
                <button
                  onClick={confirmLogout}
                  className="mr-2 bg-red-500 text-white px-4 py-2 rounded dark:bg-red-600"
                >
                  Oui, déconnecter
                </button>
                <button
                  onClick={cancelLogout}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded dark:bg-gray-600 dark:text-gray-200"
                >
                  Annuler
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* Modal de detail d'utilisateur */}
      <Dialog
        open={openUtilisateur}
        onClose={() => setOpenUtilisateur(false)}
        className="relative z-10"
      >
        <div
          className="fixed mt-4 inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-gray text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg dark:bg-black">
              <div className="bg-gray px-4 pb-4 pt-5 sm:p-6 sm:pb-4 dark:bg-black">
                <div className="sm:flex sm:items-start">
                  <div className="text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"
                    >
                      Detail de l'Administrateur
                    </DialogTitle>
                    <div className="mt-2">
                          <div className="mb-2 flex flex-col xl:flex-row gap-6">
                            <div className="w-full xl:w-1/2">
                              <label className="mb-2.5 block text-black dark:text-white">
                                ID <span className="text-meta-1">*</span>
                              </label>
                              <input
                                type="text"
                                value={utilisateur.idUtilisateur}
                                disabled
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              />
                            </div>

                            <div className="w-full xl:w-1/2">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Nom <span className="text-meta-1">*</span>
                              </label>
                              <input
                                type="text"
                                value={utilisateur.nom}
                                disabled
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              />
                            </div>
                          </div>
                          <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                            <div className="w-full xl:w-1/2">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Prenom <span className="text-meta-1">*</span>
                              </label>
                              <input
                                type="text"
                                value={utilisateur.prenom}
                                disabled
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              />
                            </div>

                            <div className="w-full xl:w-1/2">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Téléphone<span className="text-meta-1">*</span>
                              </label>
                              <input
                                type="text"
                                value={utilisateur.telephone}
                                disabled
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              />
                            </div>
                          </div>
                          <div className="mb-4.5 flex flex-col xl:flex-row gap-6">
                            <div className="w-full xl:w-1/2">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Adresse <span className="text-meta-1">*</span>
                              </label>
                              <input
                                type="text"
                                value={utilisateur.adresse}
                                disabled
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              />
                            </div>
                            <div className="w-full xl:w-1/2">
                              <label className="mb-2.5 block text-black dark:text-white">
                                Email <span className="text-meta-1">*</span>
                              </label>
                              <input
                                type="text"
                                value={utilisateur.email}
                                disabled
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              />
                            </div>
                          </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 mb-4 mx-6 flex justify-end">
                <button
                  onClick={() => setOpenUtilisateur(false)}
                  className="mr-2 bg-blue-500 text-white px-4 py-2 rounded dark:bg-blue-600"
                >
                  OK
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </ClickOutside>
  );
};

export default DropdownUser;
