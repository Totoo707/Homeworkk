import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
// ✅ Pour recréer __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ✅ Imports de routes
import articlesRoutes from './routes/articles.js';
import contactsRoutes from './routes/contacts.js';
import authRoutes from './routes/auth.js';
dotenv.config();
const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
// ✅ Sert les fichiers statiques (images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// ✅ API Routes
app.use('/api/articles', articlesRoutes);
app.use('/api/contact', contactsRoutes);
app.use('/api/auth', authRoutes);
app.get('/', (_req, res) => {
    res.send('Bienvenue sur le serveur API !');
});
export default app;
