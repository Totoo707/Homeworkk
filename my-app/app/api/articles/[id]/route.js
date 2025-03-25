import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../api/lib/mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params; // Récupère l'ID de l'article dans les paramètres de l'URL

    // Vérifie si l'ID est valide
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ message: "ID invalide" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('maBaseDeDonnées'); // Remplace par le nom exact de ta base de données

    const article = await db.collection('articles').findOne({ _id: new ObjectId(id) }); // Recherche l'article par son ID

    if (!article) {
      return new Response(JSON.stringify({ message: "Article introuvable" }), { status: 404 });
    }

    return new Response(JSON.stringify(article), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article :", error);
    return new Response(JSON.stringify({ message: "Erreur serveur" }), { status: 500 });
  }
}
