"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function ConnexionPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, motDePasse);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="w-full max-w-2xl p-12 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <h2 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Connexion
        </h2>

        {message && (
          <div className="bg-red-500 text-white text-lg font-semibold rounded-lg p-4 mb-6 shadow-md">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
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