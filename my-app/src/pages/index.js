"use client";

import { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Page() {
  const [showImage, setShowImage] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleButtonClick = () => setShowImage(!showImage);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-sans overflow-hidden">
      {/* Fond animé */}
      <motion.div
        className="absolute inset-0 z-0 opacity-20 bg-cover"
        style={{
          backgroundImage:
            "url('https://th.bing.com/th/id/OIP.wdh3zCQRIArltbkXOfrl8wHaE8?rs=1&pid=ImgDetMain')",
        }}
        animate={
          shouldReduceMotion
            ? {}
            : { y: ["0%", "5%"], opacity: [0.3, 0.1] }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 30, repeat: Infinity, repeatType: "reverse", ease: "linear" }
        }
      />

      <div className="relative z-10 flex flex-col min-h-screen px-4">
        <main className="flex-grow flex flex-col items-center justify-center py-20">
          {/* INTRO */}
          <motion.section
            className="text-center mb-16 max-w-3xl"
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 1 }}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent mb-4"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 1 }}
            >
              🚀 Discover the Universe of Next.js
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-300 mb-8"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.2 }}
            >
              Immersive, performant and sleek — this is the frontend you were
              looking for.
            </motion.p>
            <motion.button
              onClick={handleButtonClick}
              className="px-8 py-3 text-lg bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-semibold rounded-full shadow-md hover:scale-105 transition-transform duration-300"
              whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              aria-expanded={showImage}
              aria-controls="toggle-image"
            >
              {showImage ? "Hide" : "Show More"}
            </motion.button>
          </motion.section>

          {/* IMAGE SECTION */}
          {showImage && (
            <motion.section
              id="toggle-image"
              className="mb-16 text-center"
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 1 }}
            >
              <motion.img
                src="https://cdn.photographylife.com/wp-content/uploads/2014/06/Nikon-D810-Image-Sample-6.jpg"
                alt="Exemple d'image ile sur la mer "
                className="mx-auto w-48 h-48 object-cover rounded-full border-4 border-pink-500 shadow-2xl hover:scale-110 transition duration-500"
              />
            </motion.section>
          )}

          {/* FEATURES SECTION */}
          <motion.section
            aria-labelledby="features-heading"
            className="mt-20 bg-gradient-to-r from-pink-500 to-yellow-500 text-white rounded-3xl p-10 max-w-5xl shadow-xl"
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 1 }}
          >
            <h3 id="features-heading" className="text-3xl font-semibold mb-6">
              ✨ Nos Fonctionnalités
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {["Ultra Rapide", "Composants Dynamiques", "Design Réactif"].map(
                (feature, i) => (
                  <motion.div
                    key={i}
                    className="bg-white text-gray-900 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
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
            aria-labelledby="reviews-heading"
            className="mt-20 bg-gradient-to-r from-yellow-500 to-pink-500 text-white rounded-3xl p-10 max-w-5xl shadow-xl"
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 1 }}
          >
            <h3 id="reviews-heading" className="text-3xl font-semibold mb-6">
              🗣️ Avis Utilisateurs
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {["Sarah", "Lucas", "Emma"].map((name, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-100 p-6 rounded-xl shadow-md hover:scale-105 transition-transform"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
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
