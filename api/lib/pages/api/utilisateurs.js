import clientPromise from '../../../lib/mongodb';  // Remonte de deux niveaux pour accéder à api/lib

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db(); // Récupérer la base de données
  const utilisateursCollection = db.collection('utilisateurs'); // Récupérer la collection

  // Récupérer tous les utilisateurs
  const utilisateurs = await utilisateursCollection.find({}).toArray();

  res.status(200).json(utilisateurs);
}
