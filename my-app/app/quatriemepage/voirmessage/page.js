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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Messages reçus</h1>

      {message && (
        <div className="bg-red-500 text-white text-lg font-semibold rounded-lg p-4 mb-6">
          {message}
        </div>
      )}

      {messages.length === 0 ? (
        <p className="text-lg">Aucun message pour le moment.</p>
      ) : (
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="p-6 bg-gray-800 rounded-lg shadow-lg space-y-2"
            >
              <h2 className="text-2xl font-semibold">{msg.nom}</h2>
              <p className="text-sm text-gray-400">{msg.email}</p>
              <p className="text-lg">{msg.message}</p>
              <p className="text-sm text-gray-500">
                Reçu le : {new Date(msg.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}