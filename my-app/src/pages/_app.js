import "./globals.css";
import { AuthProvider } from "../../context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </AuthProvider>
  );
}
