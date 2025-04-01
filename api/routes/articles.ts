import express, { Request, Response, Router } from 'express';
import mongoose, { Schema, model, Document } from 'mongoose';
import Joi from 'joi';

const router = express.Router();

// ✅ Interface TypeScript pour un article
interface Article extends Document {
  titre: string;
  auteur: string;
  contenu: string;
  image: string;
  date?: Date;
}

// ✅ Schéma Mongoose
const articleSchema = new Schema<Article>({
  titre: { type: String, required: true },
  auteur: { type: String, required: true },
  contenu: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

// ✅ Modèle Mongoose (évite de recréer le modèle s'il existe déjà)
const ArticleModel = mongoose.models.Article || model<Article>('Article', articleSchema);

// ✅ Connexion Mongoose (à faire une seule fois dans ton app)
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect('mongodb://localhost:27017/maBaseDeDonnées');
  }
};

// ✅ Schéma Joi pour validation des articles
const articleSchemaJoi = Joi.object({
  titre: Joi.string().min(3).max(100).required(),
  auteur: Joi.string().min(3).max(50).required(),
  contenu: Joi.string().min(10).required(),
  image: Joi.string().uri().required(),
});

// ✅ Route GET / - récupérer tous les articles
router.get('/', async (_req: Request, res: Response) => {
  try {
    await connectDB();
    const articles = await ArticleModel.find();
    res.json(articles);
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur de récupération des articles', error: error.message });
  }
});

// ✅ Route GET /:id - récupérer un article par ID
router.get('/:id', async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ message: "Erreur de récupération de l'article", error: error.message });
  }
});

// ✅ Route POST / - ajouter un nouvel article
router.post('/', async (req: Request, res: Response) => {
  const { error } = articleSchemaJoi.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: 'Données invalides.',
      details: error.details.map((detail) => detail.message),
    });
  }

  try {
    await connectDB();
    const nouvelArticle = new ArticleModel(req.body);
    const savedArticle = await nouvelArticle.save();
    res.status(201).json({ message: 'Article ajouté avec succès.', articleId: savedArticle._id });
  } catch (error: any) {
    res.status(500).json({ message: "Erreur lors de l'ajout de l'article.", error: error.message });
  }
});

export default router;