// api_vacation.ts
import BASE_URL from "./base_url";

interface APIVacation {
  ajoutVacation: string;
  listesVacation: string;
  totalCopieVacation: string;
  totalCopieEnAnneeVacation: string;
  compterVacation: string;
  compteVacationByCorrecteur: string;
  avoirIMVacation:string;
  avoirIdVacation: string;
  genererPDF: string;
  avoirSpecialite: string;

  verifierPocheteVacation: string;
  modifierVacation: string;
  supprimerVacation: string;
  avoirNombreCorrecteursAvecVacations: string;
}

const API_VACATION: APIVacation = {
  ajoutVacation: `${BASE_URL}/api/vacation/ajout`,
  listesVacation: `${BASE_URL}/api/vacation/tous`,
  totalCopieVacation: `${BASE_URL}/api/vacation/totales-copies`,
  totalCopieEnAnneeVacation: `${BASE_URL}/api/vacation/totales-copies-en-annee`,
  compterVacation: `${BASE_URL}/api/vacation/compte`,
  compteVacationByCorrecteur: `${BASE_URL}/api/vacation/compte-vacation`,
  avoirIMVacation:`${BASE_URL}/api/vacation`,
  avoirIdVacation:`${BASE_URL}/api/vacation/correcteur`,
  genererPDF: `${BASE_URL}/api/vacation/generer-pdf`,
  avoirSpecialite: `${BASE_URL}/api/vacation/specialites`,


  verifierPocheteVacation:`${BASE_URL}/api/vacation/verification`,
  modifierVacation: `${BASE_URL}/api/vacation`,
  supprimerVacation: `${BASE_URL}/api/vacation`,
  avoirNombreCorrecteursAvecVacations: `${BASE_URL}/api/vacation/compte-correcteur-vacataire`,
};

export default API_VACATION;
