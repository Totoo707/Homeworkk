"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Page() {
  const [showImage, setShowImage] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleButtonClick = () => {
    setShowImage(!showImage);
  };

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("/api/cards");
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des cartes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white font-sans">
      {/* Fond animé */}
      <div
        className="absolute inset-0 z-0 opacity-20 bg-cover "
        style={{
          backgroundImage:
            "url('https://pluspng.com/img-png/stars-png-hd-stars-in-the-sky-looped-animation-beautiful-night-with-twinkling-flares-hd-1080-motion-background-videoblocks-1920.png')",
        }}
      ></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="bg-black/50 backdrop-blur-md py-6 px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider text-white">
              Next.js App
            </h1>
            <nav className="mt-4 md:mt-0">
              <ul className="flex space-x-8">
                <li>
                  <Link
                    href="/"
                    className="text-lg text-white hover:text-yellow-400 transition-colors duration-300"
                  >
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/deuxiemepage"
                    className="text-lg text-white hover:text-yellow-400 transition-colors duration-300"
                  >
                    Articles
                  </Link>
                </li>
                <li>
                  <Link
                    href="/troisiemepage"
                    className="text-lg text-white hover:text-yellow-400 transition-colors duration-300"
                  >
                    Ajout d'article
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-grow flex flex-col items-center justify-center px-8 py-16">
          <section className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to Next.js!
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Experience a modern web interface with seamless transitions, high performance, and a premium user experience.
            </p>
            <button
              onClick={handleButtonClick}
              className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Show More
            </button>
          </section>

          {showImage && (
            <section className="text-center mb-16 animate-fadeInUp">
              <img
                src="https://cdn.photographylife.com/wp-content/uploads/2014/06/Nikon-D810-Image-Sample-6.jpg"
                alt="Sample"
                className="mx-auto mb-6 w-48 h-48 object-cover rounded-full shadow-2xl hover:scale-110 transition-transform duration-500"
              />
            </section>
          )}

          {/* CARDS SECTION */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full max-w-6xl animate-fadeInUp">
            {loading ? (
              <div className="text-xl text-gray-300">Chargement...</div>
            ) : (
              cards.map((card) => (
                <div
                  key={card._id}
                  className="bg-white p-8 rounded-3xl shadow-xl hover:scale-105 transition-transform duration-300"
                >
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                    {card["Card Title"]}
                  </h3>
                  <p className="text-base text-gray-600">{card["Card p"]}</p>
                </div>
              ))
            )}
          </section>

          {/* AVIS SECTION */}
          <section className="bg-gradient-to-r from-yellow-500 to-pink-500 text-white p-10 rounded-3xl shadow-2xl mt-16 w-full max-w-5xl animate-fadeInUp">
            <h3 className="text-3xl font-semibold mb-6">What Users Are Saying</h3>
            <div className="space-y-6">
              <div className="bg-white text-black p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
                <p className="text-base">
                  "This app redefines modern web experiences – simply amazing!"
                </p>
                <p className="text-sm text-gray-500 mt-2">- User 1</p>
              </div>
              <div className="bg-white text-black p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
                <p className="text-base">
                  "A groundbreaking design and functionality. Highly recommend!"
                </p>
                <p className="text-sm text-gray-500 mt-2">- User 2</p>
              </div>
              <div className="bg-white text-black p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
                <p className="text-base">
                  "It truly changed the way we interact with web apps. Fantastic!"
                </p>
                <p className="text-sm text-gray-500 mt-2">- User 3</p>
              </div>
            </div>
          </section>

          {/* FEATURES SECTION  */}
          <section className="bg-gradient-to-r from-yellow-500 to-pink-500 text-white p-10 rounded-3xl shadow-2xl mt-16 w-full max-w-5xl animate-fadeInUp">
            <h3 className="text-3xl font-semibold mb-6">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300">
                <h4 className="text-2xl font-semibold text-gray-800 mb-3">Feature 1</h4>
                <p className="text-base text-gray-600">
                  Cutting-edge functionality that sets your app apart.
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300">
                <h4 className="text-2xl font-semibold text-gray-800 mb-3">Feature 2</h4>
                <p className="text-base text-gray-600">
                  Optimized performance, stunning visuals, and unmatched speed.
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300">
                <h4 className="text-2xl font-semibold text-gray-800 mb-3">Feature 3</h4>
                <p className="text-base text-gray-600">
                  Responsive design that works beautifully on any device.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Us Section */}
          <section className="bg-gradient-to-r from-yellow-500 to-pink-500 text-white p-10 rounded-3xl shadow-2xl mt-16 w-full max-w-5xl animate-fadeInUp">
            <h3 className="text-3xl font-semibold mb-6">Contact Us</h3>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-lg font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 rounded-lg text-black"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-lg font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 rounded-lg text-black"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-lg font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  className="w-full p-3 rounded-lg text-black"
                  placeholder="Your Message"
                  rows="4"
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
              >
                Send Message
              </button>
            </form>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="bg-black/50 backdrop-blur-md py-6 px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-base text-gray-300">
              © 2025 Next.js. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 mt-4">
              <Link
                href="https://twitter.com"
                className="text-lg text-gray-300 hover:text-pink-300 transition-colors duration-300"
              >
                Twitter
              </Link>
              <Link
                href="https://facebook.com"
                className="text-lg text-gray-300 hover:text-pink-300 transition-colors duration-300"
              >
                Facebook
              </Link>
              <Link
                href="https://instagram.com"
                className="text-lg text-gray-300 hover:text-pink-300 transition-colors duration-300"
              >
                Instagram
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
