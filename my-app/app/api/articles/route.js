import clientPromise from '../../../../api/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('maBaseDeDonnées'); // Remplace par le nom de ta base de données

    const articles = await db.collection('articles').find({}).toArray(); // Récupérer tous les articles
    return new Response(JSON.stringify(articles), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
    return new Response(JSON.stringify({ message: "Erreur de récupération des articles", error: error.message }), { status: 500 });
  }
}
