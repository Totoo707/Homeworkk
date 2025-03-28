import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, motDePasse: password }), // Remplace "password" par "motDePasse"
      });


      
      if (!response.ok) {
        throw new Error("Échec de la connexion. Vérifie tes informations.");
      }
      
      const data = await response.json();
      console.log("Utilisateur connecté :", data);
      setUser(data.user);
      setError(null); // Réinitialise les erreurs
    } catch (error) {
      setError(error.message); // Affiche le message d'erreur si échec de la connexion
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null); // Réinitialiser l'utilisateur lors de la déconnexion
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
