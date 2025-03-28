import express from 'express';
import { ObjectId } from 'mongodb';
const createRouter = (db) => {
    const router = express.Router(); // Assurez-vous que le routeur est correctement initialisé
    // Route pour récupérer tous les articles
    router.get('/', async (req, res) => {
        try {
            const articles = await db.collection('articles').find({}).toArray();
            res.json(articles);
        }
        catch (error) {
            res.status(500).json({ message: 'Erreur de récupération des articles', error: error.message });
        }
    });
    // Route pour récupérer un article spécifique par ID
    router.get('/:id', async (req, res) => {
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
        }
        catch (error) {
            res.status(500).json({ message: "Erreur de récupération de l'article", error: error.message });
        }
    });
    // Route pour ajouter un nouvel article
    router.post('/', async (req, res) => {
        const { titre, auteur, contenu, image } = req.body;
        if (!titre || !auteur || !contenu || !image) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
        }
        try {
            const newArticle = { titre, auteur, contenu, image, date: new Date() };
            const result = await db.collection('articles').insertOne(newArticle);
            res.status(201).json({ message: 'Article ajouté avec succès.', articleId: result.insertedId });
        }
        catch (error) {
            res.status(500).json({ message: "Erreur lors de l'ajout de l'article.", error: error.message });
        }
    });
    return router; // Retournez le routeur configuré
};
export default createRouter;
