"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import ContactPopup from "./ContactPopup";

export default function Header() {
  const { user, logout } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <header className="top-0 left-0 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-lg shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
          <Link href="/" className="mb-3 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 tracking-wide">
              Next.js App
            </h1>
          </Link>

          <nav>
            <ul className="flex flex-wrap justify-center md:justify-end gap-6 text-white font-medium text-lg">
              <li>
                <Link
                  href="/"
                  className="hover:text-yellow-400 transition-colors duration-300"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/deuxiemepage"
                  className="hover:text-yellow-400 transition-colors duration-300"
                >
                  Articles
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="hover:text-yellow-400 transition-colors duration-300"
                >
                  Contact
                </button>
              </li>

              {user && (
                <>
                  <li>
                    <Link
                      href="/troisiemepage"
                      className="hover:text-yellow-400 transition-colors duration-300"
                    >
                      Ajouter un article
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/quatriemepage/voirmessage"
                      className="hover:text-yellow-400 transition-colors duration-300"
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
                    className="hover:text-red-400 transition-colors duration-300"
                  >
                    Déconnexion
                  </button>
                </li>
              ) : (
                <li>
                  <Link
                    href="/connexion"
                    className="hover:text-yellow-400 transition-colors duration-300"
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
      {isPopupOpen && <ContactPopup onClose={() => setIsPopupOpen(false)} />}
    </>
  );
}
