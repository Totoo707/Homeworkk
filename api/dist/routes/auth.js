import express from 'express';
import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'votre_clé_secrète'; // Idéalement dans un .env
// Schéma Mongoose
const utilisateurSchema = new Schema({
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    nom: { type: String },
});
const UtilisateurModel = mongoose.models.Utilisateur || model('Utilisateur', utilisateurSchema);
// Fonction de connexion à MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maBaseDeDonnées');
    }
};
// Route de connexion (login)
router.post('/login', async (req, res) => {
    const { email, motDePasse } = req.body;
    if (!email || !motDePasse) {
        return res.status(400).json({ message: 'Email et mot de passe sont obligatoires.' });
    }
    try {
        await connectDB();
        const utilisateur = await UtilisateurModel.findOne({ email });
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
        if (!motDePasseValide) {
            return res.status(401).json({ message: 'Mot de passe incorrect.' });
        }
        const token = jwt.sign({ id: utilisateur._id, email: utilisateur.email }, SECRET_KEY, { expiresIn: '1h' });
        // Retourne l'utilisateur sans le mot de passe et le token
        const utilisateurSansMotDePasse = {
            _id: utilisateur._id,
            email: utilisateur.email,
            nom: utilisateur.nom,
        };
        res.status(200).json({ user: utilisateurSansMotDePasse, token });
    }
    catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({ message: 'Erreur lors de la connexion.', error: error.message });
    }
});
// Route de changement de mot de passe
router.post('/change-password', async (req, res) => {
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;
    if (!ancienMotDePasse || !nouveauMotDePasse) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }
    try {
        await connectDB();
        console.log('Connexion à la base de données réussie.');
        // Récupére le token depuis les headers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token manquant.' });
        }
        // Décodage du token
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('Token décodé :', decoded);
        const utilisateur = await UtilisateurModel.findById(decoded.id);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
        console.log('Utilisateur trouvé :', utilisateur);
        // Vérification de l'ancien mot de passe
        const motDePasseValide = await bcrypt.compare(ancienMotDePasse, utilisateur.motDePasse);
        console.log('Résultat de la comparaison des mots de passe :', motDePasseValide);
        if (!motDePasseValide) {
            return res.status(401).json({ message: 'Ancien mot de passe incorrect.' });
        }
        // crypte le nouveau mot de passe
        const hash = await bcrypt.hash(nouveauMotDePasse, 10);
        utilisateur.motDePasse = hash;
        // Sauvegarde dans la bdd
        await utilisateur.save();
        console.log('Mot de passe modifié avec succès.');
        res.status(200).json({ message: 'Mot de passe modifié avec succès.' });
    }
    catch (error) {
        console.error('Erreur lors de la modification du mot de passe :', error);
        res.status(500).json({
            message: 'Erreur lors de la modification du mot de passe.',
            error: error.message,
        });
    }
});
export default router;
