import clientPromise from '../../../lib/mongodb';  // Remonte de deux niveaux pour accéder à api/lib

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('maBaseDeDonnées'); // Récupérer la base de données
  const cardsCollection = db.collection('Cards'); // Récupérer la collection

  if (req.method === 'GET') {
    try {
      // Récupérer toutes les cartes
      const cards = await cardsCollection.find({}).toArray();
      res.status(200).json(cards);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des cartes', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}