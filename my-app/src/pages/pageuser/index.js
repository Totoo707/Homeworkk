"use client";

import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function VoirMessage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/connexion");
    }
  }, [loading, user, router]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/contact", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessages(response.data);
    } catch (error) {
      const errMsg = error?.response?.data?.message || error.message || "Erreur inconnue";
      setMessage(`Erreur : ${errMsg}`);
    }
  };

  return (
    <div className="container">
     <motion.h1
        className="text-5xl mt-8 font-extrabold text-center bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🧑‍💻 Espace Utilisateur :
     </motion.h1>


     <motion.button
     
              type="submit"
              className="w-full opacity-70 py-3 mt-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => router.push("../pageuser/pagemdp")}
            >
              🔏 Modifier le mot de passe
    </motion.button>

    <motion.button
     
     type="submit"
     className="w-full opacity-70 py-3 mt-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
     whileHover={{ scale: 1.05 }}
     whileTap={{ scale: 0.95 }}
     transition={{ duration: 0.2 }}
     onClick={() => router.push("../troisiemepage")}
 >
     📰 Ajouter un article
  </motion.button>   

  <motion.button
     
     type="submit"
     className="w-full opacity-70 py-3 mt-4 mb-64 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
     whileHover={{ scale: 1.05 }}
     whileTap={{ scale: 0.95 }}
     transition={{ duration: 0.2 }}
     onClick={() => router.push("../quatriemepage/voirmessage")}
 >
     👀 Voir les messages des utilisateurs
  </motion.button>
   </div>  
    
  );
}