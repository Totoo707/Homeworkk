"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ArticlePage() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          // Appel au serveur Express
          const response = await fetch(`http://localhost:4000/api/articles/${id}`);
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération de l'article");
          }
          const data = await response.json();
          setArticle(data);
        } catch (error) {
          console.error("Erreur lors de la récupération de l'article :", error);
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold text-gray-600">
        Chargement...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center text-xl text-red-500 mt-20">
        Article introuvable
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-8 bg-gradient-to-r from-blue-100 via-indigo-200 to-pink-300 rounded-lg shadow-2xl mt-12">
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-400 text-white font-semibold rounded-lg shadow-xl hover:scale-105 transform transition-all duration-300"
        >
          Retour à la liste
        </button>
      </div>

      {/* Image */}
      <img
        src={article.image}
        alt={article.titre}
        className="w-full h-96 object-cover rounded-xl mb-6 hover:scale-105 transition-transform duration-500 ease-in-out shadow-xl"
      />

      <div className="text-left">
        {/* Titre de l'article */}
        <h2 className="text-5xl font-extrabold text-gray-800 mb-4 tracking-wide transition-transform duration-300 hover:text-teal-500 transform hover:scale-105">
          {article.titre}
        </h2>

        {/* Auteur et date */}
        <div className="text-xl text-gray-700 mb-4">
          <p>
            Par <span className="font-semibold">{article.auteur}</span> -{" "}
            <span className="italic">{new Date(article.date).toLocaleDateString()}</span>
          </p>
        </div>

        {/* Contenu de l'article */}
        <div className="text-lg text-gray-800 space-y-8 leading-relaxed">
          <p>{article.contenu}</p>
        </div>

        {/* Footer avec remerciements */}
        <div className="mt-12 text-gray-500 text-sm">
          <p className="mt-4 text-gray-400">Merci de lire cet article !</p>
        </div>
      </div>
    </div>
  );
}
