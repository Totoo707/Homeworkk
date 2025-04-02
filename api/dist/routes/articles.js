import express from 'express';
import mongoose, { Schema, model } from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Joi from 'joi';
const router = express.Router();
// Schéma Mongoose
const articleSchema = new Schema({
    titre: { type: String, required: true },
    auteur: { type: String, required: true },
    contenu: { type: String, required: true },
    image: { type: String, required: true },
    date: { type: Date, default: Date.now },
});
const ArticleModel = mongoose.models.Article || model('Article', articleSchema);
// Connexion MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect('mongodb://localhost:27017/maBaseDeDonnées');
    }
};
// Multer (upload d'image dans /uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });
// Joi (valide les champs texte)
const articleSchemaJoi = Joi.object({
    titre: Joi.string().required(),
    auteur: Joi.string().required(),
    contenu: Joi.string().required(),
});
// ✅ GET /api/articles - tous les articles
router.get('/', async (_req, res) => {
    try {
        await connectDB();
        const articles = await ArticleModel.find();
        res.json(articles);
    }
    catch (err) {
        res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
});
// ✅ GET /api/articles/:id - un article par ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID invalide' });
    }
    try {
        await connectDB();
        const article = await ArticleModel.findById(id);
        if (!article) {
            return res.status(404).json({ message: 'Article introuvable' });
        }
        res.json(article);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur de récupération de l'article", error: error.message });
    }
});
// ✅ POST /api/articles - ajouter un article avec image
router.post('/', upload.single('image'), async (req, res) => {
    const { titre, auteur, contenu } = req.body;
    const { error } = articleSchemaJoi.validate({ titre, auteur, contenu });
    if (error) {
        return res.status(400).json({
            message: 'Données invalides.',
            details: error.details.map((d) => d.message),
        });
    }
    try {
        await connectDB();
        const nouvelArticle = new ArticleModel({
            titre,
            auteur,
            contenu,
            image: req.file ? `/uploads/${req.file.filename}` : '',
        });
        const saved = await nouvelArticle.save();
        res.status(201).json({ message: 'Article ajouté avec succès.', articleId: saved._id });
    }
    catch (err) {
        res.status(500).json({ message: "Erreur lors de l'ajout de l'article.", error: err.message });
    }
});
export default router;
