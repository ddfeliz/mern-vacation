const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware pour vérifier l'authentification via JWT
const authenticateToken = (req, res, next) => {
  // Récupérer le token de l'en-tête Authorization
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  // Vérification du token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid' });
    }

    req.user = user; // Ajouter l'utilisateur décodé à la requête
    next(); // Passer au middleware suivant ou à la route
  });
};

module.exports = authenticateToken;
