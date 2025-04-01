"use client";

import { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Page() {
  const [showImage, setShowImage] = useState(false);
  const { data: cards, error, isLoading } = useSWR("/api/cards", fetcher);

  const handleButtonClick = () => setShowImage(!showImage);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-sans overflow-hidden">
      {/* Fond animé */}
      <motion.div
        className="absolute inset-0 z-0 opacity-20 bg-cover"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2017/08/30/07/52/space-2695569_1280.jpg')",
        }}
        animate={{ y: ["0%", "5%"], opacity: [0.3, 0.1] }}
        transition={{ duration: 30, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
      />

      <div className="relative z-10 flex flex-col min-h-screen px-4">
        <main className="flex-grow flex flex-col items-center justify-center py-20">
          {/* INTRO */}
          <motion.section
            className="text-center mb-16 max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              🚀 Discover the Universe of Next.js
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              Immersive, performant and sleek — this is the frontend you were
              looking for.
            </motion.p>
            <motion.button
              onClick={handleButtonClick}
              className="px-8 py-3 text-lg bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-semibold rounded-full shadow-md hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showImage ? "Hide" : "Show More"}
            </motion.button>
          </motion.section>

          {/* IMAGE SECTION */}
          {showImage && (
            <motion.section
              className="mb-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.img
                src="https://cdn.photographylife.com/wp-content/uploads/2014/06/Nikon-D810-Image-Sample-6.jpg"
                alt="Sample"
                className="mx-auto w-48 h-48 object-cover rounded-full border-4 border-pink-500 shadow-2xl hover:scale-110 transition duration-500"
              />
            </motion.section>
          )}

          {/* CARDS SECTION */}
          <motion.section
            className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 1, staggerChildren: 0.2 },
              },
            }}
          >
            {isLoading ? (
              <p className="text-xl text-gray-400">Chargement des cartes...</p>
            ) : error ? (
              <p className="text-red-500 text-xl">Erreur de chargement</p>
            ) : (
              cards.map((card) => (
                <motion.div
                  key={card._id}
                  className="bg-gray-800 p-6 rounded-2xl shadow-xl hover:scale-105 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                    {card["Card Title"]}
                  </h3>
                  <p className="text-gray-300">{card["Card p"]}</p>
                </motion.div>
              ))
            )}
          </motion.section>

          {/* FEATURES SECTION */}
          <motion.section
            className="mt-20 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-3xl p-10 max-w-5xl shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-3xl font-semibold mb-6">✨ Nos Fonctionnalités</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {["Ultra Rapide", "Composants Dynamiques", "Design Réactif"].map(
                (feature, i) => (
                  <motion.div
                    key={i}
                    className="bg-white text-gray-900 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <h4 className="text-xl font-semibold mb-2">{feature}</h4>
                    <p className="text-gray-600 text-sm">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                  </motion.div>
                )
              )}
            </div>
          </motion.section>

          {/* AVIS SECTION */}
          <motion.section
            className="mt-20 bg-gradient-to-r from-yellow-500 to-pink-500 text-white rounded-3xl p-10 max-w-5xl shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-3xl font-semibold mb-6">🗣️ Avis Utilisateurs</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {["Sarah", "Lucas", "Emma"].map((name, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-100 p-6 rounded-xl shadow-md hover:scale-105 transition-transform"
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-gray-700 italic">
                    "Ce site m'a bluffé par sa rapidité et son design !"
                  </p>
                  <p className="mt-2 text-sm text-right text-gray-500">
                    — {name}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
}
