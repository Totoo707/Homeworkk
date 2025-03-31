import express from 'express';
import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();
const SECRET_KEY = 'votre_clé_secrète'; // à mettre en .env idéalement
// ✅ Schéma Mongoose
const utilisateurSchema = new Schema({
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    nom: { type: String },
});
const UtilisateurModel = mongoose.models.Utilisateur || model('Utilisateur', utilisateurSchema);
// ✅ Connexion Mongoose
const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect('mongodb://localhost:27017/maBaseDeDonnées');
    }
};
// ✅ POST /api/auth-mongoose/login
router.post('/login', async (req, res) => {
    const { email, motDePasse } = req.body;
    if (!email || !motDePasse) {
        return res
            .status(400)
            .json({ message: 'Email et mot de passe sont obligatoires.' });
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
        // Pour plus de sécurité, tu peux retirer le mot de passe du retour
        const utilisateurSansMotDePasse = {
            _id: utilisateur._id,
            email: utilisateur.email,
            nom: utilisateur.nom,
        };
        res.status(200).json({ user: utilisateurSansMotDePasse, token });
    }
    catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({
            message: 'Erreur lors de la connexion.',
            error: error.message,
        });
    }
});
export default router;
