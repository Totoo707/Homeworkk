"use client";

import { useState } from "react";

export default function VoirMessage() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // État pour vérifier si l'utilisateur est connecté
  const [messages, setMessages] = useState([]);

  // Fonction pour gérer la connexion
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !motDePasse) {
      setMessage("Email et mot de passe sont obligatoires.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, motDePasse }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token); // Stocker le token dans le localStorage
        setIsAuthenticated(true); // L'utilisateur est connecté
        setMessage("");
        fetchMessages(data.token); // Charger les messages après connexion
      } else {
        const errorData = await response.json();
        setMessage(`Erreur : ${errorData.message}`);
      }
    } catch (error) {
      setMessage(`Erreur de réseau : ${error.message}`);
    }
  };

  // Fonction pour récupérer les messages
  const fetchMessages = async (token) => {
    try {
      const response = await fetch("http://localhost:4000/api/contact", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Inclure le token JWT
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

  // Si l'utilisateur n'est pas connecté, afficher le formulaire de connexion
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
        <div className="w-full max-w-2xl p-12 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 transform transition duration-500 hover:scale-105">
          <h2 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Connexion
          </h2>
  
          {message && (
            <div className="bg-red-500 text-white text-lg font-semibold rounded-lg p-4 mb-6 shadow-md">
              {message}
            </div>
          )}
  
          <form onSubmit={handleLogin} className="space-y-8">
            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-lg font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-4 rounded-lg text-gray-900 border border-gray-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-300 ease-in-out"
                placeholder="Votre email"
              />
            </div>
  
            {/* Mot de passe */}
            <div className="flex flex-col">
              <label htmlFor="motDePasse" className="text-lg font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="motDePasse"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="p-4 rounded-lg text-gray-900 border border-gray-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-300 ease-in-out"
                placeholder="Votre mot de passe"
              />
            </div>
  
            {/* Bouton de connexion */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est connecté, afficher les messages
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