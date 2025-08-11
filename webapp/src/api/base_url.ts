// const BASE_URL = 'https://gestion-vacation.onrender.com';
const BASE_URL = 'https://mern-vacation.vercel.app';

export default BASE_URL;
export interface APIArchive {
  ajoutArchive: string;
  listesArchive: string;
  compterArchive: string;

  //
  avoirIdPaiementArchive: (idPaiement: string) => string;
  supprimerArchive: (idPaiement: string) => string;
}
