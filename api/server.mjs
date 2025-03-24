import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';  // Import de cors

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Autoriser uniquement les requêtes provenant de localhost:3000
app.use(cors({
  origin: 'http://localhost:3000'  // Frontend
}));

const posts = [
  { slug: "premier-article", title: "Mon Premier Article", content: "Ceci est le contenu de mon premier article." },
  { slug: "deuxieme-article", title: "Un Autre Article 2", content: "Ceci est le contenu de mon deuxième article." },
  { slug: "troisieme-article", title: "Testtttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt", content: "Ceci est le contenu de mon troisième article." },
];

// Serve blog post data
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// Serve individual blog post data
app.get('/api/posts/:slug', (req, res) => {
  const { slug } = req.params;
  const post = posts.find(p => p.slug === slug);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Article non trouvé' });
  }
});

// Serve individual blog post pages
app.get('/blog/:slug', (req, res) => {
  const { slug } = req.params;
  res.sendFile(path.join(__dirname, 'blog', slug, 'page.js'));
});

// Serve the main blog page
app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog', 'page.js'));
});

// Serve the second page
app.get('/deuxiemepage', (req, res) => {
  res.sendFile(path.join(__dirname, 'deuxiemepage', 'page.js'));
});

// Serve the home page
app.get('/', (req, res) => {
  res.status(200).send([
    { title: 'Page d\'accueil', content: 'Bienvenue sur notre site!' },
    { title: 'Nos services', content: 'Voici nos services disponibles.' },
    { title: 'Contactez-nous', content: 'Pour toute question, contactez-nous à l\'adresse 123 Rue du Paradis, 75000 Paris.' }
  ]);
});

// Start the server on port 4000
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Serveur en fonctionnement sur http://localhost:${PORT}`);
});