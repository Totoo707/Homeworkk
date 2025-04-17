"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { LayoutGrid, List, Search } from "lucide-react";

const LIMIT = 15;

const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + " ..." : text;
};

const fetchArticles = async ({ page, limit, search, sortBy, order }) => {
  try {
    const res = await axios.get("http://localhost:4000/api/articles", {
      params: { page, limit, search, sortBy, order },
    });
    return res.data;
  } catch (err) {
    console.error("Erreur de récupération des articles :", err);
    return { articles: [], total: 0, hasMore: false };
  }
};

export default function ArticlesPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("date");
  const [order, setOrder] = useState("desc");

  const loadArticles = async (currentPage) => {
    const data = await fetchArticles({
      page: currentPage,
      limit: LIMIT,
      search,
      sortBy,
      order,
    });
    if (currentPage === 1) {
      setArticles(data.articles);
    } else {
      setArticles((prev) => [...prev, ...data.articles]);
    }
    setHasMore(data.hasMore);
    setTotal(data.total);
  };

  useEffect(() => {
    loadArticles(1);
  }, [search, sortBy, order]);

  useEffect(() => {
    loadArticles(page);
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.offsetHeight - 100 &&
        hasMore
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  const toggleSort = useCallback(
    (field) => {
      if (sortBy === field) {
        setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(field);
        setOrder("asc");
      }
      setPage(1);
    },
    [sortBy]
  );

  const handleChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  function debounce(func, timeout = 800) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setPage(1);
    }, 800),
    []
  );

  function saveInput() {
    setSearch(query);
    setPage(1);
  }

  const handleSearchSubmit = debounce(() => saveInput());

  const toggleDateOrder = () => {
    setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setSortBy("date");
    setPage(1);
  };

  const toggleAuthorOrder = () => {
    setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setSortBy("auteur");
    setPage(1);
  };

  // Gestion de l'activation au clavier pour les lignes cliquables
  const handleKeyDownRow = (e, onClick) => {
    if (e.key === "Enter" || e.key === " ") {
      onClick();
    }
  };

  // Gestion de l'activation au clavier pour les éléments de tri
  const handleKeyDownSort = (e, onSort) => {
    if (e.key === "Enter" || e.key === " ") {
      onSort();
    }
  };

  return (
    <main
      id="main-content"
      className="relative min-h-screen bg-gray-900 text-white px-2 sm:px-4 md:px-6 lg:px-8 py-6"
    >
      <div className="max-w-5xl mx-auto">
        {/* En-tête de la page avec titre et barre de recherche */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-2 sm:mb-0">
            Articles ({total})
          </h2>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Champ de recherche avec zone de saisie agrandie */}
            <div className="flex items-center gap-2">
              <Input
                className="bg-gray-800 text-white border-gray-600 placeholder:text-gray-400 w-56 sm:w-72 h-12 text-lg px-4 py-3"
                type="text"
                placeholder="Rechercher..."
                value={query}
                onChange={handleChange}
                aria-label="Rechercher des articles"
              />
            </div>
            {/* Boutons pour changer de vue agrandis */}
            <Button
              variant="outline"
              className="px-4 py-3 text-lg"
              onClick={() => setView("grid")}
              aria-label="Vue en grille"
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="px-4 py-3 text-lg"
              onClick={() => setView("table")}
              aria-label="Vue en liste"
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {view === "table" ? (
          // Vue en tableau pour afficher les articles
          <div className="w-full overflow-x-auto">
            <div className="rounded-lg bg-white text-black shadow-md">
              <Table className="table-fixed w-full">
                <TableHeader className="bg-gray-800 text-white">
                  <TableRow>
                    {/* Colonne pour l'image */}
                    <TableHead
                      className="p-1 text-center w-8 sm:w-16"
                      scope="col"
                    >
                      Image
                    </TableHead>
                    {/* Colonne pour le titre (clic sortable) */}
                    <TableHead
                      className="cursor-pointer p-1 text-center w-28 sm:w-56 break-words"
                      onClick={() => toggleSort("titre")}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        handleKeyDownSort(e, () => toggleSort("titre"))
                      }
                      scope="col"
                      aria-label={`Trier par titre, actuellement trié en ordre ${order}`}
                    >
                      Titre
                    </TableHead>
                    {/* Colonne pour la date */}
                    <TableHead
                      className="cursor-pointer p-1 text-center w-16 sm:w-20 break-words"
                      role="button"
                      tabIndex={0}
                      onClick={toggleDateOrder}
                      onKeyDown={(e) => handleKeyDownSort(e, toggleDateOrder)}
                      scope="col"
                      aria-label={`Trier par date, actuellement trié en ordre ${order}`}
                    >
                      <div className="flex items-center justify-center">
                        Date
                        <Button
                          variant="link"
                          className="ml-1 text-[10px] sm:text-xs"
                          onClick={toggleDateOrder}
                          aria-label="Inverser l'ordre de tri par date"
                        >
                          {order === "asc" ? "▲" : "▼"}
                        </Button>
                      </div>
                    </TableHead>
                    {/* Colonne pour l'auteur */}
                    <TableHead
                      className="cursor-pointer p-1 text-center w-16 sm:w-20 break-words"
                      role="button"
                      tabIndex={0}
                      onClick={toggleAuthorOrder}
                      onKeyDown={(e) =>
                        handleKeyDownSort(e, toggleAuthorOrder)
                      }
                      scope="col"
                      aria-label={`Trier par auteur, actuellement trié en ordre ${order}`}
                    >
                      <div className="flex items-center justify-center">
                        Auteur
                        <Button
                          variant="link"
                          className="ml-1 text-[10px] sm:text-xs"
                          onClick={toggleAuthorOrder}
                          aria-label="Inverser l'ordre de tri par auteur"
                        >
                          {order === "asc" ? "▲" : "▼"}
                        </Button>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.length > 0 ? (
                    articles.map((article) => (
                      <TableRow
                        key={article._id}
                        className="cursor-pointer hover:bg-gray-100"
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          router.push(`/deuxiemepage/${article._id}`)
                        }
                        onKeyDown={(e) =>
                          handleKeyDownRow(e, () =>
                            router.push(`/deuxiemepage/${article._id}`)
                          )
                        }
                      >
                        <td className="p-1">
                          <img
                            src={`http://localhost:4000/api/articles/${article._id}/image`}
                            alt={article.titre}
                            className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-full"
                          />
                        </td>
                        <td className="p-1 text-black hover:text-blue-500 break-words">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/deuxiemepage/${article._id}`);
                            }}
                            className="cursor-pointer hover:underline"
                          >
                            {truncateText(article.titre, 50)}
                          </span>
                        </td>
                        <td className="p-1 text-center break-words">
                          {new Date(article.date).toLocaleDateString()}
                        </td>
                        <td className="p-1 text-center break-words">
                          {article.auteur}
                        </td>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <td colSpan={4} className="p-1 text-center text-gray-500">
                        Aucun article trouvé
                      </td>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          // Vue en grille (cartes)
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
          >
            {articles.length > 0 ? (
              articles.map((article) => (
                <motion.div
                  key={article._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl text-black"
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/deuxiemepage/${article._id}`)}
                  onKeyDown={(e) =>
                    handleKeyDownRow(e, () =>
                      router.push(`/deuxiemepage/${article._id}`)
                    )
                  }
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={`http://localhost:4000/api/articles/${article._id}/image`}
                    alt={article.titre}
                    className="w-full h-32 sm:h-40 object-cover"
                  />
                  <div className="p-2 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold mb-1">
                      {truncateText(article.titre, 50)}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {article.auteur}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {truncateText(article.contenu, 100)}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 text-center w-full">
                Aucun article trouvé.
              </p>
            )}
          </motion.div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-4">
            <Button
              className="px-6 py-4 text-lg"
              onClick={() => setPage((prev) => prev + 1)}
              aria-label="Charger plus d'articles"
            >
              Charger plus
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
