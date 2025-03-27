import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = 'votre_clé_secrète'; // Remplacez par une clé secrète sécurisée

export default (db) => {
  // Route pour gérer la connexion des utilisateurs
  router.post('/login', async (req, res) => {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
      return res
        .status(400)
        .json({ message: 'Email et mot de passe sont obligatoires.' });
    }

    try {
      const utilisateur = await db.collection('utilisateurs').findOne({ email });

      if (!utilisateur) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }

      // Vérifier le mot de passe
      const motDePasseValide = await bcrypt.compare(
        motDePasse,
        utilisateur.motDePasse
      );

      if (!motDePasseValide) {
        return res.status(401).json({ message: 'Mot de passe incorrect.' });
      }

      // Générer un token JWT
      const token = jwt.sign(
        { id: utilisateur._id, email: utilisateur.email },
        SECRET_KEY,
        {
          expiresIn: '1h',
        }
      );

      res.status(200).json({ message: 'Connexion réussie.', token });
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      res.status(500).json({
        message: 'Erreur lors de la connexion.',
        error: error.message,
      });
    }
  });

  return router;
};