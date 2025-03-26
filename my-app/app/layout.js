"use client";

import { useState } from "react";
import Link from "next/link";
import "../app/globals.css"; // Import des styles globaux

export default function RootLayout({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setResponseMessage("Tous les champs sont obligatoires.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setName("");
        setEmail("");
        setMessage("");
        setResponseMessage("Message envoyé avec succès !");
      } else {
        const errorData = await response.json();
        setResponseMessage(`Erreur : ${errorData.message}`);
      }
    } catch (error) {
      setResponseMessage(`Erreur de réseau : ${error.message}`);
    }
  };

  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Next App</title>
      </head>
      <body>
        <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white font-sans">
          {/* Fond animé */}
          <div
            className="absolute inset-0 z-0 opacity-20 bg-cover"
            style={{
              backgroundImage:
                "url('https://pluspng.com/img-png/stars-png-hd-stars-in-the-sky-looped-animation-beautiful-night-with-twinkling-flares-hd-1080-motion-background-videoblocks-1920.png')",
            }}
          ></div>

          <div className="relative z-10 flex flex-col min-h-screen">
            {/* HEADER */}
            <header className="bg-black/50 backdrop-blur-md py-6 px-8">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                <Link href="/">
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider text-white cursor-pointer">
                    Next.js App
                  </h1>
                </Link>
                <nav className="mt-4 md:mt-0">
                  <ul className="flex space-x-8">
                    <li>
                      <Link
                        href="/"
                        className="text-lg text-white hover:text-yellow-400 transition-colors duration-300"
                      >
                        Accueil
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/deuxiemepage"
                        className="text-lg text-white hover:text-yellow-400 transition-colors duration-300"
                      >
                        Articles
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/troisiemepage"
                        className="text-lg text-white hover:text-yellow-400 transition-colors duration-300"
                      >
                        Ajout d'article
                      </Link>
                    </li>
                    <li>
                      {/* Lien pour ouvrir la popup */}
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-lg text-white hover:text-yellow-400 transition-colors duration-300"
                      >
                        Contact
                      </button>
                    </li>
                    <li>
                      <Link
                        href="/quatriemepage/voirmessage"
                        className="text-lg text-white hover:text-yellow-400 transition-colors duration-300"
                      >
                        Voir Le Contact
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center px-8 py-16">
              {children}
            </main>

            {/* FOOTER */}
            <footer className="bg-black/50 backdrop-blur-md py-6 px-8">
              <div className="max-w-7xl mx-auto text-center">
                <p className="text-base text-gray-300">
                  © 2025 Next.js. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </div>

        {/* Popup modale */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-3xl relative">
              {/* Bouton pour fermer la popup */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
              >
                ✖
              </button>

              <h3 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                Contactez-nous
              </h3>

              {responseMessage && (
                <div
                  className={`${
                    responseMessage.includes("succès")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  } text-lg font-semibold rounded-lg p-4 mb-6 shadow-md`}
                >
                  {responseMessage}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="text-lg font-medium text-gray-700 mb-2"
                  >
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-4 rounded-lg text-gray-900 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-300 ease-in-out shadow-sm"
                    placeholder="Votre nom"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="email"
                    className="text-lg font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-4 rounded-lg text-gray-900 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-300 ease-in-out shadow-sm"
                    placeholder="Votre email"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="message"
                    className="text-lg font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="p-4 rounded-lg text-gray-900 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-300 ease-in-out shadow-sm"
                    placeholder="Votre message"
                    rows="6"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-purple-300"
                >
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}