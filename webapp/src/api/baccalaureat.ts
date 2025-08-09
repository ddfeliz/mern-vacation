// api_bacc.ts
import BASE_URL from "./base_url";

interface APIBacc {
  ajoutBacc: string;
  listesBacc: string;
  specialisteBacc: string;
  secteurBacc: string;
  optionBacc: string;
  matiereBacc: string;

  avoirIdBacc: string;
  modifierBacc: string;
  supprimerBacc: string;
}

const API_BACC: APIBacc = {
  ajoutBacc: `${BASE_URL}/api/matiere-bacc/ajout`,
  listesBacc: `${BASE_URL}/api/matiere-bacc/tous`,
  specialisteBacc: `${BASE_URL}/api/matiere-bacc/specialiste`,
  secteurBacc: `${BASE_URL}/api/matiere-bacc/secteurs`,
  optionBacc: `${BASE_URL}/api/matiere-bacc/options`,
  matiereBacc: `${BASE_URL}/api/matiere-bacc/matieres`,

  avoirIdBacc: `${BASE_URL}/api/matiere-bacc`,
  modifierBacc: `${BASE_URL}/api/matiere-bacc`,
  supprimerBacc: `${BASE_URL}/api/matiere-bacc`,
};

export default API_BACC;
