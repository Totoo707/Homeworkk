import clientPromise from '../../../../api/lib/mongodb';  // Remonte de deux niveaux vers le dossier 'lib'

export async function GET() {
  try {
    console.log("Connexion à la base de données...");
    const client = await clientPromise;
    const db = client.db('maBaseDeDonnées');

    console.log("Connexion réussie. Récupération des cartes...");
    const cards = await db.collection('Cards').find().toArray();
    
    console.log("Cartes récupérées:", cards);
    return new Response(JSON.stringify(cards), { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des cartes:", error);
    return new Response(JSON.stringify({ message: "Erreur de récupération des cartes", error: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log("Connexion à la base de données...");
    const client = await clientPromise;
    const db = client.db('maBaseDeDonnées');

    const { title, description } = await request.json();
    console.log("Données reçues:", { title, description });

    const result = await db.collection('Cards').insertOne({ title, description });
    console.log("Carte ajoutée:", result.ops[0]);

    return new Response(JSON.stringify(result.ops[0]), { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la carte:", error);
    return new Response(JSON.stringify({ message: "Erreur lors de l'ajout de la carte", error: error.message }), { status: 500 });
  }
}