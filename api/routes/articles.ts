import express, { Request, Response, Router } from 'express';
import { ObjectId, Db, WithId, InsertOneResult } from 'mongodb';

const createRouter = (db: Db): Router => {
  const router = express.Router(); // Assurez-vous que le routeur est correctement initialisé

  interface Article {
    _id?: ObjectId;
    titre: string;
    auteur: string;
    contenu: string;
    image: string;
    date?: Date;
  }

  // Route pour récupérer tous les articles
  router.get('/', async (req: Request, res: Response) => {
    try {
      const articles: WithId<Article>[] = await db.collection<Article>('articles').find({}).toArray();
      res.json(articles);
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur de récupération des articles', error: error.message });
    }
  });

  // Route pour récupérer un article spécifique par ID
  router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    try {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID invalide' });
      }
      const article = await db.collection<Article>('articles').findOne({ _id: new ObjectId(id) });
      if (!article) {
        return res.status(404).json({ message: 'Article introuvable' });
      }
      res.json(article);
    } catch (error: any) {
      res.status(500).json({ message: "Erreur de récupération de l'article", error: error.message });
    }
  });

  // Route pour ajouter un nouvel article
  router.post('/', async (req: Request<{}, {}, Partial<Article>>, res: Response) => {
    const { titre, auteur, contenu, image } = req.body;

    if (!titre || !auteur || !contenu || !image) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    try {
      const newArticle: Omit<Article, '_id'> = { titre, auteur, contenu, image, date: new Date() };
      const result: InsertOneResult<Article> = await db.collection<Article>('articles').insertOne(newArticle);
      res.status(201).json({ message: 'Article ajouté avec succès.', articleId: result.insertedId });
    } catch (error: any) {
      res.status(500).json({ message: "Erreur lors de l'ajout de l'article.", error: error.message });
    }
  });

  return router; // Retournez le routeur configuré
};

export default createRouter;