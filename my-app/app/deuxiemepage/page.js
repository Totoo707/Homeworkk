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
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Search } from "lucide-react";

const LIMIT = 15;

// Fonction pour tronquer le texte
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

  // Toggle du tri
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

  const handleChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    setSearch(query);
    setPage(1);
  }, [query]);

  // Fonction pour l'ordre des dates
  const toggleDateOrder = () => {
    setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setSortBy("date");
    setPage(1);
  };

  // Fonction pour l'ordre des auteurs
  const toggleAuthorOrder = () => {
    setOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    setSortBy("auteur");
    setPage(1);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white px-2 sm:px-4 md:px-6 lg:px-8 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-2 sm:mb-0">
            Articles ({total})
          </h2>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-1">
              <Input
                className="bg-gray-800 text-white border-gray-600 placeholder:text-gray-400 w-40 sm:w-56"
                type="text"
                placeholder="Rechercher..."
                value={query}
                onChange={handleChange}
              />
              <Button variant="outline" size="icon" onClick={handleSearchSubmit}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="icon" onClick={() => setView("grid")}>
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setView("table")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {view === "table" ? (
          <div className="w-full overflow-x-auto">
            <div className="rounded-lg bg-white text-black shadow-md">
              <Table className="table-fixed w-full">
                <TableHeader className="bg-gray-800 text-white">
                  <TableRow>
                    <TableHead className="p-1 text-center w-8 sm:w-16">
                      Image
                    </TableHead>
                    <TableHead
                      className="cursor-pointer p-1 text-center w-28 sm:w-56 break-words"
                      onClick={() => toggleSort("titre")}
                    >
                      Titre
                    </TableHead>
                    <TableHead className="cursor-pointer p-1 text-center w-16 sm:w-20 break-words">
                      <div className="flex items-center justify-center">
                        Date
                        <Button
                          variant="link"
                          className="ml-1 text-[10px] sm:text-xs"
                          onClick={toggleDateOrder}
                        >
                          {order === "asc" ? "▲" : "▼"}
                        </Button>
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer p-1 text-center w-16 sm:w-20 break-words">
                      <div className="flex items-center justify-center">
                        Auteur
                        <Button
                          variant="link"
                          className="ml-1 text-[10px] sm:text-xs"
                          onClick={toggleAuthorOrder}
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
                        onClick={() =>
                          router.push(`/deuxiemepage/${article._id}`)
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
                  onClick={() => router.push(`/deuxiemepage/${article._id}`)}
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
              className="text-xs sm:text-sm"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Charger plus
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
