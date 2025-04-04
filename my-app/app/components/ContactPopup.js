"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="bg-white text-gray-900 p-8 rounded-3xl shadow-xl w-full max-w-xl relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
        >
          ✖
        </button>

        {/* Title */}
        <motion.h3
          className="text-3xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600"
        >
          Contactez-nous
        </motion.h3>

        {/* Response Message */}
        {responseMessage && (
          <div
            className={`${
              responseMessage.includes("succès")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            } text-base font-medium rounded-xl px-4 py-3 mb-6`}
          >
            {responseMessage}
          </div>
        )}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block mb-2 text-lg text-gray-700 font-medium">
              Nom
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-4 focus:ring-teal-300 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-lg text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-4 focus:ring-teal-300 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-2 text-lg text-gray-700 font-medium">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message"
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-4 focus:ring-teal-300 focus:outline-none resize-none"
            ></textarea>
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition"
            whileTap={{ scale: 0.98 }}
          >
            Envoyer le message
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}
