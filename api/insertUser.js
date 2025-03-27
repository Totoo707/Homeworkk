import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

// TODO : quand tu creer ta connexion  a mongo dasn server.mjs tu creer une instane de connexion et normalement apres tu peut l'utilser sans avoir besoin de refaire une connexion achaque fois

// Remplacez par votre URI MongoDB avec authentification
const uri =
  'mongodb://thomas:monMotDePasse@localhost:27017/maBaseDeDonnées?authSource=maBaseDeDonnées';
const client = new MongoClient(uri);

// TODO : tous tes utilisateurs sont les meme , tu dois pouvoir passer des parametre en argument de ta fonction pour alimenter les champs de ton utilisateur
async function createUser() {
  try {
    // Connexion au serveur MongoDB
    await client.connect();
    const db = client.db('maBaseDeDonnées');

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash('1234', 10); // Mot de passe en clair : "1234"

    // Création de l'utilisateur
    const newUser = {
      nom: 'Thomas',
      email: 'thomas@example.com',
      motDePasse: hashedPassword,
      dateCreation: new Date(), // Ajout de la date de création
    };

    // Insertion de l'utilisateur dans la collection "utilisateurs"
    const result = await db.collection('utilisateurs').insertOne(newUser);
    console.log('Utilisateur ajouté avec succès :', result.insertedId);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur :", error);
  } finally {
    // Fermeture de la connexion au serveur MongoDB
    await client.close();
  }
}

createUser();
