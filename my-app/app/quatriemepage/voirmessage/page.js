"use client";

import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Head from "next/head";

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

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  if (!user) return null;

  // Construction JSON‑LD 
  const jsonLd = {
    "@context": "http://schema.org",
    "@type": "ItemList",
    "itemListElement": messages.map((msg, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "EmailMessage",
        "sender": {
          "@type": "Person",
          "name": msg.nom || msg.name || "Nom non disponible",
          "email": msg.email
        },
        "dateSent": new Date(msg.date).toISOString(),
        "text": msg.message
      }
    }))
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          // Insertion JSON‑LD 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
        <motion.h1
          className="text-5xl font-extrabold text-center bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          📬 Messages Reçus
        </motion.h1>

        {message && (
          <motion.div
            className="bg-red-600 text-white text-lg font-semibold rounded-xl p-5 mb-8 shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {message}
          </motion.div>
        )}

        {messages.length === 0 ? (
          <motion.p
            className="text-xl text-gray-300 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Aucun message pour le moment.
          </motion.p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                className="bg-gray-800 p-6 rounded-3xl shadow-2xl hover:shadow-yellow-400/30 hover:scale-105 transition-all duration-300 space-y-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-yellow-400">
                  {msg.nom || msg.name || "Nom non disponible"}
                </h2>
                <p className="text-sm text-pink-400">📧 {msg.email}</p>
                <p className="text-base text-gray-200">📝 {msg.message}</p>
                <p className="text-sm text-gray-500">
                  🕒 Reçu le : {new Date(msg.date).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
        <motion.button
          type="button"
          className="w-full py-3 mt-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={() => router.push("/pageuser")}
        >
          ◀️ Retour
        </motion.button>
      </div>
    </>
  );
}
