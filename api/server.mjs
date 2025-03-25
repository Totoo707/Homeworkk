import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from "dotenv";
import bcrypt from 'bcrypt'; // Pour comparer les mots de passe
import jwt from 'jsonwebtoken'; // Pour générer des tokens JWT

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Autoriser uniquement les requêtes provenant de localhost:3000
app.use(cors({
  origin: 'http://localhost:3000' // Frontend
}));

// Configuration MongoDB
const DATABASE_NAME = 'maBaseDeDonnées'; // Remplacez par le nom de votre base de données
let db;

// Connexion à MongoDB
console.log('connexion', process.env.MONGODB_URI);
MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(DATABASE_NAME);
    console.log(`Connecté à la base de données : ${DATABASE_NAME}`);
  })
  .catch(error => {
    console.error('Erreur de connexion à MongoDB :', error);
  });

// Middleware pour parser le JSON
app.use(express.json());

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

// Route pour ajouter un nouvel article
app.post('/api/articles', async (req, res) => {
  const { titre, auteur, contenu, image } = req.body;

  // Validation des données
  if (!titre || !auteur || !contenu || !image) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
  }

  try {
    const result = await db.collection('articles').insertOne({
      titre,
      auteur,
      contenu,
      image,
      date: new Date(), // Ajoute une date de création
    });

    res.status(201).json({ message: 'Article ajouté avec succès.', articleId: result.insertedId });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'article :', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'article.', error: error.message });
  }
});

// Route pour gérer la connexion des utilisateurs
const SECRET_KEY = "votre_clé_secrète"; // Remplacez par une clé secrète sécurisée
app.post('/api/login', async (req, res) => {
  const { email, motDePasse } = req.body;

  if (!email || !motDePasse) {
    return res.status(400).json({ message: 'Email et mot de passe sont obligatoires.' });
  }

  try {
    const utilisateur = await db.collection('utilisateurs').findOne({ email });

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Vérifier le mot de passe
    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);

    if (!motDePasseValide) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: utilisateur._id, email: utilisateur.email }, SECRET_KEY, {
      expiresIn: '1h', // Le token expire dans 1 heure
    });

    res.status(200).json({ message: 'Connexion réussie.', token });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ message: 'Erreur lors de la connexion.', error: error.message });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Validation des données
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
  }

  try {
    const result = await db.collection('contact').insertOne({
      nom: name,
      email,
      message,
      date: new Date(), // Ajoute une date de création
    });

    res.status(201).json({ message: 'Message envoyé avec succès.', contactId: result.insertedId });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message :', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message.', error: error.message });
  }
});

// Route pour récupérer tous les messages de contact
app.get('/api/contact', async (req, res) => {
  try {
    const messages = await db.collection('contact').find({}).toArray();
    res.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages :', error);
    res.status(500).json({ message: 'Erreur de récupération des messages', error: error.message });
  }
});

// Serveur principal
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Serveur en fonctionnement sur http://localhost:${PORT}`);
});