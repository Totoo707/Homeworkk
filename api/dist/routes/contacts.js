import express from 'express';
const createRouter = (db) => {
    const router = express.Router();
    // Route pour envoyer un message de contact
    router.post('/', async (req, res) => {
        const { nom, email, message } = req.body;
        if (!nom || !email || !message) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
        }
        try {
            const result = await db.collection('contact').insertOne({
                nom,
                email,
                message,
                date: new Date(),
            });
            res.status(201).json({
                message: 'Message envoyé avec succès.',
                contactId: result.insertedId,
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
    // Route pour récupérer tous les messages de contact
    router.get('/', async (req, res) => {
        try {
            const messages = await db.collection('contact').find({}).toArray();
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
    return router;
};
export default createRouter;
