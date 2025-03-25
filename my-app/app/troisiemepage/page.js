"use client";

import { useState } from "react";

export default function Page() {
  const [titre, setTitre] = useState("");
  const [auteur, setAuteur] = useState("");
  const [contenu, setContenu] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  const handleAddArticle = async (e) => {
    e.preventDefault();

    if (!titre || !auteur || !contenu || !image) {
      setMessage("Tous les champs sont obligatoires.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre, auteur, contenu, image }),
      });

      if (response.ok) {
        setTitre("");
        setAuteur("");
        setContenu("");
        setImage("");
        setMessage("Article ajouté avec succès !");
      } else {
        const errorData = await response.json();
        setMessage(`Erreur : ${errorData.message}`);
      }
    } catch (error) {
      setMessage(`Erreur de réseau : ${error.message}`);
    }
  };

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
              <label htmlFor="titre" className="block text-xl font-medium text-gray-800">
                Titre
              </label>
              <input
                type="text"
                id="titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                placeholder="Titre de l'article"
              />
            </div>

            <div>
              <label htmlFor="auteur" className="block text-xl font-medium text-gray-800">
                Auteur
              </label>
              <input
                type="text"
                id="auteur"
                value={auteur}
                onChange={(e) => setAuteur(e.target.value)}
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                placeholder="Nom de l'auteur"
              />
            </div>

            <div>
              <label htmlFor="contenu" className="block text-xl font-medium text-gray-800">
                Contenu
              </label>
              <textarea
                id="contenu"
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                placeholder="Contenu de l'article"
                rows="5"
              ></textarea>
            </div>

            <div>
              <label htmlFor="image" className="block text-xl font-medium text-gray-800">
                URL de l'image
              </label>
              <input
                type="text"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                placeholder="URL de l'image"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Ajouter Article
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}