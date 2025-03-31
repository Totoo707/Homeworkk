"use client";

import { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";

// 👉 Axios + SWR : config du fetcher
const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Page() {
  const [showImage, setShowImage] = useState(false);

  // 👉 Remplace useEffect/fetch par SWR
  const { data: cards, error, isLoading } = useSWR("/api/cards", fetcher);

  const handleButtonClick = () => {
    setShowImage(!showImage);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white font-sans">
      {/* Fond animé */}
      <motion.div
        className="absolute inset-0 z-0 opacity-30 bg-cover"
        style={{
          backgroundImage:
            "url('https://pluspng.com/img-png/stars-png-hd-stars-in-the-sky-looped-animation-beautiful-night-with-twinkling-flares-hd-1080-motion-background-videoblocks-1920.png')",
        }}
        animate={{ y: ["0%", "5%"], opacity: [0.3, 0.1] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      ></motion.div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-grow flex flex-col items-center justify-center px-8 py-16">
          {/* SECTION INTRO */}
          <motion.section
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              Welcome to Next.js!
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              Experience a modern web interface with seamless transitions, high
              performance, and a premium user experience.
            </motion.p>
            <motion.button
              onClick={handleButtonClick}
              className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Show More
            </motion.button>
          </motion.section>

          {/* IMAGE SECTION */}
          {showImage && (
            <motion.section
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.img
                src="https://cdn.photographylife.com/wp-content/uploads/2014/06/Nikon-D810-Image-Sample-6.jpg"
                alt="Sample"
                className="mx-auto mb-6 w-48 h-48 object-cover rounded-full shadow-2xl hover:scale-110 transition-transform duration-500"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.section>
          )}

          {/* CARDS SECTION */}
          <motion.section
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full max-w-6xl"
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
              <div className="text-xl text-gray-300">Chargement...</div>
            ) : error ? (
              <div className="text-red-400 text-xl">
                Erreur de chargement des cartes.
              </div>
            ) : (
              cards.map((card) => (
                <motion.div
                  key={card._id}
                  className="bg-white p-8 rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.h3
                    className="text-2xl font-semibold text-gray-800 mb-3"
                    whileHover={{ scale: 1.05 }}
                  >
                    {card["Card Title"]}
                  </motion.h3>
                  <motion.p
                    className="text-base text-gray-600"
                    whileHover={{ scale: 1.05 }}
                  >
                    {card["Card p"]}
                  </motion.p>
                </motion.div>
              ))
            )}
          </motion.section>

          {/* FEATURES SECTION */}
          <motion.section
            className="bg-gradient-to-r from-yellow-500 to-pink-500 text-white p-10 rounded-3xl shadow-2xl mt-16 w-full max-w-5xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-3xl font-semibold mb-6">Les Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {["Feature 1", "Feature 2", "Feature 3"].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-8 rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <h4 className="text-2xl font-semibold text-gray-800 mb-3">
                    {feature}
                  </h4>
                  <p className="text-base text-gray-600">Voir les articles</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* AVIS SECTION */}
          <motion.section
            className="bg-gradient-to-r from-yellow-500 to-pink-500 text-white p-10 rounded-3xl shadow-2xl mt-16 w-full max-w-5xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-3xl font-semibold mb-6">
              What Users Are Saying
            </h3>
            <div className="space-y-6">
              {["User 1", "User 2", "User 3"].map((user, index) => (
                <motion.div
                  key={index}
                  className="bg-white text-black p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <p className="text-base">
                    "This app redefines modern web experiences – simply
                    amazing!"
                  </p>
                  <p className="text-sm text-gray-500 mt-2">- {user}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </main>
      </div>
    </div>
  );
}
