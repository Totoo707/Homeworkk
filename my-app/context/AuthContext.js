"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Stocke les informations de l'utilisateur
  const [loading, setLoading] = useState(true); // Indique si l'état d'authentification est en cours de chargement
  const router = useRouter();

  // Vérifie si l'utilisateur est connecté au chargement initial
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token }); // Simulez une vérification du token si nécessaire
    }
    setLoading(false);
  }, []);

  // Fonction pour se connecter
  const login = async (email, motDePasse) => {
    try {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, motDePasse }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token); // Stocker le token dans le localStorage
        setUser({ token: data.token }); // Mettre à jour l'état utilisateur
        router.push("/"); // Rediriger vers la page d'accueil
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error("Erreur de connexion :", error.message);
      throw error;
    }
  };

  // Fonction pour se déconnecter
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/connexion"); // Rediriger vers la page de connexion
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte d'authentification
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}