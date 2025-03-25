import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  try {
    const { id } = req.query;
    const { db } = await connectToDatabase();
    const article = await db.collection("articles").findOne({ _id: new ObjectId(id) });

    if (!article) {
      return res.status(404).json({ message: "Article introuvable" });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
