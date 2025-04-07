import React, { createContext, useContext, useState, useEffect } from "react";

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
        body: JSON.stringify({ email, motDePasse: password }),
      });

      if (!response.ok) {
        throw new Error("Échec de la connexion. Vérifie tes informations.");
      }

      const data = await response.json();
      console.log("Utilisateur connecté :", data);
      // Stocker le token dans le localStorage
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  // Optionnel : charger l'utilisateur initial si le token existe déjà
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Ici, vous pourriez appeler une API pour récupérer les infos utilisateur
      setUser({ token });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
