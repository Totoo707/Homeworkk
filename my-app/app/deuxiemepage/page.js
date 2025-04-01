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
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-white">
      {/* Fond décoratif animé */}
      <motion.div
        className="absolute inset-0 z-0 opacity-20 bg-cover blur-sm"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/photos-premium/etoiles-dans-ciel-lumiere-etoilee-nuit-etoilee-voie-lactee-arriere-plan-cosmique-espace-arriere-plan-etoile_303714-980.jpg?w=1480')",
        }}
        animate={{ y: ["0%", "5%"], opacity: [0.2, 0.1] }}
        transition={{
          duration: 40,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.h2
          className="text-5xl lg:text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          📰 Tous les Articles
        </motion.h2>

        <div className="w-full max-w-7xl mx-auto">
          <motion.ul
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, duration: 0.5 },
              },
            }}
          >
            {articles?.length > 0 ? (
              articles.map((article) => (
                <motion.li
                  key={article._id}
                  className="bg-gray-800 p-6 rounded-3xl shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                  onClick={() => router.push(`/deuxiemepage/${article._id}`)}
                  whileHover={{ y: -5 }}
                >
                  <motion.img
                    src={article.image}
                    alt={article.titre}
                    className="w-full h-52 object-cover rounded-2xl mb-4 group-hover:opacity-85 transition-opacity duration-300"
                  />
                  <motion.h5
                    className="text-2xl font-bold text-white group-hover:text-yellow-400"
                  >
                    {article.titre}
                  </motion.h5>
                  <motion.p className="text-md text-gray-400 mt-1">
                    ✍️ <span className="font-medium">{article.auteur}</span>
                  </motion.p>
                </motion.li>
              ))
            ) : (
              <motion.p className="col-span-full text-2xl text-gray-300 text-center">
                Aucun article trouvé.
              </motion.p>
            )}
          </motion.ul>
        </div>
      </div>
    </div>
  );
}
