"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function ArticlePage() {
  const router = useRouter();
  const params = useParams(); // useParams retourne un objet
  const id = params?.id;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/articles/${id}`);
        if (!res.ok) throw new Error("Article introuvable");
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-bold text-gray-700 dark:text-gray-300 animate-pulse">
        Chargement...
      </div>
    );
  }

  if (error || !article) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-2xl text-red-500 mt-20 font-semibold"
      >
        {error || "Article introuvable"}
      </motion.div>
    );
  }

  // Utilisation de la route dédiée pour récupérer l'image
  const imageUrl = `http://localhost:4000/api/articles/${article._id}/image`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-xl mt-12"
    >
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
        >
          ← Retour
        </button>
      </div>

      {/* Affichage de l'image via la route dédiée */}
      <motion.img
        src={imageUrl}
        alt={article.titre}
        className="w-full h-96 object-cover rounded-lg mb-6 shadow-lg hover:scale-105 transition-transform duration-500"
        whileHover={{ scale: 1.05 }}
      />

      <div className="text-left">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4 hover:text-indigo-500 transition-colors duration-300">
          {article.titre}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          Par <span className="font-semibold">{article.auteur}</span> —{" "}
          <span className="italic">{new Date(article.date).toLocaleDateString()}</span>
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg text-gray-800 dark:text-gray-300 leading-relaxed space-y-6"
        >
          <p>{article.contenu}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
