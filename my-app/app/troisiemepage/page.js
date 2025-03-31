"use client";

import { useAuth } from "../../context/AuthContext"; // Import du contexte d'authentification
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion"; // Importation de framer-motion

export default function Page() {
  const { user, loading } = useAuth(); // Utilisation du contexte d'authentification
  const router = useRouter();
  const [message, setMessage] = useState("");

  // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
  if (!loading && !user) {
    router.push("/connexion");
    return null;
  }

  // Fonction pour gérer l'ajout d'un article
  const handleAddArticle = async (e) => {
    e.preventDefault();

    const titre = e.target.titre.value;
    const contenu = e.target.contenu.value;
    const auteur = e.target.auteur.value;
    const image = e.target.image.value;

    if (!titre || !contenu || !auteur || !image) {
      setMessage("Tous les champs sont obligatoires.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Inclure le token JWT
        },
        body: JSON.stringify({ titre, contenu, auteur, image }),
      });

      if (response.ok) {
        setMessage("Article ajouté avec succès !");
        e.target.reset(); // Réinitialiser le formulaire
      } else {
        const errorData = await response.json();
        setMessage(`Erreur : ${errorData.message}`);
      }
    } catch (error) {
      setMessage(`Erreur de réseau : ${error.message}`);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white font-sans">
      <motion.div
        className="relative z-10 flex flex-col min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <main className="flex-grow flex flex-col items-center justify-center px-8 py-16">
          <motion.h2
            className="text-4xl font-bold mb-6 text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Ajouter un nouvel article
          </motion.h2>

          {message && (
            <motion.div
              className={`${message.includes("succès") ? "bg-green-500" : "bg-red-500"
                } text-white text-lg font-semibold rounded-lg p-4 mb-6`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {message}
            </motion.div>
          )}

          <motion.form
            onSubmit={handleAddArticle}
            className="space-y-6 w-full max-w-lg p-6 bg-white rounded-3xl shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <label htmlFor="titre" className="block text-lg font-medium text-gray-800">
                Titre
              </label>
              <input
                type="text"
                id="titre"
                name="titre"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                placeholder="Titre de l'article"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <label htmlFor="contenu" className="block text-lg font-medium text-gray-800">
                Contenu
              </label>
              <textarea
                id="contenu"
                name="contenu"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                placeholder="Contenu de l'article"
                rows="5"
              ></textarea>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label htmlFor="auteur" className="block text-lg font-medium text-gray-800">
                Auteur
              </label>
              <input
                type="text"
                id="auteur"
                name="auteur"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                placeholder="Nom de l'auteur"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <label htmlFor="image" className="block text-lg font-medium text-gray-800">
                URL de l'image
              </label>
              <input
                type="text"
                id="image"
                name="image"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                placeholder="URL de l'image"
              />
            </motion.div>

            <motion.button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-pink-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Ajouter l'article
            </motion.button>
          </motion.form>
        </main>
      </motion.div>
    </div>
  );
}
