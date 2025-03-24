"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [showImage, setShowImage] = useState(false);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleButtonClick = () => {
    setShowImage(!showImage);
  };

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const response = await fetch("/api/utilisateurs");
        const data = await response.json();
        setUtilisateurs(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUtilisateurs();
  }, []);

  return (
    <>
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
        Liste des Utilisateurs :
      </h2>

      {loading ? (
        <div className="text-xl text-gray-300">Chargement...</div>
      ) : (
        <div className="w-full max-w-7xl mx-auto">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {utilisateurs.length > 0 ? (
              utilisateurs.map((utilisateur) => (
                <li
                  key={utilisateur._id}
                  className="bg-white p-6 rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300"
                >
                  <h5 className="text-2xl font-semibold text-gray-800">
                    {utilisateur.nom}
                  </h5>
                  <p className="text-lg text-gray-600">Âge: {utilisateur.age}</p>
                </li>
              ))
            ) : (
              <p className="col-span-4 text-xl text-gray-300">
                Aucun utilisateur trouvé.
              </p>
            )}
          </ul>
        </div>
      )}

      <button
        onClick={handleButtonClick}
        className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300 mt-8"
      >
        Voir plus
      </button>

      {showImage && (
        <div className="mt-8">
          <img
            src="https://cdn.photographylife.com/wp-content/uploads/2014/06/Nikon-D810-Image-Sample-6.jpg"
            alt="Sample"
            className="w-48 h-48 object-cover rounded-full shadow-2xl hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}
    </>
  );
}