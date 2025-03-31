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

  // Redirection si non connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push("/connexion");
    }
  }, [loading, user, router]);

  // Récupération des messages avec Axios
  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/contact", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setMessages(response.data);
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || error.message || "Erreur inconnue";
      setMessage(`Erreur : ${errMsg}`);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <motion.h1
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Messages reçus
      </motion.h1>

      {message && (
        <motion.div
          className="bg-red-500 text-white text-lg font-semibold rounded-lg p-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {message}
        </motion.div>
      )}

      {messages.length === 0 ? (
        <motion.p
          className="text-lg text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Aucun message pour le moment.
        </motion.p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {messages.map((msg) => (
            <motion.div
              key={msg._id}
              className="p-4 bg-gray-800 rounded-lg shadow-md space-y-2 transition-transform transform hover:scale-105 hover:bg-gray-700 hover:shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl font-semibold text-yellow-400 truncate">
                {msg.nom || msg.name || "Nom non disponible"}
              </h2>
              <p className="text-sm text-gray-400 truncate">{msg.email}</p>
              <p className="text-sm text-gray-300 line-clamp-3">{msg.message}</p>
              <p className="text-xs text-gray-500">
                Reçu le : {new Date(msg.date).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
