"use client"; // Assure-toi que ce fichier utilise React en mode client

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext"; // Assure-toi d'importer correctement le contexte
import { useRouter } from "next/navigation"; // Utilisation de useRouter pour Next.js 13+
import { motion } from "framer-motion"; // Importation de framer-motion

export default function ConnexionPage() {
  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await login(email, motDePasse);
      setIsLoggedIn(true);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="w-full max-w-xl p-10 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          🔐 Connexion
        </motion.h2>

        {error && (
          <motion.div
            className="bg-red-500 text-white text-base font-medium rounded-xl p-4 mb-6 shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {error}
          </motion.div>
        )}

        {message && (
          <motion.div
            className="bg-red-500 text-white text-base font-medium rounded-xl p-4 mb-6 shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {message}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-4 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Entrez votre email"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="motDePasse" className="text-lg font-medium text-gray-300 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="motDePasse"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="p-4 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Entrez votre mot de passe"
            />
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            disabled={loading}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}