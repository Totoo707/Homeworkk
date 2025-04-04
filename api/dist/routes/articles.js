// articles.ts
import express from 'express';
import mongoose, { Schema, model } from 'mongoose';
import multer from 'multer';
import Joi from 'joi';
const router = express.Router();
// Schéma Mongoose mis à jour
const articleSchema = new Schema({
    titre: { type: String, required: true },
    auteur: { type: String, required: true },
    contenu: { type: String, required: true },
    image: {
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true },
    },
    date: { type: Date, default: Date.now },
});
const ArticleModel = mongoose.models.Article || model('Article', articleSchema);
// Connexion MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect('mongodb://localhost:27017/maBaseDeDonnées');
    }
};
// Configuration de Multer pour récupérer le fichier en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage });
// Schéma Joi pour la validation des champs textes
const articleSchemaJoi = Joi.object({
    titre: Joi.string().required(),
    auteur: Joi.string().required(),
    contenu: Joi.string().required(),
});
// ✅ GET /api/articles → Récupérer les articles avec pagination, recherche et tri
router.get('/', async (req, res) => {
    await connectDB();
    const { page = '1', limit = '15', search = '', sortBy = 'date', order = 'desc' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === 'asc' ? 1 : -1;
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
        const total = await ArticleModel.countDocuments(query);
        const articles = await ArticleModel.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limitNum)
            .select('-image.data'); // Exclut les données binaires de l'image pour alléger la réponse
        const hasMore = skip + articles.length < total;
        res.json({ articles, total, hasMore });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
});
// ✅ GET /api/articles/:id → Récupérer un article par son ID et renvoyer l'image encodée en Base64
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
        const imageBase64 = `data:${article.image.contentType};base64,${article.image.data.toString('base64')}`;
        res.json({ ...article.toObject(), imageBase64 });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur de récupération', error: error.message });
    }
});
// ✅ GET /api/articles/:id/image → Retourner l'image en binaire
router.get('/:id/image', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID invalide' });
    }
    try {
        await connectDB();
        const article = await ArticleModel.findById(id);
        if (!article)
            return res.status(404).json({ message: 'Article introuvable' });
        res.set('Content-Type', article.image.contentType);
        res.send(article.image.data);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur de récupération', error: error.message });
    }
});
// ✅ POST /api/articles → Ajouter un article avec une image stockée en base de données
router.post('/', upload.single('image'), async (req, res) => {
    const { titre, auteur, contenu } = req.body;
    const { error } = articleSchemaJoi.validate({ titre, auteur, contenu });
    if (error) {
        return res.status(400).json({
            message: 'Données invalides.',
            details: error.details.map((d) => d.message),
        });
    }
    if (!req.file) {
        return res.status(400).json({ message: "L'image est obligatoire." });
    }
    try {
        await connectDB();
        const nouvelArticle = new ArticleModel({
            titre,
            auteur,
            contenu,
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            },
        });
        const saved = await nouvelArticle.save();
        res.status(201).json({ message: 'Article ajouté.', articleId: saved._id });
    }
    catch (err) {
        res.status(500).json({ message: "Erreur d'ajout", error: err.message });
    }
});
export default router;
