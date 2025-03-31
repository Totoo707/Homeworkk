import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import articlesRoutes from './routes/articles.js';
import contactsRoutes from './routes/contacts.js';
import authRoutes from './routes/auth.js';
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
// Connexion à Mongoose
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maBaseDeDonnées';
mongoose
    .connect(MONGODB_URI)
    .then(() => {
    console.log('✅ Connecté à MongoDB avec Mongoose');
    // Routes API
    app.use('/api/articles', articlesRoutes);
    app.use('/api/contact', contactsRoutes);
    app.use('/api/auth', authRoutes);
    // Route d'accueil
    app.get('/', (req, res) => {
        res.send('Bienvenue sur le serveur API !');
    });
    // Démarrage du serveur
    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`🚀 Serveur en fonctionnement sur http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error('❌ Erreur de connexion à MongoDB :', error);
});
