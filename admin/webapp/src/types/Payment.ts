export interface Payment {
    idPayment: string,
    idVacation: string,
    idCorrecteur: string,
    nom: string,
    prenom: string,
    cin: string,
    specialite: string,
    secteur: string,
    option: string,
    matiere: string,
    nbcopie: number,
    optionTarif: string,
    montantTotal: number,
    session: number,
    statut: string
}