"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import ContactPopup from "./ContactPopup"; // Import du composant ContactPopup

export default function Header() {
  const { user, logout } = useAuth(); // Utilisation du contexte d'authentification
  const [isPopupOpen, setIsPopupOpen] = useState(false); // État pour gérer l'ouverture de la popup

  return (
    <>
      <header className="bg-black backdrop-blur-md py-6 px-8 top-0 left-0 w-full z-50">
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
                <button
                  onClick={() => setIsPopupOpen(true)} // Ouvre la popup
                  className="text-lg text-white hover:text-yellow-400 transition-colors duration-300"
                >
                  Contact
                </button>
              </li>
              {user && (
                <>
                  <li>
                    <Link
                      href="/troisiemepage"
                      className="text-lg text-white hover:text-yellow-400 transition-colors duration-300"
                    >
                      Ajouter un article
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/quatriemepage/voirmessage"
                      className="text-lg text-white hover:text-yellow-400 transition-colors duration-300"
                    >
                      Voir les messages
                    </Link>
                  </li>
                </>
              )}
              {user ? (
                <li>
                  <button
                    onClick={logout}
                    className="text-lg text-white hover:text-yellow-400 transition-colors duration-300"
                  >
                    Déconnexion
                  </button>
                </li>
              ) : (
                <li>
                  <Link
                    href="/connexion"
                    className="text-lg text-white hover:text-yellow-400 transition-colors duration-300"
                  >
                    Connexion
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Affichage de la popup */}
      {isPopupOpen && (
        <ContactPopup onClose={() => setIsPopupOpen(false)} /> // Ferme la popup
      )}
    </>
  );
}