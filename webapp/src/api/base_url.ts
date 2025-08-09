const BASE_URL = 'http://localhost:3000';

export default BASE_URL;
export interface APIArchive {
  ajoutArchive: string;
  listesArchive: string;
  compterArchive: string;

  //
  avoirIdPaiementArchive: (idPaiement: string) => string;
  supprimerArchive: (idPaiement: string) => string;
}
