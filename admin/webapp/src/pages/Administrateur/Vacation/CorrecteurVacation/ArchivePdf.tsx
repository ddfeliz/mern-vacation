import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Archive } from '../../../../types/archive';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    margin: '10px 0',
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    display: 'flex',
  },
  tableCell: {
    border: '1px solid black',
    padding: 10,
    textAlign: 'center',
    width: 320,
    fontSize: 12,
  },
  headerRow: {
    backgroundColor: 'black',
  },
  headerCell: {
    color: 'white',
  },
  totalRow: {
    backgroundColor: 'white',
    fontWeight: 'bold',
  },
  emptyCell: {
    flex: 10, // Espacement pour aligner les totaux à droite
  },
  totalLabelCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
  totalAmountCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
});

interface ArchivePdfProps {
  archives: Archive[];
}

const ArchivePdf: React.FC<ArchivePdfProps> = ({ archives }) => {
  const session = archives.length > 0 ? archives[0].session : 'Inconnue';

  // Calculer les totaux pour tous, payé, et non payé
  const grandTotal = archives.reduce((sum, archive) => sum + archive.montantTotal, 0);
  const totalPaye = archives
    .filter((archive) => archive.statut === 'Payé')
    .reduce((sum, archive) => sum + archive.montantTotal, 0);
  const totalNonPaye = archives
    .filter((archive) => archive.statut === 'Non payé')
    .reduce((sum, archive) => sum + archive.montantTotal, 0);

  return (
    <Document>
      <Page size="A1" style={styles.page}>
        <View style={styles.header}>
          <Text>REPOBILIKAN'I MADAGASIKARA</Text>
          <Text>Fitiavana-Tanindrazana-Fandrosoana</Text>
          <Text>-------------</Text>
          <Text>MINISTERE DE L'ENSEIGNEMENT SUPPERIEUR</Text>
          <Text>ET DE LA RECHERCHE SCIENTIFIQUE</Text>
          <Text>-------------</Text>
          <Text>UNIVERSITE DE TOLIARA</Text>
          <Text>-------------</Text>
          <Text>PRESIDENCE</Text>
        </View>

        <View style={styles.section}>
          <Text>Liste des Archives - session : {session} </Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.headerRow]}>
              <Text style={[styles.tableCell, styles.headerCell]}>
                ID Paiement
              </Text>
              <Text style={[styles.tableCell, styles.headerCell]}>
                ID Vacation
              </Text>
              <Text style={[styles.tableCell, styles.headerCell]}>
                ID Correcteur
              </Text>
              <Text style={[styles.tableCell, styles.headerCell]}>
                Nom complet
              </Text>
              <Text style={[styles.tableCell, styles.headerCell]}>CIN</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>
                Bacc spécialité
              </Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Secteur</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Option</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>
                Matière spécialisée
              </Text>
              <Text style={[styles.tableCell, styles.headerCell]}>
                Nombre de copies corrigées
              </Text>
              <Text style={[styles.tableCell, styles.headerCell]}>
                Option du tarif
              </Text>
              <Text style={[styles.tableCell, styles.headerCell]}>
                Montant total
              </Text>
              <Text style={[styles.tableCell, styles.headerCell]}>
                Statut
              </Text>
            </View>
            {archives.map((archive) => (
              <View style={styles.tableRow} key={archive.idPaiement}>
                <Text style={styles.tableCell}>{archive.idPaiement}</Text>
                <Text style={styles.tableCell}>{archive.idVacation}</Text>
                <Text style={styles.tableCell}>{archive.idCorrecteur}</Text>
                <Text
                  style={styles.tableCell}
                >{`${archive.nom} ${archive.prenom}`}</Text>
                <Text style={styles.tableCell}>{archive.cin}</Text>
                <Text style={styles.tableCell}>{archive.specialite}</Text>
                <Text style={styles.tableCell}>{archive.secteur}</Text>
                <Text style={styles.tableCell}>{archive.option}</Text>
                <Text style={styles.tableCell}>{archive.matiere}</Text>
                <Text style={styles.tableCell}>{archive.nbcopie}</Text>
                <Text style={styles.tableCell}>{archive.optionTarif}</Text>
                <Text style={styles.tableCell}>{archive.montantTotal.toFixed(2)} Ar</Text>
                <Text style={styles.tableCell}>{archive.statut}</Text>
              </View>
            ))}
            {/* Ligne des Totaux alignée à droite */}
            <View style={[styles.tableRow, styles.totalRow]}>
              <View style={styles.emptyCell} />
              <Text style={[styles.tableCell, styles.totalLabelCell]}>
                Grand Total
              </Text>
              <Text style={[styles.tableCell, styles.totalAmountCell]}>
                {grandTotal.toFixed(2)} Ar
              </Text>
            </View>
            <View style={[styles.tableRow, styles.totalRow]}>
              <View style={styles.emptyCell} />
              <Text style={[styles.tableCell, styles.totalLabelCell]}>
                Total Payé
              </Text>
              <Text style={[styles.tableCell, styles.totalAmountCell]}>
                {totalPaye.toFixed(2)} Ar
              </Text>
            </View>
            <View style={[styles.tableRow, styles.totalRow]}>
              <View style={styles.emptyCell} />
              <Text style={[styles.tableCell, styles.totalLabelCell]}>
                Total Non Payé
              </Text>
              <Text style={[styles.tableCell, styles.totalAmountCell]}>
                {totalNonPaye.toFixed(2)} Ar
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ArchivePdf;
