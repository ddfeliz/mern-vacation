const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// Import des routes
const UtilisateurRoutage = require('./routage/utilisateur');
const BaccalaureatRoutage = require('./routage/baccalaureat');
const TarifRoutage = require('./routage/tarif');
const CorrecteurRoutage = require('./routage/correcteur');
const VacationRoutage = require('./routage/vacation');
const PaiementRoutage = require('./routage/paiement');
const ArchiveRoutage = require('./routage/archivage');

const app = express();

// 1) MIDDLEWARE
app.use(cors());
app.use(express.json());

// 2) ROUTE DES ACTEURS
app.use('/api/utilisateur', UtilisateurRoutage);
app.use('/api/correcteur', CorrecteurRoutage);
app.use('/api/matiere-bacc', BaccalaureatRoutage);
app.use('/api/tarif', TarifRoutage);
app.use('/api/vacation', VacationRoutage);
app.use('/api/paiement', PaiementRoutage);
app.use('/api/archive', ArchiveRoutage);

// 3) MONGODB CONNECTION
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Le serveur est connecté à MongoDB Atlas!'))
    .catch((error) => console.error('Le serveur a racontré des erreurs:', error));

// 4) GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500; 
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

// 5) SERVER
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});