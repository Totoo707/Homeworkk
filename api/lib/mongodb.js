import { MongoClient } from 'mongodb';

// TODO ça c'est bien c'est censé etre se que tu utilise pour instancier ta connexion mongo puis apres l'u'iliser dans toute tes requetes

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let clientPromise;

if (process.env.NODE_ENV === 'development') {
  clientPromise = client;
} else {
  clientPromise = client.connect();
}

export default clientPromise;
