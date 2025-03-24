import '../globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Next App',
  description: 'Mon application Next.js avec pages dynamiques',
};

export default function PageLayout({ children }) {
  return (
    <>
      {/* smoke background */}
      <div className="smoke-background"></div>

      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 shadow-lg relative z-10">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-4xl font-extrabold tracking-wide uppercase">Next.js App</h1>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="hover:text-yellow-400 transition duration-300 text-lg font-medium">
                  Page d'accueil
                </Link>
              </li>
              <li>
                <Link href="/deuxiemepage" className="hover:text-yellow-400 transition duration-300 text-lg font-medium">
                  Page 2
                </Link>
              </li>
              <li>
                <Link href="/troisiemepage" className="hover:text-yellow-400 transition duration-300 text-lg font-medium">
                  Page 3
                </Link>
              </li>
              <li>
                <Link href="/pagelayout/" className="hover:text-yellow-400 transition duration-300 text-lg font-medium">
                  Layout 1
                </Link>
              </li>
              <li>
                <Link href="/pagelayout/pagelayout2/" className="hover:text-yellow-400 transition duration-300 text-lg font-medium">
                  Layout 2
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4 bg-gray-50 rounded-lg shadow-lg my-10 relative z-10">
        {children}
      </main>

      <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 text-center shadow-lg relative z-10">
        <p className="text-lg font-semibold">&copy; 2025 Next.js App. All rights reserved.</p>
      </footer>
    </>
  );
}