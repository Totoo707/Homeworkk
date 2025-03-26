"use client";

import { AuthProvider } from "../context/AuthContext"; // Import du AuthProvider
import Header from "../app/components/Header"; // Import du composant Header
import Footer from "../app/components/Footer"; // Import du composant Footer
import "../app/globals.css"; // Import des styles globaux

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="fr">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Next.js App</title>
        </head>
        <body>
          <Header />
          {/* Utilisation de classes responsives pour ajuster la marge */}
          <div className="pt-32 md:pt-24">{children}</div> {/* pt-32 sur mobile, pt-24 sur écrans moyens et plus */}
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}