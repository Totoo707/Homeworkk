"use client";

import { AuthProvider } from "../context/AuthContext"; // Import du AuthProvider
import Header from "../app/components/Header"; // Import du composant Header
import Footer from "../app/components/Footer"; // Import du composant Header
import "../app/globals.css"; // Import des styles globaux

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="fr">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0 " />
          <title>Next.js App</title>
        </head>
        <body> <br></br><br></br><br></br>
          <Header /> {/* Ajout du Header */}
          {children}
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}