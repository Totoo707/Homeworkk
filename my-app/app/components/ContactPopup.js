"use client";

import { useState } from "react";

export default function ContactPopup({ onClose }) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-900 p-8 rounded-3xl shadow-2xl w-full max-w-3xl relative">
        {/* Bouton pour fermer la popup */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
          ✖
        </button>

        <h3 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500">
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
              className="p-4 rounded-lg text-gray-900 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-300 transition duration-300 ease-in-out shadow-sm"
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
              className="p-4 rounded-lg text-gray-900 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-300 transition duration-300 ease-in-out shadow-sm"
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
              className="p-4 rounded-lg text-gray-900 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-300 transition duration-300 ease-in-out shadow-sm"
              placeholder="Votre message"
              rows="6"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-teal-300"
          >
            Envoyer le message
          </button>
        </form>
      </div>
    </div>
  );
}