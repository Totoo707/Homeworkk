"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // État pour vérifier si l'utilisateur est connecté
  const router = useRouter();

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
      } else {
        const errorData = await response.json();
        setMessage(`Erreur : ${errorData.message}`);
      }
    } catch (error) {
      setMessage(`Erreur de réseau : ${error.message}`);
    }
  };

  // Fonction pour gérer l'ajout d'un article
  const handleAddArticle = async (e) => {
    e.preventDefault();

    const titre = e.target.titre.value;
    const contenu = e.target.contenu.value;
    const auteur = e.target.auteur.value;
    const image = e.target.image.value;

    if (!titre || !contenu || !auteur || !image) {
      setMessage("Tous les champs sont obligatoires.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Inclure le token JWT
        },
        body: JSON.stringify({ titre, contenu, auteur, image }),
      });

      if (response.ok) {
        setMessage("Article ajouté avec succès !");
        e.target.reset(); // Réinitialiser le formulaire
      } else {
        const errorData = await response.json();
        setMessage(`Erreur : ${errorData.message}`);
      }
    } catch (error) {
      setMessage(`Erreur de réseau : ${error.message}`);
    }
  };

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

  // Si l'utilisateur est connecté, afficher le formulaire pour ajouter un article
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white font-sans">
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-grow flex flex-col items-center justify-center px-8 py-16">
          <h2 className="text-4xl font-bold mb-6 text-center">
            Ajouter un nouvel article
          </h2>

          {message && (
            <div
              className={`${
                message.includes("succès") ? "bg-green-500" : "bg-red-500"
              } text-white text-lg font-semibold rounded-lg p-4 mb-6`}
            >
              {message}
            </div>
          )}

          <form
            onSubmit={handleAddArticle}
            className="space-y-6 w-full max-w-lg p-6 bg-white rounded-3xl shadow-xl"
          >
            <div>
              <label htmlFor="titre" className="block text-lg font-medium text-gray-800">
                Titre
              </label>
              <input
                type="text"
                id="titre"
                name="titre"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                placeholder="Titre de l'article"
              />
            </div>

            <div>
              <label htmlFor="contenu" className="block text-lg font-medium text-gray-800">
                Contenu
              </label>
              <textarea
                id="contenu"
                name="contenu"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                placeholder="Contenu de l'article"
                rows="5"
              ></textarea>
            </div>

            <div>
              <label htmlFor="auteur" className="block text-lg font-medium text-gray-800">
                Auteur
              </label>
              <input
                type="text"
                id="auteur"
                name="auteur"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                placeholder="Nom de l'auteur"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-lg font-medium text-gray-800">
                URL de l'image
              </label>
              <input
                type="text"
                id="image"
                name="image"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                placeholder="URL de l'image"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-pink-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform"
            >
              Ajouter l'article
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}