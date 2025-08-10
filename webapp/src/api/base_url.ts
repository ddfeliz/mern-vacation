const BASE_URL = 'https://gestion-vacation.onrender.com';

export default BASE_URL;
export interface APIArchive {
  ajoutArchive: string;
  listesArchive: string;
  compterArchive: string;

  //
  avoirIdPaiementArchive: (idPaiement: string) => string;
  supprimerArchive: (idPaiement: string) => string;
}
