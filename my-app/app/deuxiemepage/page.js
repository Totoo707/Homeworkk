"use client";

import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Axios fetcher pour SWR
const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Page() {
  const router = useRouter();

  const { data: articles, error, isLoading } = useSWR(
    "http://localhost:4000/api/articles",
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-2xl font-semibold text-white animate-pulse">
          Chargement...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400">
        Erreur lors du chargement des articles.
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-8 py-16">
        <motion.h2
          className="text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          📰 Liste des Articles
        </motion.h2>

        <div className="w-full max-w-7xl mx-auto">
          <motion.ul
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {articles?.length > 0 ? (
              articles.map((article) => (
                <motion.li
                  key={article._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-800 p-6 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer group"
                  onClick={() => router.push(`/deuxiemepage/${article._id}`)}
                >
                  <motion.img
                    src={article.image}
                    alt={article.titre}
                    className="w-full h-56 object-cover rounded-lg mb-4 group-hover:opacity-80 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.h5
                    className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7 }}
                  >
                    {article.titre}
                  </motion.h5>
                  <motion.p
                    className="text-lg text-gray-400 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    ✍️{" "}
                    <span className="font-semibold">{article.auteur}</span>
                  </motion.p>
                </motion.li>
              ))
            ) : (
              <motion.p
                className="col-span-4 text-2xl text-gray-300 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                Aucun article trouvé.
              </motion.p>
            )}
          </motion.ul>
        </div>
      </div>
    </div>
  );
}
