"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Utilisation de useParams() pour récupérer l'ID

export default function ArticlePage() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Utilise useParams() pour récupérer l'ID de l'article

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          const response = await fetch(`/api/articles/${id}`);
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération de l'article");
          }
          const data = await response.json();
          setArticle(data);
        } catch (error) {
          console.error("Erreur lors de la récupération de l'article:", error);
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
      {/* Bouton retour avec un style plus interactif */}
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-400 text-white font-semibold rounded-lg shadow-xl hover:scale-105 transform transition-all duration-300"
        >
          Retour à la liste
        </button>
      </div>

      {/* Titre */}
      <h2 className="text-5xl font-extrabold text-gray-800 mb-6 text-center tracking-wide transition-transform duration-300 hover:text-teal-500 transform hover:scale-105">
        {article.titre}
      </h2>

      {/* Auteur */}
      <p className="text-2xl text-gray-700 mb-4 text-center">
        Par <span className="font-semibold">{article.auteur}</span>
      </p>

      {/* Image avec effet de zoom au survol */}
      <img
        src={article.image}
        alt={article.titre}
        className="w-full h-96 object-cover rounded-xl mb-6 hover:scale-105 transition-transform duration-500 ease-in-out shadow-xl"
      />

      {/* Contenu avec meilleure mise en forme */}
      <div className="text-lg text-gray-800 space-y-8 leading-relaxed">
        {article.contenu.map((paragraph, index) => (
          <p key={index} className="transition-opacity duration-300 hover:opacity-80">{paragraph}</p>
        ))}
      </div>

      {/* Footer avec des informations supplémentaires */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>Publié le : {new Date(article.date).toLocaleDateString()}</p>
        <p className="mt-4 text-gray-400">Merci de lire cet article !</p>
      </div>
    </div>
  );
}
