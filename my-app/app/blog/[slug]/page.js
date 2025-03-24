"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function BlogPost() {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    if (slug) {
      console.log(`Fetching data for slug: ${slug}`);
      fetch(`http://localhost:4000/api/posts/${slug}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur réseau, impossible de charger l'article.");
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setPost(data);
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération de l'article:", error);
          setError("Impossible de charger cet article.");
        });
    }
  }, [slug]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white font-sans p-6">
      {/* Fond animé */}
      <div
        className="absolute inset-0 z-0 opacity-20 bg-cover"
        style={{
          backgroundImage:
            "url('https://pluspng.com/img-png/stars-png-hd-stars-in-the-sky-looped-animation-beautiful-night-with-twinkling-flares-hd-1080-motion-background-videoblocks-1920.png')",
        }}
      ></div>

      <div className="relative z-10 bg-black/50 backdrop-blur-lg p-10 rounded-xl shadow-xl max-w-3xl w-full text-center">
        {/* Gestion des erreurs et chargement */}
        {error ? (
          <p className="text-red-400 text-xl font-semibold">{error}</p>
        ) : !post ? (
          <p className="text-gray-300 text-lg animate-pulse">Chargement...</p>
        ) : (
          <>
            {/* Contenu de l'article */}
            <h1 className="text-4xl font-extrabold text-yellow-400">{post.title}</h1>
            <p className="text-lg mt-4 leading-relaxed">{post.content}</p>

            {/* Bouton retour */}
            <Link href="/blog">
              <button className="mt-6 px-8 py-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-400 transition duration-300 transform hover:scale-105 shadow-lg">
                Retour au Blog
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
