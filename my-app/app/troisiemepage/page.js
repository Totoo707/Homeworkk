"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("");

  if (!loading && !user) {
    router.push("/connexion");
    return null;
  }

  const handleAddArticle = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const titre = e.target.titre.value;
    const contenu = e.target.contenu.value;
    const auteur = e.target.auteur.value;
    const image = e.target.image.files[0];

    if (!titre || !contenu || !auteur || !image) {
      setMessage("Tous les champs sont obligatoires.");
      return;
    }

    formData.append("titre", titre);
    formData.append("contenu", contenu);
    formData.append("auteur", auteur);
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/articles",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        setMessage("Article ajouté avec succès !");
        e.target.reset();
      } else {
        setMessage(`Erreur : ${response.data.message}`);
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || error.message;
      setMessage(`Erreur : ${errMsg}`);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 z-0" />

      <motion.div
        className="relative z-10 flex flex-col min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <main className="flex-grow flex flex-col items-center justify-center px-6 py-16">
          <motion.h2
            className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 text-center mb-10"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            📝 Ajouter un Nouvel Article
          </motion.h2>

          {message && (
            <motion.div
              className={`${
                message.includes("succès") ? "bg-green-500" : "bg-red-500"
              } text-white text-lg font-semibold rounded-xl p-4 mb-6 w-full max-w-lg shadow-lg`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {message}
            </motion.div>
          )}

          <motion.form
            onSubmit={handleAddArticle}
            className="space-y-6 w-full max-w-2xl p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {[{ label: "Titre", name: "titre", type: "text" }, { label: "Auteur", name: "auteur", type: "text" }].map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
              >
                <label htmlFor={field.name} className="block text-lg font-medium mb-2 text-gray-300">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder={field.label}
                />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <label htmlFor="image" className="block text-lg font-medium mb-2 text-gray-300">
                Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <label htmlFor="contenu" className="block text-lg font-medium mb-2 text-gray-300">
                Contenu
              </label>
              <textarea
                id="contenu"
                name="contenu"
                rows="6"
                className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Contenu de l'article"
              ></textarea>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full py-3 mt-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              🚀 Publier l'article
            </motion.button>
          </motion.form>
        </main>
      </motion.div>
    </div>
  );
}
