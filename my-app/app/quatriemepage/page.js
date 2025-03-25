"use client";

import { useState } from "react";

export default function Page() {
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
      // Exemple d'envoi des données à une API (remplacez l'URL par votre endpoint)
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
    <main>
      {/* Contact Us Section */}
      <section className="bg-gradient-to-r from-yellow-500 to-pink-500 text-white p-10 rounded-3xl shadow-2xl mt-16 w-full max-w-5xl animate-fadeInUp">
        <h3 className="text-3xl font-semibold mb-6">Contactez-nous</h3>

        {responseMessage && (
          <div
            className={`${
              responseMessage.includes("succès") ? "bg-green-500" : "bg-red-500"
            } text-white text-lg font-semibold rounded-lg p-4 mb-6`}
          >
            {responseMessage}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-lg font-medium">
              Nom
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg text-black"
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-lg font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg text-black"
              placeholder="Votre email"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-lg font-medium">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-lg text-black"
              placeholder="Votre message"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Envoyer le message
          </button>
        </form>
      </section>
    </main>
  );
}