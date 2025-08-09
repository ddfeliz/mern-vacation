// api_tarif.ts
import BASE_URL from "./base_url";

interface APITarif {
  ajoutTarif: string;
  listesTarif: string;
  verificationTarif: string;

  avoirIdTarif: string;
  modifierTarif: string;
  supprimerTarif: string;
}

const API_TARIF: APITarif = {
  ajoutTarif: `${BASE_URL}/api/tarif/ajout`,
  listesTarif: `${BASE_URL}/api/tarif/tous`,
  verificationTarif: `${BASE_URL}/api/tarif/verification`,

  avoirIdTarif: `${BASE_URL}/api/tarif`,
  modifierTarif: `${BASE_URL}/api/tarif`,
  supprimerTarif: `${BASE_URL}/api/tarif`,
};

export default API_TARIF;
