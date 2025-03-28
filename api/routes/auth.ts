import express, { Request, Response } from "express";
import { Db } from "mongodb";
import bcrypt from "bcryptjs";

const createAuthRouter = (db: Db) => {
  const router = express.Router();

  // Route POST pour la connexion
  router.post("/login", async (req: Request, res: Response) => {
    const { email, motDePasse } = req.body;  // Assure-toi que ces données sont envoyées dans la requête

    if (!email || !motDePasse) {
      return res.status(400).json({ message: "Email et mot de passe sont requis." });
    }

    try {
      // Vérification si l'utilisateur existe dans la base de données
      const user = await db.collection("utilisateurs").findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Utilisateur non trouvé." });
      }

      // Vérification du mot de passe avec bcrypt
      const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);

      if (!isMatch) {
        return res.status(400).json({ message: "Mot de passe incorrect." });
      }

      // Connexion réussie, envoie les informations de l'utilisateur
      res.json({ user: { _id: user._id, email: user.email, nom: user.nom } });
    } catch (error: unknown) {
      // Si l'erreur est une instance d'Error, on l'affiche correctement
      if (error instanceof Error) {
        console.error("Erreur lors de la connexion :", error.message);
        return res.status(500).json({ message: "Erreur serveur.", error: error.message });
      } else {
        console.error("Erreur inconnue :", error);
        return res.status(500).json({ message: "Une erreur inconnue est survenue." });
      }
    }
  });

  return router;
};

export default createAuthRouter;
