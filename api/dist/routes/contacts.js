import express from 'express';
import mongoose, { Schema, model } from 'mongoose';
const router = express.Router();
// ✅ Schéma Mongoose
const contactSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
});
// ✅ Modèle Mongoose
const ContactModel = mongoose.models.Contact || model('Contact', contactSchema);
// ✅ Connexion Mongoose (une seule fois)
const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect('mongodb://localhost:27017/maBaseDeDonnées');
    }
};
// ✅ POST /api/contact-mongoose → Envoi d’un message
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;
    console.log('Données reçues :', req.body);
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }
    try {
        await connectDB();
        const newContact = new ContactModel({ name, email, message });
        const savedMessage = await newContact.save();
        res.status(201).json({
            message: 'Message envoyé avec succès.',
            contactId: savedMessage._id,
        });
    }
    catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
        res.status(500).json({
            message: "Erreur lors de l'envoi du message.",
            error: error.message,
        });
    }
});
// ✅ GET /api/contact-mongoose → Récupération des messages
router.get('/', async (_req, res) => {
    try {
        await connectDB();
        const messages = await ContactModel.find().sort({ date: -1 }); // tri décroissant
        res.json(messages);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des messages :', error);
        res.status(500).json({
            message: 'Erreur de récupération des messages',
            error: error.message,
        });
    }
});
export default router;
