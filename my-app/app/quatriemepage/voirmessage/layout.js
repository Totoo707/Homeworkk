// app/layout.js
import '../../globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Next App',
  description: 'Mon application Next.js avec pages dynamiques',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <title>{metadata.title}</title>
      </head>
      <body>
        <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white font-sans">
          {/* Fond animé */}
          <div
            className="absolute inset-0 z-0 opacity-20 bg-cover"
            style={{
              backgroundImage:
                "url('https://pluspng.com/img-png/stars-png-hd-stars-in-the-sky-looped-animation-beautiful-night-with-twinkling-flares-hd-1080-motion-background-videoblocks-1920.png')",
            }}
          ></div>

          <div className="relative z-10 flex flex-col min-h-screen">
            {/* HEADER */}
            <header className="bg-black/50 backdrop-blur-md py-6 px-8">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
              <Link href="/">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider text-white cursor-pointer">
                  Next.js App
                </h1>
              </Link>
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
                    <li>
                  <Link
                    href="/quatriemepage"
                    className="text-lg text-white hover:text-yellow-400 transition-colors duration-300"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/quatriemepage/voirmessage"
                    className="text-lg text-white hover:text-yellow-400 transition-colors duration-300"
                  >
                    Voir Le Contact
                  </Link>
                </li>
                  </ul>
                </nav>
              </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center px-8 py-16">
              {children}
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
      </body>
    </html>
  );
}