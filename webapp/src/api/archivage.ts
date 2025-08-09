// api_archive.ts
import BASE_URL from "./base_url";

interface APIArchive {
  ajoutArchive: string;
  listesArchive: string;
  compterArchive: string;

  avoirIdPaiementArchive: string;
  supprimerArchive: string;
}

const API_ARCHIVE: APIArchive = {
  ajoutArchive: `${BASE_URL}/api/archive/archive-paiements`,
  listesArchive: `${BASE_URL}/api/archive/tous`,
  compterArchive: `${BASE_URL}/api/archive/compter`,

  avoirIdPaiementArchive: `${BASE_URL}/api/archive`,
  supprimerArchive: `${BASE_URL}/api/archive`,
};

export default API_ARCHIVE;
