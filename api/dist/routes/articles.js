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
// Joi (validation des champs texte)
const articleSchemaJoi = Joi.object({
    titre: Joi.string().required(),
    auteur: Joi.string().required(),
    contenu: Joi.string().required(),
});
// ✅ GET /api/articles → avec pagination, recherche et tri
router.get('/', async (req, res) => {
    await connectDB();
    // Récupérer les paramètres de la requête (page, limit, etc.)
    const { page = 1, limit = 15, search = '', sortBy = 'date', order = 'desc' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === 'asc' ? 1 : -1;
    // Construction de la requête avec recherche
    const query = search
        ? {
            $or: [
                { titre: { $regex: search, $options: 'i' } },
                { auteur: { $regex: search, $options: 'i' } },
                { contenu: { $regex: search, $options: 'i' } },
            ],
        }
        : {};
    try {
        // Calcul du nombre total d'articles correspondant à la recherche
        const total = await ArticleModel.countDocuments(query);
        // Recherche des articles en appliquant le tri, la pagination et la limite
        const articles = await ArticleModel.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip(skip) // Pagination avec skip
            .limit(limitNum); // Limite à 15 articles par appel
        // Vérifier s'il y a d'autres articles à charger
        const hasMore = skip + articles.length < total;
        // Retourner les articles, le total et l'indicateur hasMore
        res.json({ articles, total, hasMore });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});
// ✅ GET /api/articles/:id → récupérer un article par ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID invalide' });
    }
    try {
        await connectDB();
        const article = await ArticleModel.findById(id);
        if (!article)
            return res.status(404).json({ message: 'Article introuvable' });
        res.json(article);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur de récupération', error: error.message });
    }
});
// ✅ POST /api/articles → ajouter un article avec une image
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
        res.status(201).json({ message: 'Article ajouté.', articleId: saved._id });
    }
    catch (err) {
        res.status(500).json({ message: "Erreur d'ajout", error: err.message });
    }
});
export default router;
