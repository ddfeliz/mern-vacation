// PDFDocument.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Vacation } from '../../../../types/vacation';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
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
    width: 290,
    fontSize: 12,
  },
  headerRow: {
    backgroundColor: 'black', // Couleur de fond noir pour l'en-tête
  },
  headerCell: {
    color: 'white', // Couleur du texte blanche pour l'en-tête
  },
});

interface VacationPdfProps {
  vacations: Vacation[];
}

const VacationPdf: React.FC<VacationPdfProps> = ({ vacations }) => {
  // Vérifiez si des vacations sont présentes et extrayez la session
  const session = vacations.length > 0 ? vacations[0].session : 'Inconnue';

  return (
    <Document>
      <Page size="A2" style={styles.page}>
        <View style={styles.section}>
          <Text>Liste des Vacations - session : {session} </Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.headerRow]}>
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
            </View>
            {vacations.map((vacation) => (
              <View style={styles.tableRow} key={vacation.idVacation}>
                <Text style={styles.tableCell}>{vacation.idVacation}</Text>
                <Text style={styles.tableCell}>{vacation.idCorrecteur}</Text>
                <Text
                  style={styles.tableCell}
                >{`${vacation.nom} ${vacation.prenom}`}</Text>
                <Text style={styles.tableCell}>{vacation.cin}</Text>
                <Text style={styles.tableCell}>{vacation.specialite}</Text>
                <Text style={styles.tableCell}>{vacation.secteur}</Text>
                <Text style={styles.tableCell}>{vacation.option}</Text>
                <Text style={styles.tableCell}>{vacation.matiere}</Text>
                <Text style={styles.tableCell}>{vacation.nbcopie}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default VacationPdf;
