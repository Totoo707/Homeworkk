"use client";

import { useState } from "react";
import Link from "next/link";

export default function Page() {
  const [nom, setNom] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!nom || !age) {
      setMessage("Le nom et l'âge sont obligatoires.");
      return;
    }

    try {
      const response = await fetch("/api/utilisateurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, age }),
      });

      if (response.ok) {
        setNom("");
        setAge("");
        setMessage("Utilisateur ajouté avec succès!");
      } else {
        const errorData = await response.json();
        setMessage(`Ajout de l'utilisateur: ${errorData.message}`);
      }
    } catch (error) {
      setMessage(`Erreur de réseau: ${error.message}`);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white font-sans">
      {/* Fond animé */}
      <div
        className="absolute inset-0 z-0 opacity-20 bg-cover "
        style={{
          backgroundImage:
            "url('https://pluspng.com/img-png/stars-png-hd-stars-in-the-sky-looped-animation-beautiful-night-with-twinkling-flares-hd-1080-motion-background-videoblocks-1920.png')",
        }}
      ></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="bg-black/50 backdrop-blur-md py-6 px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider">
              Ajout d'un utilisateur
            </h1>
            <nav className="mt-4 md:mt-0">
              <ul className="flex space-x-8">
                <li>
                  <Link href="/" className="text-lg hover:text-yellow-400 transition">
                    Accueil 
                  </Link>
                </li>
                <li>
                  <Link href="/deuxiemepage" className="text-lg hover:text-yellow-400 transition">
                    Page 2
                  </Link>
                </li>
                <li>
                  <Link href="/troisiemepage" className="text-lg hover:text-yellow-400 transition">
                    Page 3
                  </Link>
                </li>
                <li>
                  <Link href="/pagelayout/" className="text-lg hover:text-yellow-400 transition">
                    Layout 1
                  </Link>
                </li>
                <li>
                  <Link href="/pagelayout/pagelayout2/" className="text-lg hover:text-yellow-400 transition">
                    Layout 2
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-grow flex flex-col items-center justify-center px-8 py-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            Ajouter un utilisateur
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
            onSubmit={handleAddUser}
            className="space-y-6 w-full max-w-lg p-6 bg-white rounded-3xl shadow-xl"
          >
            <div>
              <label htmlFor="nom" className="block text-xl font-medium text-gray-800">
                Nom
              </label>
              <input
                type="text"
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                placeholder="Nom de l'utilisateur"
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-xl font-medium text-gray-800">
                Âge
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-black"
                placeholder="Âge de l'utilisateur"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Ajouter Utilisateur
            </button>
          </form>
        </main>

        {/* FOOTER */}
        <footer className="bg-black/50 backdrop-blur-md py-6 px-8 text-center">
          <p className="text-base text-gray-300">© 2025 Next.js. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
