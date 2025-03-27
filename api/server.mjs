import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import articlesRoutes from './routes/articles.js';
import contactsRoutes from './routes/contacts.js';
import usersRoutes from './routes/users.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const DATABASE_NAME = 'maBaseDeDonnées';
let db;

MongoClient.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then((client) => {
    db = client.db(DATABASE_NAME);
    console.log(`Connecté à la base de données : ${DATABASE_NAME}`);

    // Utilisation des routes
    app.use('/api/articles', articlesRoutes(db));
    app.use('/api/contact', contactsRoutes(db));
    app.use('/api/users', usersRoutes(db));
  })
  .catch((error) => {
    console.error('Erreur de connexion à MongoDB :', error);
  });

app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur API !');
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Serveur en fonctionnement sur http://localhost:${PORT}`);
});