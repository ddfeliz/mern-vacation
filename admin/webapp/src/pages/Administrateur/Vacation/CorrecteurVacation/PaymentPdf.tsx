// PDFDocument.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Payment } from '../../../../types/Payment';

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
    width: 320,
    fontSize: 12,
  },
  headerRow: {
    backgroundColor: 'black', // Couleur de fond noir pour l'en-tête
  },
  headerCell: {
    color: 'white', // Couleur du texte blanche pour l'en-tête
  },
});

interface PaymentPdfProps {
  payments: Payment[];
}

const PaymentPdf: React.FC<PaymentPdfProps> = ({ payments }) => {
  // Vérifiez si des vacations sont présentes et extrayez la session
  const session = payments.length > 0 ? payments[0].session : 'Inconnue';

  return (
    <Document>
      <Page size="A1" style={styles.page}>
        <View style={styles.section}>
          <Text>Liste des Payments - session : {session} </Text>
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
            {payments.map((payment) => (
              <View style={styles.tableRow} key={payment.idPayment}>
                <Text style={styles.tableCell}>{payment.idPayment}</Text>
                <Text style={styles.tableCell}>{payment.idVacation}</Text>
                <Text style={styles.tableCell}>{payment.idCorrecteur}</Text>
                <Text
                  style={styles.tableCell}
                >{`${payment.nom} ${payment.prenom}`}</Text>
                <Text style={styles.tableCell}>{payment.cin}</Text>
                <Text style={styles.tableCell}>{payment.specialite}</Text>
                <Text style={styles.tableCell}>{payment.secteur}</Text>
                <Text style={styles.tableCell}>{payment.option}</Text>
                <Text style={styles.tableCell}>{payment.matiere}</Text>
                <Text style={styles.tableCell}>{payment.nbcopie}</Text>
                <Text style={styles.tableCell}>{payment.optionTarif}</Text>
                <Text style={styles.tableCell}>{payment.montantTotal}</Text>
                <Text style={styles.tableCell}>{payment.statut}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PaymentPdf;
