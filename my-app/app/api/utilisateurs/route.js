import clientPromise from '../../../../api/lib/mongodb';  // Remonte de deux niveaux vers le dossier 'lib'

export async function GET() {
  try {
    console.log("Connexion à la base de données...");
    const client = await clientPromise;
    const db = client.db('maBaseDeDonnées');
    console.log("Connexion réussie. Récupération des utilisateurs...");
    const utilisateurs = await db.collection('utilisateurs').find().toArray();
    console.log("Utilisateurs récupérés:", utilisateurs);
    return new Response(JSON.stringify(utilisateurs), { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);  // Ajout du log
    return new Response(JSON.stringify({ message: "Erreur de récupération des utilisateurs", error: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log("Connexion à la base de données...");
    const client = await clientPromise;
    const db = client.db('maBaseDeDonnées');
    console.log("Connexion réussie. Ajout d'un utilisateur...");

    const { nom, age } = await request.json();
    console.log("Nom et âge reçus:", nom, age);  // Log des données envoyées

    const result = await db.collection('utilisateurs').insertOne({ nom, age });
    console.log("Utilisateur ajouté:", result.ops[0]); // Log du résultat

    return new Response(JSON.stringify(result.ops[0]), { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur:", error);  // Ajout du log détaillé
    return new Response(JSON.stringify({ message: "Erreur lors de l'ajout de l'utilisateur", error: error.message }), { status: 500 });
  }
}
