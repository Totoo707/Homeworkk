import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Autoriser uniquement les requêtes provenant de localhost:3000
app.use(cors({
  origin: 'http://localhost:3000' // Frontend
}));

// Configuration MongoDB
const MONGODB_URI = 'mongodb://thomas:monMotDePasse@localhost:27017/maBaseDeDonnées?authSource=maBaseDeDonnées';const DATABASE_NAME = 'maBaseDeDonnées'; // Remplacez par le nom de votre base de données
let db;

// Connexion à MongoDB
MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(DATABASE_NAME);
    console.log(`Connecté à la base de données : ${DATABASE_NAME}`);
  })
  .catch(error => {
    console.error('Erreur de connexion à MongoDB :', error);
  });

// Route pour la racine
app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur API !');
});

// Route pour récupérer tous les articles
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await db.collection('articles').find({}).toArray();
    res.json(articles);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles :', error);
    res.status(500).json({ message: 'Erreur de récupération des articles', error: error.message });
  }
});

// Route pour récupérer un article spécifique par ID
app.get('/api/articles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }
    const article = await db.collection('articles').findOne({ _id: new ObjectId(id) });
    if (!article) {
      return res.status(404).json({ message: 'Article introuvable' });
    }
    res.json(article);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article :', error);
    res.status(500).json({ message: 'Erreur de récupération de l\'article', error: error.message });
  }
});

// Serveur d'exemple pour d'autres routes
app.get('/deuxiemepage', (req, res) => {
  res.sendFile(path.join(__dirname, 'deuxiemepage', 'page.js'));
});

// Serveur principal
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Serveur en fonctionnement sur http://localhost:${PORT}`);
});