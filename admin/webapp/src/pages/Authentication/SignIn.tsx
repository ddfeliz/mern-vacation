import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../images/logo/UnivTol-Logo.png';
import Logo from '../../images/logo/UnivTol-Logo.png';
import axios from 'axios';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import DarkModeSwitcher from '../../components/Header/DarkModeSwitcher';
import { useAuth } from '../../contexts/AuthContext';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setPassword] = useState(''); // Changement du nom en 'password'
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true); // Démarrer le chargement

    try {
      const response = await axios.post('http://localhost:3000/api/admin/login', {
        email,
        motDePasse, // Changement ici également
      });

      // Vérifier si le token existe avant de naviguer
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        login();
        setOpen(true); // Afficher le message de succès
        setTimeout(() => {
          navigate('/administrateur/dashboard'); // Naviguer après un délai
        }, 2000); // Délai de 2 secondes avant de naviguer
      }
    } catch (err: any) {
      // Gestion des erreurs
      if (err.response) {
        setError(err.response.data.message || 'Authentication failed. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }finally{
      setLoading(false);
    }

  };
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <Link className="mb-5.5 flex flex-wrap items-center" to="/">
                <img className="hidden border-black rounded-lg dark:block" src={Logo} alt="Logo" />
                <img className="dark:hidden border-black rounded-lg" src={LogoDark} alt="Logo" />
                <h1 className='mx-7 dark:text-white text-xl'> Système de gestion du vacation <br />des correcteurs au baccalauréat </h1>
              </Link>

              <p className="2xl:px-20">
                Des solutions intelligentes pour des paiements efficaces en faveur des correcteurs.
              </p>

              <span className="mt-15 inline-block">
                <svg
                  width="350"
                  height="350"
                  viewBox="0 0 350 350"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M33.5825 294.844L30.5069 282.723C25.0538 280.414 19.4747 278.414 13.7961 276.732L13.4079 282.365L11.8335 276.159C4.79107 274.148 0 273.263 0 273.263C0 273.263 6.46998 297.853 20.0448 316.653L35.8606 319.429L23.5737 321.2C25.2813 323.253 27.1164 325.196 29.0681 327.019C48.8132 345.333 70.8061 353.736 78.1898 345.787C85.5736 337.838 75.5526 316.547 55.8074 298.235C49.6862 292.557 41.9968 288.001 34.2994 284.415L33.5825 294.844Z"
                    fill="#F2F2F2"
                  />
                  <path
                    d="M62.8332 281.679L66.4705 269.714C62.9973 264.921 59.2562 260.327 55.2652 255.954L52.019 260.576L53.8812 254.45C48.8923 249.092 45.2489 245.86 45.2489 245.86C45.2489 245.86 38.0686 270.253 39.9627 293.358L52.0658 303.903L40.6299 299.072C41.0301 301.712 41.596 304.324 42.3243 306.893C49.7535 332.77 64.2336 351.323 74.6663 348.332C85.0989 345.341 87.534 321.939 80.1048 296.063C77.8019 288.041 73.5758 280.169 68.8419 273.123L62.8332 281.679Z"
                    fill="#F2F2F2"
                  />
                  <path
                    d="M263 80H87C82.582 80 78.337 82.907 78.337 85V265C78.337 267.093 82.582 270 87 270H263C267.418 270 271.663 267.093 271.663 265V85C271.663 82.907 267.418 80 263 80ZM263 265H87V85H263V265Z"
                    fill="#E6E6E6"
                  />
                  <path
                    d="M214 42H136C134.343 42 133 43.343 133 45V57H223V45C223 43.343 221.657 42 220 42H214Z"
                    fill="#E6E6E6"
                  />
                  <path
                    d="M173.5 270H164.5C163.12 270 162 269.121 162 267.5V266C162 264.879 163.12 264 164.5 264H173.5C174.88 264 176 264.879 176 266V267.5C176 269.121 174.88 270 173.5 270Z"
                    fill="#CCCCCC"
                  />
                  <path
                    d="M170 238H166C164.895 238 164 237.105 164 236V232C164 230.895 164.895 230 166 230H170C171.105 230 172 230.895 172 232V236C172 237.105 171.105 238 170 238Z"
                    fill="#CCCCCC"
                  />
                  <path
                    d="M250 240H158C156.895 240 156 239.105 156 238V234C156 232.895 156.895 232 158 232H250C251.105 232 252 232.895 252 234V238C252 239.105 251.105 240 250 240Z"
                    fill="#CCCCCC"
                  />
                  <path
                    d="M170 178H166C164.895 178 164 177.105 164 176V172C164 170.895 164.895 170 166 170H170C171.105 170 172 170.895 172 172V176C172 177.105 171.105 178 170 178Z"
                    fill="#CCCCCC"
                  />
                  <path
                    d="M180 178H176C174.895 178 174 177.105 174 176V172C174 170.895 174.895 170 176 170H180C181.105 170 182 170.895 182 172V176C182 177.105 181.105 178 180 178Z"
                    fill="#CCCCCC"
                  />
                  <path
                    d="M170 156H166C164.895 156 164 155.105 164 154V150C164 148.895 164.895 148 166 148H170C171.105 148 172 148.895 172 150V154C172 155.105 171.105 156 170 156Z"
                    fill="#CCCCCC"
                  />
                  <path
                    d="M180 156H176C174.895 156 174 155.105 174 154V150C174 148.895 174.895 148 176 148H180C181.105 148 182 148.895 182 150V154C182 155.105 181.105 156 180 156Z"
                    fill="#CCCCCC"
                  />
                  <path
                    d="M262 320H90C87.239 320 85 322.239 85 325V330C85 332.761 87.239 335 90 335H262C264.761 335 267 332.761 267 330V325C267 322.239 264.761 320 262 320Z"
                    fill="#CCCCCC"
                  />
                  <path
                    d="M243.5 291H107.5C105.01 291 103 293.01 103 295.5C103 298 105.01 300 107.5 300H243.5C246.99 300 249 298 249 295.5C249 293.01 246.99 291 243.5 291Z"
                    fill="#CCCCCC"
                  />
                  <path
                    d="M106.5 312H241.5C244.99 312 247 309.99 247 307.5C247 305.01 244.99 303 241.5 303H106.5C103.01 303 101 305.01 101 307.5C101 309.99 103.01 312 106.5 312Z"
                    fill="#CCCCCC"
                  />

                  <rect x="280" y="70" width="40" height="20" rx="4" fill="#F5F5F5" />
                  <path
                    d="M280 70H320V90H280V70Z"
                    fill="#3CB371"
                  />
                  <text x="315" y="82" font-family="Arial" font-size="10" fill="#F5F5F5" text-anchor="end">Ar</text>
                  <path
                    d="M290 75C292.209 75 294 76.791 294 79C294 81.209 292.209 83 290 83C287.791 83 286 81.209 286 79C286 76.791 287.791 75 290 75Z"
                    fill="#F5F5F5"
                  />
                  <path
                    d="M290 76C289.447 76 289 76.447 289 77C289 77.553 289.447 78 290 78C290.553 78 291 77.553 291 77C291 76.447 290.553 76 290 76Z"
                    fill="#F5F5F5"
                  />
                </svg>



              </span>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="flex justify-end mb-19">
                <DarkModeSwitcher />
              </span>
              <h3 className="mb-9 text-2xl font-bold text-black text-center border-b dark:text-white sm:text-title-xl2">
                Connectez-vous!
              </h3>



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
                        <DialogTitle className="text-xl font-medium text-gray-900">Connexion succès</DialogTitle>
                        <p className="mt-2 text-sm text-gray-500">
                          Vous êtes connectés avec succès!
                        </p>
                      </div>
                    </div>
                  </DialogPanel>
                </div>
              </Dialog>


              <form className='mt-9' onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="mb-2.5 block font-medium text-black dark:text-white">
                    E-mail
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Entrez votre e-mail"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Retaper le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={motDePasse}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="6+ caractères, 1 lettre majuscule"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      required
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                            fill=""
                          />
                          <path
                            d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                {/* {error && <p className="text-red-500 text-sm mb-4">{error}</p>} */}
                {visible && error &&
                  <div className="flex w-full border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
                    <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                          fill="#ffffff"
                          stroke="#ffffff"
                        ></path>
                      </svg>
                    </div>
                    <div className="w-full">
                      <h5 className="mb-3 font-semibold text-[#B45454]">
                        Des erreurs survenus pendant la connexion
                      </h5>
                      <ul>
                        <li className="leading-relaxed text-[#CD5D5D]">
                          {error}
                        </li>
                      </ul>
                    </div>
                  </div>
                }

                <div className="mb-5 mt-5">
                  <button 
                  type="submit"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  >
                    {loading ? "Connexion..." : "Se connecter"}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p>
                    Vous n'avez pas de compte ?{' '}
                    <Link to="/register" className="text-primary">
                      Inscrivez-vous
                    </Link>
                  </p>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
