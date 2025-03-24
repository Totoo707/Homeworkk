"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/posts")
      .then((response) => response.json())
      .then((data) => {
        console.log("Données récupérées :", data);
        setPosts(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des posts :", error);
      });
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
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider animate-bounce">
              Blog
            </h1>
            <nav className="mt-4 md:mt-0">
              <ul className="flex space-x-8">
                <li>
                  <Link href="/" className="text-lg hover:text-yellow-400 transition">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="/deuxiemepage" className="text-lg hover:text-yellow-400 transition">
                    Page 2
                  </Link>
                </li>
                <li>
                  <Link href="/troisiemepage" className="text-lg hover:text-yellow-400 transition">
                    Page 3
                  </Link>
                </li>
                <li>
                  <Link href="/pagelayout/" className="text-lg hover:text-yellow-400 transition">
                    Layout 1
                  </Link>
                </li>
                <li>
                  <Link href="/pagelayout/pagelayout2/" className="text-lg hover:text-yellow-400 transition">
                    Layout 2
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-grow flex flex-col items-center justify-center px-8 py-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center animate-pulse">
            Bienvenue sur mon Blog
          </h2>

          <ul className="mt-4 space-y-6 w-full max-w-2xl">
            {posts.length === 0 ? (
              <p className="text-lg text-gray-300">Aucun article disponible</p>
            ) : (
              posts.map((post) => (
                <li
                  key={post.slug}
                  className="bg-white text-black p-6 rounded-3xl shadow-xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <a
                    href={`/blog/${post.slug}`}
                    className="text-pink-500 hover:underline text-xl md:text-2xl font-semibold break-words"
                  >
                    {post.title}
                  </a>
                </li>
              ))
            )}
          </ul>
        </main>

        {/* FOOTER */}
        <footer className="bg-black/50 backdrop-blur-md py-6 px-8 text-center">
          <p className="text-base text-gray-300">© 2025 Blog. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
