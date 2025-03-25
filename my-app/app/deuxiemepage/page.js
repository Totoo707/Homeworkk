"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des articles");
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <>
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
        Liste des Articles :
      </h2>

      {loading ? (
        <div className="text-xl text-gray-300">Chargement...</div>
      ) : (
        <div className="w-full max-w-7xl mx-auto">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {articles.length > 0 ? (
              articles.map((article) => (
                <li
                  key={article._id}
                  className="bg-white p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => router.push(`/deuxiemepage/${article._id}`)} // Redirige vers la bonne URL sans "/page"
                >
                  <h5 className="text-2xl font-semibold text-gray-800">
                    {article.titre}
                  </h5>
                  <p className="text-lg text-gray-600">
                    Auteur: {article.auteur}
                  </p>
                  <img
                    src={article.image}
                    alt={article.titre}
                    className="w-full h-48 object-cover rounded-lg mt-4"
                  />
                </li>
              ))
            ) : (
              <p className="col-span-4 text-xl text-gray-300">
                Aucun article trouvé.
              </p>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
