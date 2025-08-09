// api_correcteur.ts
import BASE_URL from "./base_url";

interface APICorrecteur {
  ajoutCorrecteur: string;
  listesCorrecteur: string;
  compterStatutCorrecteur: string;
  compterCorrecteur: string;
  modificationStatutCorrecteur: string;

  avoirIdCorrecteur: string;
  avoirIMCorrecteur: string;
  verifierCINCorrecteur: string;
  modifierCorrecteur: string;
  supprimerCorrecteur: string;
}

const API_CORRECTEUR: APICorrecteur = {
  ajoutCorrecteur: `${BASE_URL}/api/correcteur/ajout`,
  listesCorrecteur: `${BASE_URL}/api/correcteur/tous`,
  compterStatutCorrecteur: `${BASE_URL}/api/correcteur/comptage`,
  compterCorrecteur: `${BASE_URL}/api/correcteur/compter`,
  modificationStatutCorrecteur: `${BASE_URL}/api/correcteur/modificationStatus`,

  avoirIdCorrecteur: `${BASE_URL}/api/correcteur`,
  avoirIMCorrecteur: `${BASE_URL}/api/correcteur`,
  verifierCINCorrecteur: `${BASE_URL}/api/correcteur/verification`,
  modifierCorrecteur: `${BASE_URL}/api/correcteur`,
  supprimerCorrecteur: `${BASE_URL}/api/correcteur`,
};

export default API_CORRECTEUR;

