"use client";

import { useAuth } from "../../../context/AuthContext"; // Import du contexte d'authentification
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function VoirMessage() {
  const { user, loading } = useAuth(); // Utilisation du contexte d'authentification
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push("/connexion");
    }
  }, [loading, user, router]);

  // Fonction pour récupérer les messages
  const fetchMessages = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/contact", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Inclure le token JWT
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        const errorData = await response.json();
        setMessage(`Erreur : ${errorData.message}`);
      }
    } catch (error) {
      setMessage(`Erreur de réseau : ${error.message}`);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  if (!user) {
    return null; // Empêche le rendu tant que l'utilisateur n'est pas connecté
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Messages reçus</h1>

      {message && (
        <div className="bg-red-500 text-white text-lg font-semibold rounded-lg p-4 mb-6">
          {message}
        </div>
      )}

      {messages.length === 0 ? (
        <p className="text-lg text-center">Aucun message pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="p-4 bg-gray-800 rounded-lg shadow-md space-y-2 transition-transform transform hover:scale-105 hover:bg-gray-700 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold text-yellow-400 truncate">
                {msg.nom}
              </h2>
              <p className="text-sm text-gray-400 truncate">{msg.email}</p>
              <p className="text-sm text-gray-300 line-clamp-3">
                {msg.message}
              </p>
              <p className="text-xs text-gray-500">
                Reçu le : {new Date(msg.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}