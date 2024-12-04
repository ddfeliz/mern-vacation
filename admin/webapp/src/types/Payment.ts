export interface Payment {
    idPaiement: string,
    idVacation: string,
    idCorrecteur: string,
    immatricule: string;
    nom: string,
    prenom: string,
    cin: string,
    specialite: string,
    secteur: string,
    option: string,
    matiere: string,
    pochette: string,
    nbcopie: number,
    optionTarif: string,
    montantTotal: number,
    session: number,
    statut: string
}