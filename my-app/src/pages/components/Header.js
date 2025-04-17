"use client";

import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
import ContactPopup from "./ContactPopup";

export default function Header() {
  const { user, logout } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <header className="top-0 left-0 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-lg shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col items-center">
          <Link href="/" className="mb-6" aria-label="Page d'accueil - Next.js App">
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 tracking-wide">
              Next.js App
            </h1>
          </Link>

          <nav aria-label="Menu principal">
            <ul className="flex flex-wrap justify-center gap-4">
              <li>
                <Link
                  href="/"
                  className="block px-10 py-6 text-white font-medium text-xl hover:text-yellow-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="../deuxiemepage"
                  className="block px-10 py-6 text-white font-medium text-xl hover:text-yellow-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  Articles
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="block px-10 py-6 text-white font-medium text-xl hover:text-yellow-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-haspopup="dialog"
                  aria-controls="contact-popup"
                >
                  Contact
                </button>
              </li>
              {user && (
                <li>
                  <Link
                    href="/pageuser"
                    className="block px-10 py-6 text-white font-medium text-xl hover:text-yellow-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    Utilisateur
                  </Link>
                </li>
              )}
              {user ? (
                <li>
                  <button
                    onClick={logout}
                    className="block px-10 py-6 text-white font-medium text-xl hover:text-red-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Déconnexion
                  </button>
                </li>
              ) : (
                <li>
                  <Link
                    href="/connexion"
                    className="block px-10 py-6 text-white font-medium text-xl hover:text-yellow-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    Connexion
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Contact Popup */}
      {isPopupOpen && (
        <ContactPopup onClose={() => setIsPopupOpen(false)} id="contact-popup" />
      )}
    </>
  );
}
