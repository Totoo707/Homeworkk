"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Ajout d'animations

export default function Page() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/articles");
        if (!response.ok) throw new Error("Erreur lors de la récupération des articles");
        
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (!isClient) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-2xl font-semibold text-white animate-pulse">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-8 py-16">
        <h2 className="text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 mb-16">
          📰 Liste des Articles
        </h2>

        <div className="w-full max-w-7xl mx-auto">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {articles.length > 0 ? (
              articles.map((article) => (
                <motion.li
                  key={article._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-800 p-6 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer group"
                  onClick={() => router.push(`/deuxiemepage/${article._id}`)}
                >
                  <img
                    src={article.image}
                    alt={article.titre}
                    className="w-full h-56 object-cover rounded-lg mb-4 group-hover:opacity-80 transition-opacity duration-300"
                  />
                  <h5 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                    {article.titre}
                  </h5>
                  <p className="text-lg text-gray-400 mt-2">
                    ✍️ <span className="font-semibold">{article.auteur}</span>
                  </p>
                </motion.li>
              ))
            ) : (
              <p className="col-span-4 text-2xl text-gray-300 text-center">
                Aucun article trouvé.
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
