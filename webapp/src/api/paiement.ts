// api_paiement.ts
import BASE_URL from "./base_url";

interface APIPaiement {
  ajoutPaiement: string;
  listesPaiement: string;
  totalMontantPaiement: string;
  totalCopiePaiement: string;
  compterPaiement: string;
  regouperPaiement: string;
  genererExcelPaiement: string;
  genererPaiementPDF: string;
  modifierToPayerPaiement: string;

  avoirIdCorrecteurPaiement: string;
  avoirIdPaiement: string;
  modifierPaiement: string;
  supprimerPaiement: string;
  existePaiement: string;
}

const API_PAIEMENT: APIPaiement = {
  ajoutPaiement: `${BASE_URL}/api/paiement/ajoute`,
  listesPaiement: `${BASE_URL}/api/paiement/tous`,
  totalMontantPaiement: `${BASE_URL}/api/paiement/total-montant`,
  totalCopiePaiement: `${BASE_URL}/api/paiement/total-copie`,
  compterPaiement: `${BASE_URL}/api/paiement/compter`,
  regouperPaiement: `${BASE_URL}/api/paiement/regroupement`,
  genererExcelPaiement: `${BASE_URL}/api/paiement/generer-excel`,
  genererPaiementPDF: `${BASE_URL}/api/paiement/export-pdf`,
  modifierToPayerPaiement: `${BASE_URL}/api/paiement/statut-modification`,

  avoirIdCorrecteurPaiement: `${BASE_URL}/api/paiement/correcteur`,
  avoirIdPaiement: `${BASE_URL}/api/paiement`,
  modifierPaiement: `${BASE_URL}/api/paiement`,
  supprimerPaiement: `${BASE_URL}/api/paiement`,
  existePaiement: `${BASE_URL}/api/paiement/verification`,
};

export default API_PAIEMENT;
