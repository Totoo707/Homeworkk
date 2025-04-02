import express, { Request, Response } from 'express';
import mongoose, { Schema, model, Document } from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Joi from 'joi';

const router = express.Router();

interface Article extends Document {
  titre: string;
  auteur: string;
  contenu: string;
  image: string;
  date?: Date;
}

const articleSchema = new Schema<Article>({
  titre: { type: String, required: true },
  auteur: { type: String, required: true },
  contenu: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const ArticleModel = mongoose.models.Article || model<Article>('Article', articleSchema);

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect('mongodb://localhost:27017/maBaseDeDonnées');
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const articleSchemaJoi = Joi.object({
  titre: Joi.string().required(),
  auteur: Joi.string().required(),
  contenu: Joi.string().required(),
});

// ✅ GET /api/articles → avec pagination, recherche, tri
router.get('/', async (req: Request, res: Response) => {
  await connectDB();

  const { page = 1, limit = 8, search = '', sortBy = 'date', order = 'desc' } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
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
      .sort({ [sortBy as string]: sortOrder })
      .skip(skip)
      .limit(limitNum);

    const hasMore = skip + articles.length < total;

    res.json({ articles, total, hasMore });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// ✅ GET /api/articles/:id
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID invalide' });
  }

  try {
    await connectDB();
    const article = await ArticleModel.findById(id);
    if (!article) return res.status(404).json({ message: 'Article introuvable' });
    res.json(article);
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur de récupération', error: error.message });
  }
});

// ✅ POST /api/articles
router.post('/', upload.single('image'), async (req: Request, res: Response) => {
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
  } catch (err: any) {
    res.status(500).json({ message: "Erreur d'ajout", error: err.message });
  }
});

export default router;
