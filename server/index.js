const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

// Import des routes
const correcteurRoutes = require('./routes/correcteurRoute');
const utilisateurRoute = require('./routes/utilisateurRoute');
const baccRoutes = require('./routes/baccRoute'); 
const tarifRoute = require('./routes/tarifRoute');
const vacationRoutes = require('./routes/vacationRoute');
const paiementRoute = require('./routes/paiementRoute');
const archivePaiementRoute = require('./routes/archivePaiementRoute');
const authenticateToken = require('./middlewares/middlaware');

const app = express();


// 1) MIDDLEWARE
app.use(cors());
app.use(express.json());


// Serve static files (if you use create-react-app or another build tool)
app.use(express.static(path.join(__dirname, 'dist')));

// Redirect all non-API routes to index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// 2) ROUTE DES ACTEURS
app.use('/api/correcteur', correcteurRoutes);
app.use('/api/admin', utilisateurRoute);
app.use('/api/matiere-bacc', baccRoutes);
app.use('/api/tarif', tarifRoute);
app.use('/api/vacation', vacationRoutes);
app.use('/api/payment', paiementRoute);
app.use('/api/archive', archivePaiementRoute);
// Appliquer ce middleware aux routes sécurisées
app.use('/api/protected', authenticateToken, (req, res) => {
    // Cette route est protégée par l'authentification JWT
    res.json({ message: 'Welcome to the protected route', user: req.user });
  });

// 3) MONGODB CONNECTION
mongoose
    .connect('mongodb+srv://sambatratahirindrazana:sami2003..@mycluster.gg52g.mongodb.net/gestion_vacation?')
    .then(() => console.log('Le serveur est connecté à MongoDB Atlas!'))
    .catch((error) => console.error('Le serveur a racontré des erreurs:', error));

// 4) GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500; // Correction from statuCode to statusCode
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

// 5) SERVER
const PORT = process.env.PORT || 3000; // Utiliser le port depuis .env, ou 3000 par défaut
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});