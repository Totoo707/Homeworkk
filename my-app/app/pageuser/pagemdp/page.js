"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function ModifierMotDePasse() {
  const router = useRouter();
  const [ancienMotDePasse, setAncienMotDePasse] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      console.log("Token dans useEffect :", token);
      
      if (!token || token === "null" || token.trim() === "") {
        setMessage("Vous n'êtes pas connecté, veuillez vous connecter.");
        router.push("/connexion");
      }
    }
  }, [router]);

 
  if (!isMounted) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nouveauMotDePasse !== confirmationMotDePasse) {
      setMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token récupéré dans handleSubmit :", token);

      const response = await axios.post(
        "http://localhost:4000/api/auth/change-password",
        {
          ancienMotDePasse,
          nouveauMotDePasse,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Réponse du serveur :", response.data);
      setMessage("Mot de passe modifié avec succès !");
      setTimeout(() => router.push("/pageuser"), 2000);
    } catch (error) {
      console.error("Erreur lors de la modification du mot de passe :", error);
      const errMsg =
        error?.response?.data?.message ||
        error.message ||
        "Erreur inconnue lors de la modification.";
      setMessage(`Erreur : ${errMsg}`);
    }
  };

  return (
    <div className="container">
      <motion.h1
        className="text-5xl mt-4 font-extrabold text-center bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🧑‍💻 Modifier le Mot de passe :
      </motion.h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="password"
          placeholder="Ancien mot de passe"
          value={ancienMotDePasse}
          onChange={(e) => setAncienMotDePasse(e.target.value)}
          className="w-full p-3 border rounded-lg text-black"
          required
        />
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={nouveauMotDePasse}
          onChange={(e) => setNouveauMotDePasse(e.target.value)}
          className="w-full p-3 border rounded-lg text-black"
          required
        />
        <input
          type="password"
          placeholder="Confirmer le nouveau mot de passe"
          value={confirmationMotDePasse}
          onChange={(e) => setConfirmationMotDePasse(e.target.value)}
          className="w-full p-3 border rounded-lg text-black"
          required
        />
        <motion.button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          Modifier le mot de passe
        </motion.button>
      </form>

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}

      <motion.button
        type="button"
        className="w-full py-3 mt-4 mb-40 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={() => router.push("/pageuser")}
      >
        ◀️ Retour
      </motion.button>
    </div>
  );
}
