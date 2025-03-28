import express, { Request, Response } from 'express';
import { Db } from 'mongodb';
const router = express.Router();

interface ContactMessage {
    name: string;
    email: string;
    message: string;
}

export default (db: Db) => {
    // Route pour envoyer un message de contact
    router.post('/', async (req: Request<{}, {}, ContactMessage>, res: Response) => {
        const { name, email, message } = req.body;
        console.log('Données reçues :', req.body); // Log pour déboguer les données reçues
        
        if (!name || !email || !message) {
          return res
             .status(400)
               .json({ message: 'Tous les champs sont obligatoires.' });
           }
     

        try {
            const result = await db.collection('contact').insertOne({
                name,
                email,
                message,
                date: new Date(),
            });
            res.status(201).json({
                message: 'Message envoyé avec succès.',
                contactId: result.insertedId,
            });
        } catch (error:any) {
            console.error("Erreur lors de l'envoi du message :", error);
            res.status(500).json({
                message: "Erreur lors de l'envoi du message.",
                error: error.message,
            });
        }
    });


    // Route pour récupérer tous les messages de contact
    router.get('/', async (req: Request, res: Response) => {
        try {
            const messages = await db.collection('contact').find({}).toArray();
            res.json(messages);
        } catch (error:any) {
            console.error('Erreur lors de la récupération des messages :', error);
            res.status(500).json({
                message: 'Erreur de récupération des messages',
                error: error.message,
            });
        }
    });

    return router;
};
