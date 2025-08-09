// api_utilisateur.ts
import BASE_URL from "./base_url";

interface APIUtilisateur {
  ajoutUtilisateur: string;
  listesUtilisateur: string;
  connecterUtilisateur: string;
  profileUtilisateur: string;

  avoirIdUtilisateur: string;
  modifierUtilisateur: string;
  supprimerUtilisateur: string;
}

const API_UTILISATEUR: APIUtilisateur = {
  ajoutUtilisateur: `${BASE_URL}/api/utilisateur/ajout`,
  listesUtilisateur: `${BASE_URL}/api/utilisateur/tous`,
  connecterUtilisateur: `${BASE_URL}/api/utilisateur/connexion`,
  profileUtilisateur: `${BASE_URL}/api/utilisateur/profile`,

  avoirIdUtilisateur: `${BASE_URL}/api/utilisateur`,
  modifierUtilisateur: `${BASE_URL}/api/utilisateur`,
  supprimerUtilisateur: `${BASE_URL}/api/utilisateur`,
};

export default API_UTILISATEUR;
