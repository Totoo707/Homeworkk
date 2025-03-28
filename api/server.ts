import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
import articlesRoutes from './routes/articles.js';
import contactsRoutes from './routes/contacts.js';
import createAuthRouter from './routes/auth.js'; // Import du routeur auth

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json()); // Middleware pour parser les requêtes JSON

// Nom de la base de données
const DATABASE_NAME = 'maBaseDeDonnées';
let db: Db;

// Connexion à MongoDB
MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017')
  .then((client) => {
    db = client.db(DATABASE_NAME); // Connexion à la base de données
    console.log(`Connecté à la base de données : ${DATABASE_NAME}`);

    // Routes API
    app.use('/api/articles', articlesRoutes(db));   // Route pour les articles
    app.use('/api/contact', contactsRoutes(db));     // Route pour les contacts
    app.use('/api/auth', createAuthRouter(db));      // Route pour l'authentification

    // Démarrage du serveur une fois que MongoDB est connecté
    const PORT = 4000;
    app.listen(PORT, () => {
      console.log(`Serveur en fonctionnement sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erreur de connexion à MongoDB :', error);
  });

// Route d'accueil
app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur API !');
});
